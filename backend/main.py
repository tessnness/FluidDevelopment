from pathlib import Path
import uuid, os, time, csv, io, requests
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi import Form
import smtplib, ssl, os
from email.message import EmailMessage
import re

# export PROJECTS_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vTZubpKdMoNablHbU6Q2WpuOVvUIGLnVt1_Q3douVFGUQsU88H3T2bTw4gornJXN3ap7wb9q3t4DBvC/pub?gid=0&single=true&output=csv"


csv_url = os.getenv("PROJECTS_CSV_URL")
cache_ttl = int(os.getenv("CACHE_TTL", "600"))

app = FastAPI(title="Projects via Google Sheets (CSV)")
_cache = { "ts": 0, "items": []}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.fluiddevelopment.ro",
        "https://fluiddevelopment.ro",
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)





# ID	Name	Description	Location	End Date	Category	Status	Featured	Images	Slug

class Project(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    location: Optional[str] = ""    
    end_date: Optional[str] = None        
    category: Optional[str] = ""
    status: Optional[str] = "Încheiat"
    featured: bool = False
    images: List[str] = []
    slug: str


def _date_key(s: Optional[str]) -> int:
    if not s:
        return 0
    try:
        dt = datetime.fromisoformat(s)
        return int(dt.strftime("%Y"))
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
    
    text = r.content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))

    
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
            end_date=row.get("End Date"),
            category=(row.get("Category") or "").strip(),
            status=(row.get("Status") or "Încheiat").strip() or "Încheiat",
            featured=_to_bool(row.get("Featured")),
            images=images,
            slug=slug,
        )

        items.append(p)
    
    def sort_key(p: Project):
        ts = _date_key(p.end_date)
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
def list_projects(q: Optional[str] = None, category: Optional[str] = None, status: Optional[str] = None, location: Optional[str] = None, featured: Optional[bool] = False):
    data = _fetch_projects()
    out = []
    for p in data:
        if status and (p.status or "Încheiat").lower() != status.lower():
            continue
        if category and (p.category or "").lower() != category.lower():
            continue
        if location and (p.location or "").lower() != location.lower():
            continue
        if featured and p.featured != featured:
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


SMTP_HOST = os.getenv("SMTP_HOST")        
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")       
SMTP_PASS = os.getenv("SMTP_PASS")
CONTACT_TO = os.getenv("CONTACT_TO", SMTP_USER)   
CONTACT_FROM = os.getenv("CONTACT_FROM", SMTP_USER)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

@app.post("/contact")
def contact(name: str = Form(...), email: str = Form(...), message: str = Form(...)):
    name = (name or "").strip()
    email = (email or "").strip()
    message = (message or "").strip()

    if not EMAIL_RE.match(email):
        raise HTTPException(400, "Email invalid")
    if not (1 <= len(name) <= 80):
        raise HTTPException(400, "Nume invalid")
    if not (1 <= len(message) <= 5000):
        raise HTTPException(400, "Mesaj prea scurt/lung")

    msg = EmailMessage()
    msg["Subject"] = f"[Contact] {name}"
    msg["From"] = CONTACT_FROM         
    msg["To"] = CONTACT_TO
    msg["Reply-To"] = email           
    msg.set_content(f"Nume: {name}\nEmail: {email}\n\n{message}")

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
        s.starttls(context=context)
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)

    return {"ok": True}









