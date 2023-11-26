from datetime import date
from pydantic import BaseModel,validator 
from typing import List, Optional
from dataclasses import dataclass

class UserSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    username: str
    password: str
    dob: str
    currency: str
    language: str
    
@dataclass   
class RegisterSchema(BaseModel):
    email: str
    password: str

@dataclass
class TransactionSchema(BaseModel):
    description: str
    category: str
    amount: float
    type: str
    date: date
    
    @validator('date')
    def format_date(cls, v):
        return v.isoformat()