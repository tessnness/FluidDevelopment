from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, Response
from pathlib import Path
import pandas as pd, re
import uuid


excel_path = Path("data/FluidDevelopment-projects.xlsx")
_cache = {"mtime": None, "rows": []}

def slugify(s: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower()).strip("-")

def load_projects():
    m = excel_path.stat().st_mtime
    if _cache["mtime"] == m:
        return _cache["rows"]
    df = pd.read_excel(excel_path).fillna("")
    rows = []
    for i,r in df.iterrows():
        images = [u.strip() 
                  for u in str(r.get("Images", "")).split(",") 
                  if u.strip()]
        year = None
        try:
            y = str(r.get("Year", "")).strip()
            year = int(float(y)) if y else None
        except:
            pass
        slug = r.get("Slug") or slugify(str(r.get("Name", "Project")))
        rows.append({
            "id": int(r.get("ID", i+1)),
            "name": str(r.get("Name", "")),
            "description": str(r.get("Description", "")),
            "location": str(r.get("Location", "")),
            "year": year,
            "category": str(r.get("Category", "")),
            "status": str(r.get("Status", "")),
            "featured": str(r.get("Featured", "")).lower() in ("true", "1", "yes", "y"),
            "images": images,
            "slug": slug,
        })

    _cache["mtime"] = m
    _cache["rows"] = rows
    return rows
    
app = FastAPI()
app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:4200", "https://fluid-development.ro"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/api/projects")
def list_projects(q: str | None, page: int = 1, page_size: int = 20, category: str | None = None, year: int | None = None, featured: bool | None = None):
    data = load_projects()
    def match(p):
        ok = True
        if q:
            ql = q.lower()
            ok &= ql in p["name"].lower() or ql in p["description"].lower() or ql in p["location"].lower()
        
        if category:
            ok &= p["category"].lower() == category.lower()
        if year:
            ok &= p["year"] == year
        if featured != None:
            ok &= p["featured"] == featured
        return ok
    filtered = [p for p in data if match(p)]
    s, e = (page-1)*page_size, (page-1)*page_size + page_size
    return {"items":filtered[s:e], "total": len(filtered)}

@app.get("api/projects/{slug}")
def get_project(slug: str):
    for p in load_projects():
        if p["slug"] == slug:
            return p
        raise HTTPException(404, "Not Found")

@app.get("/robots.txt", response_class = PlainTextResponse)
def robots():
    return "Sitemap: https://fluid-development.ro/sitemap.xml\nAllow: /\n"

@app.get("sitemap.xml")
def sitemap():
    from fastapi.responses import Response
    base = "https://fluid-development.ro"
    urls = ["/", "/about", "/projects", "/contact"]
    for p in load_projects():
        urls.append(f"/projects/{p['slug']}")
    xml = """<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n"""

    for u in urls:
        xml += f" <url><loc>{base}{u}</loc></url>\n"
    xml += "</urlset>"
    return Response(xml, media_type="application/xml")
    
