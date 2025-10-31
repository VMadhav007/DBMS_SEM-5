"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import user, admin

# Create FastAPI app
app = FastAPI(
    title="Fitness Management System API",
    description="Complete Fitness Management System with MySQL DBMS",
    version="1.0.0"
)

# CORS middleware - Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user.router)
app.include_router(admin.router)


@app.get("/")
def root():
    """
    Root endpoint
    """
    return {
        "message": "Welcome to Fitness Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "database": "Fitness_DB"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "message": "API is running successfully"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
