from pydantic import BaseModel
import datetime
from pydantic import BaseModel
from typing import List, Optional

## USER ##

class UserBase(BaseModel):
    abteilung: str
    steckbrief_id: int
    beruf: str
    vorname: str
    nachname: str
    geburtsdatum: Optional[datetime.date]
    wohnort: Optional[str]

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    pass

class User(UserBase):
    user_id: int

    class Config:
        orm_mode = True

class UserCollected(User):
    gesammelt:bool

    class Config:
        orm_mode = True


## Frage_Antwort ##

class Frage_Antwort(BaseModel):
    steckbrief_id: int
    frage_id: int
    frage:str
    antwort: str

    class Config:
        orm_mode = True

## Steckbrief ##

class SteckbriefBase(BaseModel):
    user_id: int
    freigegeben: bool 

class SteckbriefCreate(SteckbriefBase):
    pass

class Steckbrief(SteckbriefBase):
    steckbrief_id:int
    fragen: List[Frage_Antwort]

    class Config:
        orm_mode = True


## Quiz ##

class Quiz_Frage(BaseModel):
    frage_id:int
    frage:str
    antwort_original:str
    catalog:List[str]

class Quiz(BaseModel):
    __root__:List[Quiz_Frage]



## Collection ##
class Collection(BaseModel):
    user_id_aktiv:int
    user_id_passiv:int