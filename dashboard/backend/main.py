from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey, select
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from typing import List, Optional, Any
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from pydantic import BaseModel

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./ass31.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    industry_segment = Column(String, index=True)
    technical_employees_pct = Column(Float)
    ceo_id = Column(Integer, ForeignKey("people.id"))
    created_at = Column(DateTime, default=func.now())
    
    ceo = relationship("Person", back_populates="companies")
    investments = relationship("Investment", back_populates="company")
    news = relationship("News", back_populates="company")

class Person(Base):
    __tablename__ = "people"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    title = Column(String)
    linkedin_url = Column(String)
    created_at = Column(DateTime, default=func.now())
    
    companies = relationship("Company", back_populates="ceo")

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String, index=True)
    content = Column(Text)
    published_at = Column(DateTime, index=True)
    source = Column(String)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=func.now())
    
    company = relationship("Company", back_populates="news")

class Investment(Base):
    __tablename__ = "investments"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    round_type = Column(String)
    amount = Column(Float)
    currency = Column(String, default="USD")
    date = Column(DateTime, index=True)
    created_at = Column(DateTime, default=func.now())
    
    company = relationship("Company", back_populates="investments")

class Ranking(Base):
    __tablename__ = "rankings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    rank = Column(Integer, index=True)
    score = Column(Float)
    category = Column(String)
    created_at = Column(DateTime, default=func.now())
    
    company = relationship("Company")

class VC(Base):
    __tablename__ = "vcs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    website = Column(String)
    location = Column(String)
    investment_stage = Column(String)
    final_score = Column(Float, index=True)
    created_at = Column(DateTime, default=func.now())

class VCInvestment(Base):
    __tablename__ = "vc_investments"
    
    id = Column(Integer, primary_key=True, index=True)
    vc_id = Column(Integer, ForeignKey("vcs.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))
    investment_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class CompanyBase(BaseModel):
    name: str
    industry_segment: str
    technical_employees_pct: float

class Company(CompanyBase):
    id: int
    ceo_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class PersonBase(BaseModel):
    name: str
    title: str
    linkedin_url: Optional[str] = None

class Person(PersonBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class NewsBase(BaseModel):
    headline: str
    content: str
    published_at: datetime
    source: str

class News(NewsBase):
    id: int
    company_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvestmentBase(BaseModel):
    company_id: int
    round_type: str
    amount: float
    currency: str
    date: datetime

class Investment(InvestmentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class RankingBase(BaseModel):
    company_id: int
    rank: int
    score: float
    category: str

class Ranking(RankingBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class VCBase(BaseModel):
    name: str
    description: str
    website: Optional[str] = None
    location: Optional[str] = None
    investment_stage: Optional[str] = None

class VC(VCBase):
    id: int
    final_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaginatedResponse(BaseModel):
    page: int
    page_size: int
    total: int
    results: List[Any]

# Helper function to populate sample data
def populate_sample_data(db: Session):
    if db.execute(select(Company)).first() is not None:
        return
    
    # Create sample people
    ceo1 = Person(name="Sarah Chen", title="CEO", linkedin_url="https://linkedin.com/in/sarahchen")
    ceo2 = Person(name="Michael Rodriguez", title="CEO", linkedin_url="https://linkedin.com/in/michaelrodriguez")
    ceo3 = Person(name="Lisa Thompson", title="CEO", linkedin_url="https://linkedin.com/in/lisathompson")
    
    db.add_all([ceo1, ceo2, ceo3])
    db.commit()
    
    # Create sample companies
    company1 = Company(
        name="MediTech Solutions",
        industry_segment="medical-imaging",
        technical_employees_pct=75.0,
        ceo_id=ceo1.id
    )
    company2 = Company(
        name="HealthFlow",
        industry_segment="digital-health",
        technical_employees_pct=60.0,
        ceo_id=ceo2.id
    )
    company3 = Company(
        name="BioInnovate",
        industry_segment="biotech",
        technical_employees_pct=80.0,
        ceo_id=ceo3.id
    )
    
    db.add_all([company1, company2, company3])
    db.commit()
    
    # Create sample news
    news1 = News(
        headline="MediTech Solutions Raises $50M Series B",
        content="Medical imaging startup secures major funding round...",
        published_at=datetime.now() - timedelta(days=5),
        source="TechCrunch",
        company_id=company1.id
    )
    news2 = News(
        headline="HealthFlow Launches New Telemedicine Platform",
        content="Digital health company expands its offerings...",
        published_at=datetime.now() - timedelta(days=10),
        source="Healthcare Weekly",
        company_id=company2.id
    )
    
    db.add_all([news1, news2])
    db.commit()
    
    # Create sample investments
    investment1 = Investment(
        company_id=company1.id,
        round_type="Series B",
        amount=50000000,
        currency="USD",
        date=datetime.now() - timedelta(days=5)
    )
    investment2 = Investment(
        company_id=company2.id,
        round_type="Series A",
        amount=25000000,
        currency="USD",
        date=datetime.now() - timedelta(days=30)
    )
    
    db.add_all([investment1, investment2])
    db.commit()
    
    # Create sample rankings
    ranking1 = Ranking(company_id=company1.id, rank=1, score=95.5, category="overall")
    ranking2 = Ranking(company_id=company2.id, rank=2, score=88.2, category="overall")
    ranking3 = Ranking(company_id=company3.id, rank=3, score=82.1, category="overall")
    
    db.add_all([ranking1, ranking2, ranking3])
    db.commit()
    
    # Create sample VCs
    vc1 = VC(
        name="Sequoia Capital",
        description="Leading venture capital firm focused on technology investments",
        website="https://sequoiacap.com",
        location="Menlo Park, CA",
        investment_stage="multi-stage",
        final_score=95.8
    )
    vc2 = VC(
        name="Andreessen Horowitz",
        description="Silicon Valley venture capital firm",
        website="https://a16z.com",
        location="Menlo Park, CA",
        investment_stage="multi-stage",
        final_score=92.3
    )
    vc3 = VC(
        name="First Round Capital",
        description="Early-stage venture capital firm",
        website="https://firstround.com",
        location="San Francisco, CA",
        investment_stage="early-stage",
        final_score=87.6
    )
    
    db.add_all([vc1, vc2, vc3])
    db.commit()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create FastAPI app
app = FastAPI(title="NVoydia Dashboard API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to populate sample data - commented out for now
# @app.on_event("startup")
# async def startup_event():
#     db = SessionLocal()
#     try:
#         populate_sample_data(db)
#     finally:
#         db.close()

# API Endpoints
@app.get("/")
def read_root():
    return {"message": "NVoydia Dashboard API", "version": "1.0.0"}

@app.get("/companies", response_model=PaginatedResponse)
def get_companies(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    industry_segment: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = select(Company)
    
    if industry_segment:
        query = query.where(Company.industry_segment == industry_segment)
    
    if sort == "name":
        query = query.order_by(Company.name)
    elif sort == "-name":
        query = query.order_by(Company.name.desc())
    else:
        query = query.order_by(Company.id)
    
    total = db.execute(select(func.count()).select_from(query.subquery())).scalar()
    companies = db.execute(query.offset((page - 1) * page_size).limit(page_size)).scalars().all()
    
    return PaginatedResponse(
        page=page,
        page_size=page_size,
        total=total,
        results=companies
    )

@app.get("/companies/{company_id}", response_model=Company)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.execute(select(Company).where(Company.id == company_id)).scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@app.get("/companies/{company_id}/news", response_model=PaginatedResponse)
def get_company_news(
    company_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = select(News).where(News.company_id == company_id)
    
    total = db.execute(select(func.count()).select_from(query.subquery())).scalar()
    news = db.execute(query.order_by(News.published_at.desc()).offset((page - 1) * page_size).limit(page_size)).scalars().all()
    
    return PaginatedResponse(
        page=page,
        page_size=page_size,
        total=total,
        results=news
    )

@app.get("/news", response_model=PaginatedResponse)
def get_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    industry_segment: Optional[str] = None,
    date_range: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = select(News).join(Company)
    
    if industry_segment:
        query = query.where(Company.industry_segment == industry_segment)
    
    if date_range:
        now = datetime.now()
        if date_range == "2w":
            start_date = now - timedelta(weeks=2)
        elif date_range == "1m":
            start_date = now - timedelta(days=30)
        elif date_range == "1q":
            start_date = now - timedelta(days=90)
        elif date_range == "1y":
            start_date = now - timedelta(days=365)
        else:
            start_date = None
        
        if start_date:
            query = query.where(News.published_at >= start_date)
    
    if sort == "published_at":
        query = query.order_by(News.published_at)
    elif sort == "-published_at":
        query = query.order_by(News.published_at.desc())
    else:
        query = query.order_by(News.published_at.desc())
    
    total = db.execute(select(func.count()).select_from(query.subquery())).scalar()
    news = db.execute(query.offset((page - 1) * page_size).limit(page_size)).scalars().all()
    
    return PaginatedResponse(
        page=page,
        page_size=page_size,
        total=total,
        results=news
    )

@app.get("/investments", response_model=PaginatedResponse)
def get_investments(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    company_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = select(Investment)
    
    if company_id:
        query = query.where(Investment.company_id == company_id)
    
    query = query.order_by(Investment.date.desc())
    
    total = db.execute(select(func.count()).select_from(query.subquery())).scalar()
    investments = db.execute(query.offset((page - 1) * page_size).limit(page_size)).scalars().all()
    
    return PaginatedResponse(
        page=page,
        page_size=page_size,
        total=total,
        results=investments
    )

@app.get("/rankings", response_model=PaginatedResponse)
def get_rankings(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = select(Ranking).join(Company)
    
    if category:
        query = query.where(Ranking.category == category)
    
    query = query.order_by(Ranking.rank)
    
    total = db.execute(select(func.count()).select_from(query.subquery())).scalar()
    rankings = db.execute(query.offset((page - 1) * page_size).limit(page_size)).scalars().all()
    
    return PaginatedResponse(
        page=page,
        page_size=page_size,
        total=total,
        results=rankings
    )

@app.get("/people/{person_id}", response_model=Person)
def get_person(person_id: int, db: Session = Depends(get_db)):
    person = db.execute(select(Person).where(Person.id == person_id)).scalar_one_or_none()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

@app.get("/vcs", response_model=PaginatedResponse)
def get_vcs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort: Optional[str] = None,
    investment_stage: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = select(VC)
    
    if investment_stage:
        query = query.where(VC.investment_stage == investment_stage)
    
    if sort == "final_score":
        query = query.order_by(VC.final_score)
    elif sort == "-final_score":
        query = query.order_by(VC.final_score.desc())
    else:
        query = query.order_by(VC.final_score.desc())
    
    total = db.execute(select(func.count()).select_from(query.subquery())).scalar()
    vcs = db.execute(query.offset((page - 1) * page_size).limit(page_size)).scalars().all()
    
    return PaginatedResponse(
        page=page,
        page_size=page_size,
        total=total,
        results=vcs
    )

@app.get("/vcs/{vc_id}", response_model=VC)
def get_vc(vc_id: int, db: Session = Depends(get_db)):
    vc = db.execute(select(VC).where(VC.id == vc_id)).scalar_one_or_none()
    if not vc:
        raise HTTPException(status_code=404, detail="VC not found")
    return vc

@app.post("/vcs/recompute")
def recompute_vc_scores(db: Session = Depends(get_db)):
    return {"message": "VC score recomputation endpoint - implement your scoring algorithm here"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
