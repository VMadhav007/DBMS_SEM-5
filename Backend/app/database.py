"""
Database connection and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/Fitness_DB"
)

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False  # Set to True for SQL query logging
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


# Dependency to get database session
def get_db():
    """
    FastAPI dependency that provides a database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Function to execute stored procedures
def call_procedure(db, procedure_name: str, params: list):
    """
    Execute a stored procedure with parameters
    
    Args:
        db: Database session
        procedure_name: Name of the stored procedure
        params: List of parameters to pass to the procedure
    
    Returns:
        Result of the procedure execution
    """
    placeholders = ', '.join(['%s'] * len(params))
    query = f"CALL {procedure_name}({placeholders})"
    result = db.execute(query, params)
    db.commit()
    return result


# Function to execute custom queries
def execute_query(db, query: str, params: dict = None):
    """
    Execute a custom SQL query
    
    Args:
        db: Database session
        query: SQL query string
        params: Dictionary of parameters for the query
    
    Returns:
        Query results
    """
    if params:
        result = db.execute(query, params)
    else:
        result = db.execute(query)
    return result.fetchall()
