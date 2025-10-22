"""
Comprehensive Data Seeding Script
Generates realistic B2B marketplace data:
- 1000+ products across 15 categories
- 500 retailers with different types and loyalty tiers
- 200 distributors
- 50,000+ orders with seasonal patterns
- 25,000+ user sessions
"""

import random
import sys
import os
from datetime import datetime, timedelta
from faker import Faker
from pymongo import MongoClient
import bcrypt

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

fake = Faker(['en_IN'])

# Configuration
MONGO_URI = 'mongodb://localhost:27017/qwipo_ai'

# Product Categories with seasonal patterns
CATEGORIES = {
    'beverages': {
        'products': ['Cola', 'Juice', 'Water', 'Energy Drink', 'Tea', 'Coffee'],
        'brands': ['Coca-Cola', 'Pepsi', 'Tropicana', 'Red Bull', 'Tata Tea', 'Nescafe'],
        'seasonal_boost': {'monsoon': 1.2, 'summer': 1.5, 'winter': 1.0, 'festival': 1.3}
    },
    'snacks': {
        'products': ['Chips', 'Namkeen', 'Biscuits', 'Cookies', 'Wafers', 'Nuts'],
        'brands': ['Lays', 'Haldirams', 'Parle', 'Britannia', 'Pringles', 'Kurkure'],
        'seasonal_boost': {'monsoon': 1.3, 'summer': 1.1, 'winter': 1.2, 'festival': 1.6}
    },
    'instant_foods': {
        'products': ['Noodles', 'Pasta', 'Soup', 'Ready Mix', 'Instant Rice', 'Vermicelli'],
        'brands': ['Maggi', 'Yippee', 'Top Ramen', 'Knorr', 'MTR', 'Pillsbury'],
        'seasonal_boost': {'monsoon': 1.4, 'summer': 1.0, 'winter': 1.3, 'festival': 1.2}
    },
    'dairy_products': {
        'products': ['Milk', 'Butter', 'Cheese', 'Curd', 'Paneer', 'Ghee'],
        'brands': ['Amul', 'Mother Dairy', 'Britannia', 'Nestle', 'Heritage', 'Nandini'],
        'seasonal_boost': {'monsoon': 1.0, 'summer': 0.9, 'winter': 1.2, 'festival': 1.4}
    },
    'packaged_foods': {
        'products': ['Rice', 'Wheat Flour', 'Pulses', 'Sugar', 'Salt', 'Spices'],
        'brands': ['India Gate', 'Aashirvaad', 'Tata', 'Fortune', 'Daawat', 'Pillsbury'],
        'seasonal_boost': {'monsoon': 1.1, 'summer': 1.0, 'winter': 1.1, 'festival': 1.5}
    },
    'personal_care': {
        'products': ['Soap', 'Shampoo', 'Toothpaste', 'Detergent', 'Face Wash', 'Hand Wash'],
        'brands': ['Dove', 'Lux', 'Colgate', 'Surf Excel', 'Dettol', 'Lifebuoy'],
        'seasonal_boost': {'monsoon': 1.1, 'summer': 1.2, 'winter': 1.0, 'festival': 1.3}
    },
    'household': {
        'products': ['Cleaner', 'Detergent', 'Dishwash', 'Bleach', 'Air Freshener', 'Wipes'],
        'brands': ['Vim', 'Lizol', 'Harpic', 'Domex', 'Colin', 'Dettol'],
        'seasonal_boost': {'monsoon': 1.2, 'summer': 1.1, 'winter': 1.0, 'festival': 1.4}
    },
    'confectionery': {
        'products': ['Chocolate', 'Candy', 'Toffee', 'Chewing Gum', 'Mints', 'Lollipop'],
        'brands': ['Cadbury', 'Nestle', 'Ferrero', 'Amul', 'Parle', 'Eclairs'],
        'seasonal_boost': {'monsoon': 1.0, 'summer': 1.1, 'winter': 1.2, 'festival': 1.7}
    },
    'frozen_foods': {
        'products': ['Ice Cream', 'Frozen Veg', 'Frozen Meat', 'Frozen Snacks', 'Frozen Dessert'],
        'brands': ['Amul', 'Mother Dairy', 'Vadilal', 'Kwality Walls', 'McCain', 'Sumeru'],
        'seasonal_boost': {'monsoon': 0.8, 'summer': 1.6, 'winter': 0.7, 'festival': 1.2}
    },
    'bakery': {
        'products': ['Bread', 'Buns', 'Cakes', 'Pastries', 'Cookies', 'Rusks'],
        'brands': ['Britannia', 'Modern', 'Harvest Gold', 'English Oven', 'Parle', 'Bonn'],
        'seasonal_boost': {'monsoon': 1.0, 'summer': 1.0, 'winter': 1.1, 'festival': 1.5}
    },
    'health_nutrition': {
        'products': ['Protein Powder', 'Health Drink', 'Supplements', 'Energy Bar', 'Cereal'],
        'brands': ['Horlicks', 'Bournvita', 'Boost', 'Complan', 'Protinex', 'Kelloggs'],
        'seasonal_boost': {'monsoon': 1.1, 'summer': 1.2, 'winter': 1.3, 'festival': 1.1}
    },
    'sauces_condiments': {
        'products': ['Ketchup', 'Sauce', 'Pickle', 'Jam', 'Honey', 'Vinegar'],
        'brands': ['Kissan', 'Maggi', 'Heinz', 'Veeba', 'Tops', 'Dabur'],
        'seasonal_boost': {'monsoon': 1.0, 'summer': 1.1, 'winter': 1.0, 'festival': 1.3}
    },
    'oils_ghee': {
        'products': ['Cooking Oil', 'Mustard Oil', 'Olive Oil', 'Ghee', 'Vanaspati'],
        'brands': ['Fortune', 'Sundrop', 'Saffola', 'Dhara', 'Gemini', 'Amul'],
        'seasonal_boost': {'monsoon': 1.0, 'summer': 1.0, 'winter': 1.1, 'festival': 1.4}
    },
    'disposables': {
        'products': ['Paper Plates', 'Plastic Cups', 'Tissues', 'Napkins', 'Garbage Bags'],
        'brands': ['Shoppee', 'Origami', 'Wow', 'Easy', 'SmartBuy', 'Status'],
        'seasonal_boost': {'monsoon': 1.1, 'summer': 1.2, 'winter': 1.0, 'festival': 1.8}
    },
    'general_merchandise': {
        'products': ['Batteries', 'Bulbs', 'Stationery', 'Candles', 'Matchbox', 'Rope'],
        'brands': ['Eveready', 'Philips', 'Camlin', 'Classmate', 'Apsara', 'Luxor'],
        'seasonal_boost': {'monsoon': 1.2, 'summer': 1.0, 'winter': 1.1, 'festival': 1.5}
    }
}

# Retailer types
RETAILER_TYPES = ['cafe', 'kirana', 'restaurant', 'general_store']

# Loyalty tiers
LOYALTY_TIERS = ['bronze', 'silver', 'gold', 'platinum']

# Indian cities for geographic distribution
INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
    'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot'
]


def hash_password(password):
    """Hash a password"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def get_season(date):
    """Get season for a given date"""
    month = date.month
    if 6 <= month <= 9:
        return 'monsoon'
    elif 3 <= month <= 5:
        return 'summer'
    elif month >= 11 or month <= 2:
        return 'winter'
    else:
        return 'festival'


def generate_products(db, num_products=1000):
    """Generate realistic products across categories"""
    print(f"Generating {num_products} products...")
    
    products = []
    product_count = 0
    
    # Distribute products across categories
    products_per_category = num_products // len(CATEGORIES)
    
    for category_name, category_data in CATEGORIES.items():
        for _ in range(products_per_category):
            product_name = random.choice(category_data['products'])
            brand = random.choice(category_data['brands'])
            
            # Generate realistic prices
            base_price = random.uniform(10, 500)
            mrp = base_price * random.uniform(1.1, 1.3)
            
            # Stock levels
            stock = random.randint(20, 500)
            min_stock = random.randint(10, 50)
            
            product = {
                'name': f"{brand} {product_name}",
                'description': f"Premium quality {product_name.lower()} from {brand}",
                'category': category_name,
                'brand': brand,
                'price': round(base_price, 2),
                'mrp': round(mrp, 2),
                'stock': stock,
                'min_stock': min_stock,
                'unit': random.choice(['pcs', 'kg', 'ltr', 'pack', 'box']),
                'image_url': f'https://picsum.photos/seed/{product_count}/300/300',
                'distributor_id': '',  # Will be assigned later
                'is_active': True,
                'trend': random.choice(['up', 'down', 'stable']),
                'trend_percentage': round(random.uniform(-5, 15), 2),
                'ai_confidence': round(random.uniform(75, 95), 1),
                'demand_level': random.choice(['Low', 'Moderate', 'High', 'Very High']),
                'seasonal_category': category_name,
                'created_at': datetime.utcnow() - timedelta(days=random.randint(1, 180)),
                'updated_at': datetime.utcnow()
            }
            
            products.append(product)
            product_count += 1
            
            if product_count >= num_products:
                break
        
        if product_count >= num_products:
            break
    
    # Insert products
    result = db.products.insert_many(products)
    print(f"[OK] Created {len(result.inserted_ids)} products")
    
    return result.inserted_ids


def generate_retailers(db, num_retailers=500):
    """Generate retailers with different types and loyalty tiers"""
    print(f"Generating {num_retailers} retailers...")
    
    retailers = []
    
    for i in range(num_retailers):
        retailer_type = random.choice(RETAILER_TYPES)
        loyalty_tier = random.choices(
            LOYALTY_TIERS, 
            weights=[0.4, 0.3, 0.2, 0.1]  # More bronze, fewer platinum
        )[0]
        
        city = random.choice(INDIAN_CITIES)
        
        retailer = {
            'name': fake.company(),
            'email': f"retailer{i+1}@{fake.domain_name()}",
            'password': hash_password('password123'),
            'role': 'retailer',
            'retailer_type': retailer_type,
            'company_name': fake.company(),
            'phone': fake.phone_number(),
            'address': f"{fake.street_address()}, {city}",
            'location': city,
            'loyalty_tier': loyalty_tier,
            'created_at': datetime.utcnow() - timedelta(days=random.randint(30, 365)),
            'updated_at': datetime.utcnow(),
            'is_active': True,
            'mobile_device': random.choice([True, False])
        }
        
        retailers.append(retailer)
    
    result = db.users.insert_many(retailers)
    print(f"[OK] Created {len(result.inserted_ids)} retailers")
    
    # Create specific test retailers with known credentials
    test_retailers = [
        {
            'name': 'Test Retailer 1',
            'email': 'retailer1@example.com',
            'password': hash_password('password123'),
            'role': 'retailer',
            'retailer_type': 'grocery_store',
            'company_name': 'Test Retail Store 1',
            'phone': '+91 9876543210',
            'address': 'Delhi, India',
            'location': 'Delhi',
            'loyalty_tier': 'gold',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True,
            'mobile_device': True,
            'status': 'approved'  # Make sure they're approved
        },
        {
            'name': 'Test Retailer 2',
            'email': 'retailer2@example.com',
            'password': hash_password('password123'),
            'role': 'retailer',
            'retailer_type': 'supermarket',
            'company_name': 'Test Retail Store 2',
            'phone': '+91 9876543211',
            'address': 'Mumbai, India',
            'location': 'Mumbai',
            'loyalty_tier': 'silver',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True,
            'mobile_device': False,
            'status': 'approved'
        }
    ]
    
    test_result = db.users.insert_many(test_retailers)
    print(f"[OK] Created {len(test_result.inserted_ids)} test retailers with known credentials")
    
    return result.inserted_ids


def generate_distributors(db, num_distributors=200):
    """Generate distributors"""
    print(f"Generating {num_distributors} distributors...")
    
    distributors = []
    
    for i in range(num_distributors):
        city = random.choice(INDIAN_CITIES)
        
        distributor = {
            'name': fake.company(),
            'email': f"distributor{i+1}@{fake.domain_name()}",
            'password': hash_password('password123'),
            'role': 'distributor',
            'company_name': f"{fake.company()} Distributors",
            'phone': fake.phone_number(),
            'address': f"{fake.street_address()}, {city}",
            'location': city,
            'created_at': datetime.utcnow() - timedelta(days=random.randint(60, 730)),
            'updated_at': datetime.utcnow(),
            'is_active': True
        }
        
        distributors.append(distributor)
    
    result = db.users.insert_many(distributors)
    print(f"[OK] Created {len(result.inserted_ids)} distributors")
    
    # Create specific test distributors with known credentials
    test_distributors = [
        {
            'name': 'Test Distributor 1',
            'email': 'distributor1@example.com',
            'password': hash_password('password123'),
            'role': 'distributor',
            'company_name': 'Test Distribution Company 1',
            'phone': '+91 9876543220',
            'address': 'Bangalore, India',
            'location': 'Bangalore',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        },
        {
            'name': 'Test Distributor 2',
            'email': 'distributor2@example.com',
            'password': hash_password('password123'),
            'role': 'distributor',
            'company_name': 'Test Distribution Company 2',
            'phone': '+91 9876543221',
            'address': 'Chennai, India',
            'location': 'Chennai',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        }
    ]
    
    test_dist_result = db.users.insert_many(test_distributors)
    print(f"[OK] Created {len(test_dist_result.inserted_ids)} test distributors with known credentials")
    
    # Assign distributors to products
    products = list(db.products.find())
    for product in products:
        distributor_id = random.choice(result.inserted_ids)
        db.products.update_one(
            {'_id': product['_id']},
            {'$set': {'distributor_id': str(distributor_id)}}
        )
    
    print(f"[OK] Assigned distributors to all products")
    
    return result.inserted_ids


def generate_orders(db, retailer_ids, product_ids, num_orders=50000):
    """Generate orders with seasonal patterns"""
    print(f"Generating {num_orders} orders...")
    
    # Get all products with their details
    products = {str(p['_id']): p for p in db.products.find()}
    
    orders = []
    batch_size = 1000
    
    for i in range(num_orders):
        # Random date in last 365 days
        days_ago = random.randint(0, 365)
        order_date = datetime.utcnow() - timedelta(days=days_ago)
        season = get_season(order_date)
        
        retailer_id = random.choice(retailer_ids)
        
        # Number of items in order
        num_items = random.choices([1, 2, 3, 4, 5], weights=[0.3, 0.3, 0.2, 0.15, 0.05])[0]
        
        items = []
        total_amount = 0
        
        for _ in range(num_items):
            product_id = random.choice(product_ids)
            product = products.get(str(product_id))
            
            if not product:
                continue
            
            # Apply seasonal boost
            category = product.get('seasonal_category', 'general_merchandise')
            category_data = CATEGORIES.get(category, {})
            seasonal_boost = category_data.get('seasonal_boost', {}).get(season, 1.0)
            
            # Adjust quantity based on seasonal demand
            base_quantity = random.randint(1, 20)
            if random.random() < seasonal_boost - 1:  # Higher probability during peak season
                base_quantity *= 2
            
            quantity = base_quantity
            price = product['price']
            
            items.append({
                'product_id': str(product_id),
                'product_name': product['name'],
                'quantity': quantity,
                'price': price,
                'total': quantity * price
            })
            
            total_amount += quantity * price
        
        if not items:
            continue
        
        order = {
            'retailer_id': str(retailer_id),
            'items': items,
            'total_amount': round(total_amount, 2),
            'status': random.choices(
                ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
                weights=[0.05, 0.05, 0.1, 0.1, 0.65, 0.05]
            )[0],
            'delivery_address': fake.address(),
            'notes': random.choice(['', '', '', 'Urgent delivery', 'Call before delivery']),
            'created_at': order_date,
            'updated_at': order_date + timedelta(days=random.randint(0, 5)),
            'mobile_order': random.choice([True, False]),
            'season': season
        }
        
        orders.append(order)
        
        # Insert in batches
        if len(orders) >= batch_size:
            db.orders.insert_many(orders)
            print(f"  Inserted {i + 1}/{num_orders} orders...")
            orders = []
    
    # Insert remaining orders
    if orders:
        db.orders.insert_many(orders)
    
    print(f"[OK] Created {num_orders} orders")


def generate_user_sessions(db, retailer_ids, product_ids, num_sessions=25000):
    """Generate user browsing sessions"""
    print(f"Generating {num_sessions} user sessions...")
    
    sessions = []
    search_queries = [
        'chips', 'coca cola', 'maggi', 'bread', 'milk', 'biscuits', 
        'chocolate', 'oil', 'rice', 'soap', 'shampoo', 'detergent',
        'snacks', 'drinks', 'instant food', 'dairy', 'beverages'
    ]
    
    for i in range(num_sessions):
        retailer_id = random.choice(retailer_ids)
        session_date = datetime.utcnow() - timedelta(days=random.randint(0, 90))
        
        # Products viewed in this session
        num_products_viewed = random.randint(1, 15)
        products_viewed = random.sample(
            [str(pid) for pid in product_ids], 
            min(num_products_viewed, len(product_ids))
        )
        
        # Time spent
        time_spent_seconds = random.randint(30, 600)
        
        session = {
            'retailer_id': str(retailer_id),
            'session_date': session_date,
            'products_viewed': products_viewed,
            'search_queries': random.sample(search_queries, random.randint(0, 3)),
            'time_spent_seconds': time_spent_seconds,
            'added_to_cart': random.sample(products_viewed, random.randint(0, min(3, len(products_viewed)))),
            'completed_purchase': random.choice([True, False, False, False]),  # 25% conversion
            'device_type': random.choice(['mobile', 'desktop', 'tablet']),
            'created_at': session_date
        }
        
        sessions.append(session)
        
        if len(sessions) >= 1000:
            db.user_sessions.insert_many(sessions)
            print(f"  Inserted {i + 1}/{num_sessions} sessions...")
            sessions = []
    
    if sessions:
        db.user_sessions.insert_many(sessions)
    
    print(f"[OK] Created {num_sessions} user sessions")


def create_admin_user(db):
    """Create admin user"""
    print("Creating admin user...")
    
    admin = {
        'name': 'Admin User',
        'email': 'admin@qwipo.ai',
        'password': hash_password('admin123'),
        'role': 'admin',
        'company_name': 'Qwipo AI',
        'phone': '+91 9876543210',
        'address': 'Mumbai, Maharashtra',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'is_active': True
    }
    
    result = db.users.insert_one(admin)
    print(f"[OK] Created admin user (email: admin@qwipo.ai, password: admin123)")
    
    return result.inserted_id

def create_head_users(db):
    """Create head retailer and head distributor users"""
    print("Creating head users...")
    
    # Head Retailer
    head_retailer = {
        'name': 'Head Retailer',
        'email': 'head.retailer@qwipo.ai',
        'password': hash_password('headretailer123'),
        'role': 'head_retailer',
        'company_name': 'Qwipo Retail Network',
        'phone': '+91 9876543211',
        'address': 'Delhi, India',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'is_active': True
    }
    
    result1 = db.users.insert_one(head_retailer)
    print(f"[OK] Created head retailer (email: head.retailer@qwipo.ai, password: headretailer123)")
    
    # Head Distributor
    head_distributor = {
        'name': 'Head Distributor',
        'email': 'head.distributor@qwipo.ai',
        'password': hash_password('headdistributor123'),
        'role': 'head_distributor',
        'company_name': 'Qwipo Distribution Network',
        'phone': '+91 9876543212',
        'address': 'Bangalore, India',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'is_active': True
    }
    
    result2 = db.users.insert_one(head_distributor)
    print(f"[OK] Created head distributor (email: head.distributor@qwipo.ai, password: headdistributor123)")
    
    return result1.inserted_id, result2.inserted_id


def main():
    """Main seeding function"""
    print("=" * 60)
    print("QWIPO AI PLATFORM - COMPREHENSIVE DATA SEEDING")
    print("=" * 60)
    print()
    
    # Connect to MongoDB
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        print(f"[OK] Connected to MongoDB: {db.name}")
        print()
    except Exception as e:
        print(f"[ERROR] Error connecting to MongoDB: {e}")
        return
    
    # Clear existing data
    print("Clearing existing data...")
    db.products.delete_many({})
    db.users.delete_many({})
    db.orders.delete_many({})
    db.user_sessions.delete_many({})
    db.recommendation_feedback.delete_many({})
    print("[OK] Cleared all collections")
    print()
    
    # Generate data
    print("Starting data generation...")
    print()
    
    # Create admin and head users
    admin_id = create_admin_user(db)
    head_retailer_id, head_distributor_id = create_head_users(db)
    print()
    
    # Generate products
    product_ids = generate_products(db, num_products=1000)
    print()
    
    # Generate distributors (must be before retailers to assign products)
    distributor_ids = generate_distributors(db, num_distributors=200)
    print()
    
    # Generate retailers
    retailer_ids = generate_retailers(db, num_retailers=500)
    print()
    
    # Generate orders with seasonal patterns
    generate_orders(db, retailer_ids, product_ids, num_orders=50000)
    print()
    
    # Generate user sessions
    generate_user_sessions(db, retailer_ids, product_ids, num_sessions=25000)
    print()
    
    # Create indexes for performance
    print("Creating database indexes...")
    try:
        # Drop existing indexes first to avoid conflicts
        try:
            db.users.drop_indexes()
            db.products.drop_indexes()
            db.orders.drop_indexes()
            db.user_sessions.drop_indexes()
        except:
            pass  # Ignore if no indexes exist
        
        # Create new indexes
        db.users.create_index("email", unique=True)
        db.products.create_index("category")
        db.products.create_index("distributor_id")
        db.orders.create_index("retailer_id")
        db.orders.create_index("created_at")
        db.orders.create_index("status")
        db.user_sessions.create_index("retailer_id")
        db.user_sessions.create_index("session_date")
        print("[OK] Created indexes")
    except Exception as e:
        print(f"[OK] Indexes already exist or created (skipped duplicate creation)")
    print()
    
    # Summary
    print("=" * 60)
    print("DATA SEEDING COMPLETE!")
    print("=" * 60)
    print()
    print("Summary:")
    print(f"  • Products: {db.products.count_documents({})}")
    print(f"  • Retailers: {db.users.count_documents({'role': 'retailer'})}")
    print(f"  • Distributors: {db.users.count_documents({'role': 'distributor'})}")
    print(f"  • Admin Users: {db.users.count_documents({'role': 'admin'})}")
    print(f"  • Orders: {db.orders.count_documents({})}")
    print(f"  • User Sessions: {db.user_sessions.count_documents({})}")
    print()
    print("Test Credentials:")
    print("  Admin: admin@qwipo.ai / admin123")
    print("  Retailers: retailer1@<domain> / password123")
    print("  Distributors: distributor1@<domain> / password123")
    print()
    print("=" * 60)


if __name__ == '__main__':
    main()

