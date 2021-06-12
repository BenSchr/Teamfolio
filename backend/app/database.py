from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import sys

# determine if application is a script file or frozen exe
if getattr(sys, 'frozen', False):
    filepath = os.path.dirname(sys.executable)
elif __file__:
    filepath = os.path.dirname(__file__)
DATABASE_URL = "sqlite:///"+os.path.join(filepath, "..","db","test.db")
print(DATABASE_URL)
# DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()