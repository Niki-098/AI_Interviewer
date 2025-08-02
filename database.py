# # from sqlalchemy import create_engine
# # from sqlalchemy.orm import sessionmaker
# # from sqlalchemy.ext.declarative import declarative_base


# # URL_DATABASE = 'postgresql://postgres:1234@LocalHost:5432/AI_Interviewer'

# # # # URL_DATABASE = 'postgresql://user:password@host:port/dbname'
# # # import os
# # # from dotenv import load_dotenv


# # engine = create_engine(URL_DATABASE)

# # SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# # Base = declarative_base()


# # database.py
# import os
# from dotenv import load_dotenv
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base

# # Load environment variables
# load_dotenv()

# # Replace your local URL with environment variable
# # URL_DATABASE = 'postgresql://postgres:@LocalHost:5432/AI_Interviewer'  
# URL_DATABASE = os.getenv("DATABASE_URL")

# # Create engine
# engine = create_engine(URL_DATABASE)

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# # Dependency to get database session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables
load_dotenv()

# Replace your local URL with environment variable
# URL_DATABASE = 'postgresql://postgres:1234@LocalHost:5432/AI_Interviewer'  # Remove this line
URL_DATABASE = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()