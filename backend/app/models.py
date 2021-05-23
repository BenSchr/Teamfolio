from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,Date
from sqlalchemy.orm import relationship

from .database import Base


class Abteilung(Base):
    __tablename__="abteilung"
    abteilung_id=Column(Integer,primary_key=True,index=True)
    name=Column(String(50))

class User(Base):
    __tablename__="user"
    user_id = Column(Integer, primary_key=True, index=True)
    abteilung_id=Column(Integer,ForeignKey("abteilung.abteilung_id"))
    steckbrief_id=Column(Integer,ForeignKey("steckbrief.steckbrief_id"))
    beruf=Column(String(50))
    vorname=Column(String(50))
    nachname=Column(String(50))
    geburtsdatum=Column(Date)
    wohnort=Column(String(50))

class Collection(Base):
    __tablename__="collection"
    user_id_aktiv=Column(Integer,ForeignKey("user.user_id"),primary_key=True)
    user_id_passiv=Column(Integer,ForeignKey("user.user_id"),primary_key=True)


class Steckbrief(Base):
    __tablename__="steckbrief"
    steckbrief_id = Column(Integer, primary_key=True, index=True)
    freigegeben= Column(Boolean,server_default="1")

class Steckbrief_Frage(Base):
    __tablename__="steckbrief_frage"
    steckbrief_id = Column(Integer,ForeignKey("steckbrief.steckbrief_id"), primary_key=True)
    frage_id = Column(Integer,ForeignKey("frage.frage_id"), primary_key=True)
    antwort=Column(String(200))

class Frage(Base):
    __tablename__="frage"
    frage_id=Column(Integer,primary_key=True)
    frage=Column(String(200))

class Dummy_Antwort(Base):
    __tablename__="dummy_antwort"
    dummy_antwort_id=Column(Integer,primary_key=True, index=True)
    frage_id=Column(Integer,ForeignKey("frage.frage_id"))
    antwort=Column(String(200))
