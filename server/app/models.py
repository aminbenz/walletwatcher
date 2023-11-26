from sqlalchemy import func,  Column, Integer, String, Date, Float,DateTime
from app import db
from dataclasses import dataclass

@dataclass
class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    first_name = db.Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    dob = Column(Date)
    language = Column(String)
    currency = Column(String)
    
@dataclass
class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True)
    date = Column(Date)
    description = Column(String)
    category = Column(String)
    amount = Column(Float)
    type = Column(String)
    created_by_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

