"""
Authentication utilities for password hashing and verification
"""
import bcrypt
from datetime import datetime, timedelta
from typing import Optional


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
    
    Returns:
        Hashed password string
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hashed password
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password to compare against
    
    Returns:
        True if password matches, False otherwise
    """
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def generate_session_token() -> str:
    """
    Generate a simple session token (timestamp-based)
    For production, use proper JWT or session management
    
    Returns:
        Session token string
    """
    import secrets
    return secrets.token_urlsafe(32)
