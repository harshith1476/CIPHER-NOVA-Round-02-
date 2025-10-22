from pymongo import MongoClient
from datetime import datetime
import os

# Global database connection
db = None

def init_db(mongo_uri):
    """Initialize MongoDB connection"""
    global db
    try:
        client = MongoClient(mongo_uri)
        db = client.get_database()
        print(f"✓ Connected to MongoDB: {db.name}")
        
        # Create indexes for better performance
        db.users.create_index("email", unique=True)
        db.products.create_index("distributor_id")
        db.orders.create_index("retailer_id")
        db.stock_history.create_index("product_id")
        
        print("✓ Database indexes created")
        return db
    except Exception as e:
        print(f"✗ Database connection error: {e}")
        return None

def get_db():
    """Get database instance"""
    return db

def get_collection(collection_name):
    """Get a specific collection"""
    if db is None:
        raise Exception("Database not initialized")
    return db[collection_name]
