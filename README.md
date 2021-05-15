<p align="center">
<img align=center alt="Teamfolio Logo" width="70%" src="frontend/public/static/images/logo/teamfolio_logo.png" /></p>


# Teamfolio

project for university to create a complex application

# Structure

```
.  
├── backend/                # Folder for API + DB  
|   ├── app/                # Stores FastAPI logic
|   │   ├── database.py     # Functions for connecting to database
|   │   ├── main.py         # FastAPI routing
|   │   ├── models.py       # SQLAlchemy database models
|   │   ├── queries.py      # Queries used by FastAPI
|   │   └── schemas.py      # Pydantic Models for json requests and respones
│   ├── db/..               # SQLite file and testdata
│   ├── jupyter/..          # Jupyter Notebooks
|   └── req.txt             # Libraries used by python env
|   
├── fronted                 # React Frontend
...
```
