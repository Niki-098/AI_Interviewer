# # from sqlalchemy import create_engine
# # from sqlalchemy.orm import sessionmaker
# # from sqlalchemy.ext.declarative import declarative_base

# # # URL_DATABASE = 'postgresql://postgres:1234@LocalHost:5432/AI_Interviewer'

# # # URL_DATABASE = 'postgresql://user:password@host:port/dbname'
# # import os
# # from dotenv import load_dotenv

# # load_dotenv()

# # URL_DATABASE = os.getenv("DATABASE_URL")

# # # engine = create_engine(URL_DATABASE)

# # # SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base = declarative_base()



# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
# import os
# from dotenv import load_dotenv

# load_dotenv()

# URL_DATABASE = os.getenv("DATABASE_URL")
# engine = create_engine(URL_DATABASE)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()
import os
print("Available environment variables:")
for key, value in os.environ.items():
    if 'DATABASE' in key or 'PG' in key:
        print(f"{key}: {value}")

DATABASE_URL = os.getenv('DATABASE_URL')
print(f"DATABASE_URL value: {DATABASE_URL}")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")