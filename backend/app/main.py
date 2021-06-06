from typing import List

import databases
import sqlalchemy
from fastapi import FastAPI,Depends, HTTPException

from fastapi.middleware.cors import CORSMiddleware

import sys
from sqlalchemy.orm import Session
# Add the ptdraft folder path to the sys.path list
sys.path.append('..')
from app import models
from app.schemas import *
from app.database import engine,SessionLocal
from app.queries import *
from fastapi.encoders import jsonable_encoder

# # SQLAlchemy specific code, as with any other app
# DATABASE_URL = "sqlite:///./db/test.db"
# # DATABASE_URL = "postgresql://user:password@postgresserver/db"

# database = databases.Database(DATABASE_URL)

# metadata = sqlalchemy.MetaData()

# cards = sqlalchemy.Table(
#     "cards",
#     metadata,
#     sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
#     sqlalchemy.Column("name", sqlalchemy.String),
#     sqlalchemy.Column("value", sqlalchemy.Integer),
# )

# engine = sqlalchemy.create_engine(
#     DATABASE_URL, connect_args={"check_same_thread": False}
# )


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()






app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:5000",
    "localhost:5000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# @app.on_event("startup")
# async def startup():
#     await database.connect()


# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()


# @app.get("/cards/", response_model=List[Card])
# async def read_cards():
#     query = cards.select()
#     return await database.fetch_all(query)


# @app.post("/cards/", response_model=Card)
# async def create_card(card: CardIn):
#     query = cards.insert().values(name=card.name, value=card.value)
#     last_record_id = await database.execute(query)
#     return {**card.dict(), "id": last_record_id}

@app.get("/user/", response_model=List[User])
async def read_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/user/{user_id}", response_model=User)
async def read_users(user_id:int,db: Session = Depends(get_db)):
    return get_user(db,user_id=user_id)


@app.get("/user/{user_id}/steckbrief", response_model=List[Frage_Antwort])
async def read_test(user_id:int,db: Session = Depends(get_db)):
    return  get_steckbrief_by_user(db,user_id=user_id)


@app.get("/user/{user_id}/quiz", response_model=Quiz)
async def get_quiz_by_user(user_id:int,db: Session = Depends(get_db)):
    test=create_quiz_for_user(db,user_id=user_id)  
    return  Quiz.parse_obj(test)

@app.get("/user/{user_id}/collection", response_model=List[UserCollected])
async def create_collection_by_userid(user_id:int,db: Session = Depends(get_db)):
    return get_collection_by_userid(db,user_id=user_id)

@app.post("/collection/create")
async def create_collection(collection: Collection,db: Session = Depends(get_db)):
    try:
        return create_collection_entry(db,collection)
    except:
        raise HTTPException(status_code=400, detail="Could not create user",headers={"X-Error": "There goes my error"})

@app.delete("/collection/delete")
async def delete_collection(entry: Collection,db: Session = Depends(get_db)):
    response = db.query(models.Collection).filter(models.Collection.user_id_aktiv==entry.user_id_aktiv,models.Collection.user_id_passiv==entry.user_id_passiv).delete()
    db.commit()
    return {"numDelRows":response}

@app.delete("/erfolg/delete")
async def delete_erfolg(entry: Erfolg_User,db: Session = Depends(get_db)):
    response = db.query(models.Erfolg_User).filter(models.Erfolg_User.user_id==entry.user_id,models.Erfolg_User.erfolg_id==entry.erfolg_id).delete()
    db.commit()
    return {"numDelRows":response}


@app.post("/user/{user_id}/check_achievements",response_model=List[Erfolg_gesammelt])
async def check_achievements(user_id:int,db:Session = Depends(get_db)):
    achievements=get_achievements(db,user_id)
    collection_size=get_size_collection(db,user_id)
    new_achievements=achievement_helper([x for x in achievements if x["gesammelt"]==0],collection_size)
    results=[]
    for new in new_achievements:
        results.append(create_erfolg_user_entry(db,Erfolg_User.parse_obj({"user_id":user_id,"erfolg_id":new["erfolg_id"]})))

    return new_achievements

@app.get("/user/{user_id}/get_achievements",response_model=List[Erfolg_gesammelt])
async def get_achievements_user(user_id:int,db:Session = Depends(get_db)):
    return get_achievements(db,user_id)   