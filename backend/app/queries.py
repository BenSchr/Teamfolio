from sqlalchemy import case
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import Float,Integer
import pandas as pd
import random
from app import models, schemas
import sys
sys.path.append('..')


def get_user(db: Session, user_id: int):
    user = models.User
    abteilung = models.Abteilung
    return db.query(user.user_id,
                    abteilung.name.label('abteilung'),
                    user.steckbrief_id,
                    user.beruf,
                    user.vorname,
                    user.nachname,
                    user.geburtsdatum,
                    user.wohnort).join(abteilung).filter(user.user_id == user_id).first()


def get_steckbrief_by_user(db: Session, user_id: int):
    return db.query(models.User, models.Steckbrief, models.Steckbrief_Frage, models.Frage)\
        .with_entities(models.Steckbrief.steckbrief_id, models.Frage.frage_id, models.Frage.frage, models.Steckbrief_Frage.antwort)\
        .filter(models.User.steckbrief_id == models.Steckbrief.steckbrief_id,
                models.Steckbrief.steckbrief_id == models.Steckbrief_Frage.steckbrief_id,
                models.Steckbrief_Frage.frage_id == models.Frage.frage_id,
                models.User.user_id == user_id).all()


def create_quiz_for_user(db: Session, user_id: int):
    df = pd.read_sql(db.query(models.User, models.Steckbrief, models.Steckbrief_Frage, models.Frage)
                     .with_entities(models.Steckbrief.steckbrief_id, models.Frage.frage_id, models.Frage.frage, models.Steckbrief_Frage.antwort)
                     .filter(models.User.steckbrief_id == models.Steckbrief.steckbrief_id,
                             models.Steckbrief.steckbrief_id == models.Steckbrief_Frage.steckbrief_id,
                             models.Steckbrief_Frage.frage_id == models.Frage.frage_id,
                             models.User.user_id == user_id).statement, db.bind)
    df = df[["frage_id", "frage", "antwort"]]

    query_dummy = db.query(models.Dummy_Antwort).filter(
        models.Dummy_Antwort.frage_id.in_(df["frage_id"].tolist()))
    query_user = db.query(models.Steckbrief_Frage).filter(
        models.Steckbrief_Frage.frage_id.in_(df["frage_id"].tolist()))

    dummy_answers = pd.read_sql(query_dummy.statement, db.bind)[
        ["frage_id", "antwort"]].drop_duplicates()
    user_answers = pd.read_sql(query_user.statement, db.bind)[
        ["frage_id", "antwort"]].drop_duplicates()

    union_answers = pd.concat([user_answers, dummy_answers])

    df = (df.merge(union_answers.groupby('frage_id')['antwort'].apply(
        list), how="left", on="frage_id", suffixes=["_original", "_extra"]))
    quiz_dict = df.T.to_dict().values()
    quiz_list = []
    for row in quiz_dict:
        catalog = []
        catalog.append(row["antwort_original"])
        random.shuffle(row["antwort_extra"])
        catalog += [x for x in row["antwort_extra"]
                    if x != row["antwort_original"]][:3]
        random.shuffle(catalog)
        row["catalog"] = catalog
        del row['antwort_extra']
        quiz_list.append(row)
    random.shuffle(quiz_list)
    return quiz_list[:5]


def get_collection_by_userid(db: Session, user_id: int):
    collection = db.query(models.Collection).filter(
        models.Collection.user_id_aktiv == user_id).subquery()
    abteilung = models.Abteilung
    user = models.User
    users = db.query(user.user_id,
                     abteilung.name.label('abteilung'),
                     user.steckbrief_id,
                     user.beruf,
                     user.vorname,
                     user.nachname,
                     user.geburtsdatum,
                     user.wohnort).join(abteilung).subquery()

    check_collected = case([
        (collection.c.user_id_aktiv != None, 1)],
        else_=0
    )

    return db.query(*users.c, check_collected.label('gesammelt')).outerjoin(collection, users.c.user_id == collection.c.user_id_passiv).filter(users.c.user_id != user_id).all()


def get_collected_by_userid(db: Session, user_id: int):
    collection = db.query(models.Collection).filter(
        models.Collection.user_id_aktiv == user_id).subquery()
    user = models.User
    result=db.query(user.user_id, user.vorname, user.nachname).join(collection, collection.c.user_id_passiv == user.user_id).filter(user.user_id != user_id).all()
    return[dict(zip(['user_id', 'vorname', 'nachname'], r)) for r in result]


def create_collection_entry(db: Session, collection: schemas.Collection):
    entry = models.Collection(
        user_id_aktiv=collection.user_id_aktiv, user_id_passiv=collection.user_id_passiv)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def create_erfolg_user_entry(db: Session, entry: schemas.Erfolg_User):
    new_entry = models.Erfolg_User(
        user_id=entry.user_id, erfolg_id=entry.erfolg_id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry


def get_size_collection(db: Session, user_id: int):
    return db.query(models.Collection).filter(models.Collection.user_id_aktiv == user_id).count()


def get_achievements(db: Session, user_id: int):
    collection = db.query(models.Erfolg_User).filter(
        models.Erfolg_User.user_id == user_id).subquery()

    check_collected = case([
        (collection.c.user_id != None, 1)],
        else_=0
    )

    result = db.query(models.Erfolg.erfolg_id, models.Erfolg.name, models.Erfolg.bildpfad, check_collected.label(
        'gesammelt')).outerjoin(collection, models.Erfolg.erfolg_id == collection.c.erfolg_id).all()
    return [dict(zip(['erfolg_id', 'name', 'bildpfad', 'gesammelt'], r)) for r in result]


def calculate_achievement_stats(db: Session):
    user_count = db.query(models.User).count()
    erfolg_count = db.query(models.Erfolg_User.erfolg_id, func.count(
        models.Erfolg_User.erfolg_id).label("count")).group_by(models.Erfolg_User.erfolg_id).subquery()
        
    check_count = case([
        (erfolg_count.c.count == None, 0)],
        else_=(erfolg_count.c.count.cast(Float)/user_count*100).cast(Integer)
    )

    result = db.query(models.Erfolg.erfolg_id,
                      check_count).outerjoin(erfolg_count).all()
    return [dict(zip(['erfolg_id', 'percent'], r)) for r in result]

def achievement_helper(missing_achievements, size_collection: int):
    new_achievements = []
    for a in missing_achievements:
        name = a["name"]
        if name == "1_User":
            if size_collection >= 1:
                new_achievements.append(a)

        elif name == "5_User":
            if size_collection >= 5:
                new_achievements.append(a)

        elif name == "10_User":
            if size_collection >= 10:
                new_achievements.append(a)

    return new_achievements
