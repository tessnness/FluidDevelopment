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









