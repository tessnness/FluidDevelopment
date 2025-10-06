from pathlib import Path
import pandas as pd, re
import uuid, os, time, csv, io, requests
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse






# export PROJECTS_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vTZubpKdMoNablHbU6Q2WpuOVvUIGLnVt1_Q3douVFGUQsU88H3T2bTw4gornJXN3ap7wb9q3t4DBvC/pub?gid=0&single=true&output=csv"

csv_url = os.getenv("PROJECTS_CSV_URL")
cache_ttl = int(os.getenv("CACHE_TTL", "600"))

app = FastAPI(title="Projects via Google Sheets (CSV)")
_cache = { "ts": 0, "items": []}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATE_FORMATS = (
    "%Y-%m-%d",
    "%d/%m/%Y", "%m/%d/%Y",
    "%d.%m.%Y", "%Y.%m.%d",
    "%d-%m-%Y", "%m-%d-%Y",
    "%d/%m/%y", "%m/%d/%y", 
    "%d.%m.%y", "%d-%m-%y",
)


# ID	Name	Description	Location	Start Date	End Date	Category	Status	Featured	Images	Slug

class Project(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    location: Optional[str] = ""
    start_date: Optional[str] = None     
    end_date: Optional[str] = None        
    category: Optional[str] = ""
    status: Optional[str] = "published"
    featured: bool = False
    images: List[str] = []
    slug: str


def _parse_date(s: Optional[str]) -> Optional[str]:
    s = (s or "").strip()
    if not s:
        return None
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(s, fmt).date().isoformat() 
        except ValueError:
            pass
    return None

def _date_key(s: Optional[str]) -> int:
    """Return YYYYMMDD as int for sorting (0 if missing/unknown)."""
    if not s:
        return 0
    try:
        dt = datetime.fromisoformat(s)  # works because _parse_date returns ISO
        return int(dt.strftime("%Y%m%d"))
    except Exception:
        return 0


def _to_bool(x) -> bool:
    return str(x).strip().lower() in ("1", "true", "yes", "y")

def _slugify(s) -> str:
    import re
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", "-", s)
    return re.sub(r"[^a-z0-9-]", "", s).strip("-")


def _fetch_projects() -> List[Project]:
    now = time.time()
    if _cache["items"] and now - _cache["ts"] < cache_ttl:
        return _cache["items"]
    
    if not csv_url:
        raise HTTPException(500, "PROJECTS_CSV_URL not set")
    
    r = requests.get(csv_url, timeout=10)
    if r.status_code != 200:
        raise HTTPException(502, "Failed to fetch Google Sheets CSV")
    
    reader = csv.DictReader(io.StringIO(r.text))
    items: List[Project] = []
    for row in reader:
        images_raw = (row.get("Images") or "").strip()
        images = [u.strip() for u in images_raw.split(",") if u.strip()]
        slug = (row.get("Slug") or "").strip() or _slugify(row.get("Name", ""))

        p = Project(
            id=str(row.get("ID", "")).strip(),
            name=(row.get("Name") or "").strip(),
            description=(row.get("Description") or "").strip(),
            location=(row.get("Location") or "").strip(),
            start_date=_parse_date(row.get("Start Date")),
            end_date=_parse_date(row.get("End Date")),
            category=(row.get("Category") or "").strip(),
            status=(row.get("Status") or "published").strip() or "published",
            featured=_to_bool(row.get("Featured")),
            images=images,
            slug=slug,
        )

        items.append(p)
    
    def sort_key(p: Project):
        ts = _date_key(p.start_date)
        return (not p.featured, ts == 0, -ts, p.name.lower())
    
    items.sort(key=sort_key)
    _cache.update({"ts": now, "items": items})
    return items

@app.get("/")
def home():
    return JSONResponse({
        "ok": True,
        "message": "FluidDevelopment Projects API",
        "endpoints": ["/projects", "/projects/{slug}", "/docs"],
        "csv_url_set": bool(csv_url)
    })

@app.get("/projects", response_model=List[Project])
def list_projects(q: Optional[str] = None, category: Optional[str] = None, status: Optional[str] = None):
    data = _fetch_projects()
    out = []
    for p in data:
        if status and (p.status or "published").lower() != status.lower():
            continue
        if category and (p.category or "").lower() != category.lower():
            continue
        if q:
            hay = f"{p.name} {p.description} {p.location} {p.category}".lower()
            if q.lower() not in hay:
                continue
        out.append(p)
    return out

@app.get("/projects/{slug}", response_model=Project)
def get_project(slug: str):
    for p in _fetch_projects():
        if p.slug == slug:
            return p
    raise HTTPException(404, "Project not found")










# excel_path = Path("data/FluidDevelopment-projects.xlsx")
# _cache = {"mtime": None, "rows": []}

# def slugify(s: str) -> str:
#     return re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower()).strip("-")

# def load_projects():
#     m = excel_path.stat().st_mtime
#     if _cache["mtime"] == m:
#         return _cache["rows"]
#     df = pd.read_excel(excel_path).fillna("")
#     rows = []
#     for i,r in df.iterrows():
#         images = [u.strip() 
#                   for u in str(r.get("Images", "")).split(",") 
#                   if u.strip()]
#         year = None
#         try:
#             y = str(r.get("Year", "")).strip()
#             year = int(float(y)) if y else None
#         except:
#             pass
#         slug = r.get("Slug") or slugify(str(r.get("Name", "Project")))
#         rows.append({
#             "id": int(r.get("ID", i+1)),
#             "name": str(r.get("Name", "")),
#             "description": str(r.get("Description", "")),
#             "location": str(r.get("Location", "")),
#             "year": year,
#             "category": str(r.get("Category", "")),
#             "status": str(r.get("Status", "")),
#             "featured": str(r.get("Featured", "")).lower() in ("true", "1", "yes", "y"),
#             "images": images,
#             "slug": slug,
#         })

#     _cache["mtime"] = m
#     _cache["rows"] = rows
#     return rows
    
# app = FastAPI()
# app.add_middleware(
#         CORSMiddleware,
#         allow_origins=["http://localhost:4200", "https://fluid-development.ro"],
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )

# @app.get("/api/projects")
# def list_projects(q: str | None, page: int = 1, page_size: int = 20, category: str | None = None, year: int | None = None, featured: bool | None = None):
#     data = load_projects()
#     def match(p):
#         ok = True
#         if q:
#             ql = q.lower()
#             ok &= ql in p["name"].lower() or ql in p["description"].lower() or ql in p["location"].lower()
        
#         if category:
#             ok &= p["category"].lower() == category.lower()
#         if year:
#             ok &= p["year"] == year
#         if featured != None:
#             ok &= p["featured"] == featured
#         return ok
#     filtered = [p for p in data if match(p)]
#     s, e = (page-1)*page_size, (page-1)*page_size + page_size
#     return {"items":filtered[s:e], "total": len(filtered)}

# @app.get("api/projects/{slug}")
# def get_project(slug: str):
#     for p in load_projects():
#         if p["slug"] == slug:
#             return p
#         raise HTTPException(404, "Not Found")

# @app.get("/robots.txt", response_class = PlainTextResponse)
# def robots():
#     return "Sitemap: https://fluid-development.ro/sitemap.xml\nAllow: /\n"

# @app.get("sitemap.xml")
# def sitemap():
#     from fastapi.responses import Response
#     base = "https://fluid-development.ro"
#     urls = ["/", "/about", "/projects", "/contact"]
#     for p in load_projects():
#         urls.append(f"/projects/{p['slug']}")
#     xml = """<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n"""

#     for u in urls:
#         xml += f" <url><loc>{base}{u}</loc></url>\n"
#     xml += "</urlset>"
#     return Response(xml, media_type="application/xml")
    
