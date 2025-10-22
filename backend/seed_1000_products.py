import random
from datetime import datetime, timedelta
from app.utils.database import init_db, get_collection
import os
from dotenv import load_dotenv

load_dotenv()

def generate_1000_products():
    """Generate 1000+ realistic products with Indian FMCG focus"""
    
    # Product categories with realistic Indian FMCG items
    categories = {
        'Noodles & Pasta': [
            'Maggi 2-Minute Noodles', 'Top Ramen Curry Noodles', 'Yippee Noodles', 'Wai Wai Noodles',
            'Sunfeast Yippee Noodles', 'Knorr Soupy Noodles', 'Ching\'s Secret Noodles', 'Samyang Ramen',
            'Indomie Mi Goreng', 'Koka Noodles', 'Mama Noodles', 'Nissin Cup Noodles'
        ],
        'Beverages': [
            'Coca Cola', 'Pepsi', 'Thums Up', 'Sprite', 'Fanta', 'Mountain Dew', 'Mirinda',
            'Red Bull', 'Monster Energy', 'Sting', 'Limca', 'Gold Spot', 'Tata Tea', 'Red Label Tea',
            'Brooke Bond Tea', 'Lipton Tea', 'Nescafe Coffee', 'Bru Coffee', 'Tata Coffee'
        ],
        'Snacks & Chips': [
            'Lays Classic', 'Lays Magic Masala', 'Kurkure', 'Cheetos', 'Pringles',
            'Uncle Chips', 'Haldiram\'s Namkeen', 'Bikano Mix', 'Cornitos', 'Too Yum Chips',
            'Pogo', 'Monaco Biscuits', 'Good Day Cookies', 'Parle-G Biscuits', 'Oreo Cookies'
        ],
        'Dairy Products': [
            'Amul Milk', 'Mother Dairy Milk', 'Amul Butter', 'Amul Cheese', 'Amul Ice Cream',
            'Kwality Walls Ice Cream', 'Nestle Milkmaid', 'Dabur Honey', 'Gowardhan Paneer',
            'Amul Yogurt', 'Mother Dairy Curd', 'Tata Sky Milk', 'Heritage Milk'
        ],
        'Cooking Essentials': [
            'Fortune Oil', 'Sunpure Oil', 'Dhara Oil', 'Tata Salt', 'Tata Iodized Salt',
            'MDH Garam Masala', 'Everest Masala', 'Catch Spices', 'Tata Sampann Spices',
            'Turmeric Powder', 'Red Chili Powder', 'Cumin Seeds', 'Coriander Seeds'
        ],
        'Personal Care': [
            'Dove Soap', 'Lux Soap', 'Pears Soap', 'Lifebuoy Soap', 'Himalaya Face Wash',
            'Patanjali Face Wash', 'Fair & Lovely Cream', 'Vaseline Lotion', 'Ponds Cream',
            'Colgate Toothpaste', 'Pepsodent Toothpaste', 'Close-up Toothpaste', 'Sensodyne'
        ],
        'Household Items': [
            'Surf Excel Detergent', 'Ariel Detergent', 'Tide Detergent', 'Vim Dishwash',
            'Pril Dishwash', 'Harpic Toilet Cleaner', 'Lizol Floor Cleaner', 'Good Knight Mosquito Repellent',
            'All Out Mosquito Repellent', 'Hit Mosquito Spray', 'Mortein Mosquito Spray'
        ],
        'Confectionery': [
            'Cadbury Dairy Milk', 'KitKat', '5 Star', 'Perk', 'Snickers', 'Mars', 'Twix',
            'Gems', 'Munch', 'Éclairs', 'Kismi', 'Center Fresh', 'Halls', 'Vicks Vaporub'
        ],
        'Health & Wellness': [
            'Himalaya Liv.52', 'Chyawanprash', 'Himalaya Face Cream', 'BoroPlus Antiseptic Cream',
            'Volini Pain Relief Gel', 'Moov Pain Relief', 'Iodex Balm', 'Vicks Vaporub',
            'Dabur Chyawanprash', 'Patanjali Chyawanprash', 'Baidyanath Chyawanprash'
        ],
        'Baby Care': [
            'Pampers Diapers', 'Huggies Diapers', 'Johnson\'s Baby Powder', 'Himalaya Baby Cream',
            'Pigeon Baby Products', 'Mee Mee Baby Products', 'Baby Dove', 'Johnson\'s Baby Shampoo'
        ],
        'Electronics Accessories': [
            'Samsung Mobile Charger', 'OnePlus Charger', 'Mi Power Bank', 'Realme Earphones',
            'Boat Earphones', 'JBL Speakers', 'Philips Hair Dryer', 'Havells Fan'
        ],
        'Stationery': [
            'Reynolds Pen', 'Parker Pen', 'Cello Pen', 'Linc Pen', 'Natraj Pencil',
            'Apsara Pencil', 'Classmate Notebook', 'Navneet Notebook', 'Camel Geometry Box'
        ]
    }

    products = []
    product_id = 1
    
    # Generate realistic price ranges for each category
    price_ranges = {
        'Noodles & Pasta': (10, 50),
        'Beverages': (15, 80),
        'Snacks & Chips': (5, 100),
        'Dairy Products': (25, 200),
        'Cooking Essentials': (30, 500),
        'Personal Care': (20, 300),
        'Household Items': (40, 800),
        'Confectionery': (5, 150),
        'Health & Wellness': (50, 400),
        'Baby Care': (100, 800),
        'Electronics Accessories': (200, 2000),
        'Stationery': (5, 200)
    }

    for category, items in categories.items():
        for item in items:
            # Generate realistic stock levels
            base_stock = random.randint(20, 500)
            min_stock = max(5, int(base_stock * 0.1))
            current_stock = random.randint(min_stock, base_stock + 100)
            
            # Generate realistic prices
            min_price, max_price = price_ranges.get(category, (10, 100))
            price = round(random.uniform(min_price, max_price), 2)
            
            # Generate supplier info
            suppliers = ['Amul', 'Tata', 'ITC', 'HUL', 'Nestle', 'PepsiCo', 'Coca Cola', 'Procter & Gamble', 'Unilever', 'Dabur']
            supplier = random.choice(suppliers)
            
            # Generate stock trends (up/down)
            trend = random.choice(['up', 'down', 'stable'])
            trend_percentage = round(random.uniform(0.5, 15.0), 2)
            
            # Generate AI predictions
            days_to_stockout = random.randint(1, 30)
            confidence = round(random.uniform(75, 99), 1)
            demand_level = random.choice(['Very High', 'High', 'Moderate', 'Low'])
            
            product = {
                'name': item,
                'category': category,
                'price': price,
                'stock': current_stock,
                'min_stock': min_stock,
                'max_stock': base_stock + 200,
                'supplier': supplier,
                'brand': supplier,
                'description': f'High quality {item.lower()} from {supplier}',
                'is_active': True,
                'trend': trend,
                'trend_percentage': trend_percentage,
                'days_to_stockout': days_to_stockout,
                'ai_confidence': confidence,
                'demand_level': demand_level,
                'last_updated': datetime.utcnow(),
                'created_at': datetime.utcnow() - timedelta(days=random.randint(1, 365))
            }
            
            products.append(product)
            product_id += 1

    # Add some seasonal and trending products
    trending_products = [
        {'name': 'iPhone 15 Pro Max', 'category': 'Electronics', 'price': 129999.0, 'stock': 5, 'min_stock': 2, 'trend': 'up', 'trend_percentage': 25.5, 'supplier': 'Apple'},
        {'name': 'Samsung Galaxy S24 Ultra', 'category': 'Electronics', 'price': 124999.0, 'stock': 8, 'min_stock': 3, 'trend': 'up', 'trend_percentage': 18.2, 'supplier': 'Samsung'},
        {'name': 'MacBook Air M3', 'category': 'Electronics', 'price': 114900.0, 'stock': 3, 'min_stock': 1, 'trend': 'up', 'trend_percentage': 22.8, 'supplier': 'Apple'},
        {'name': 'Tesla Model 3', 'category': 'Automotive', 'price': 3500000.0, 'stock': 1, 'min_stock': 1, 'trend': 'up', 'trend_percentage': 35.0, 'supplier': 'Tesla'},
        {'name': 'PS5 Console', 'category': 'Gaming', 'price': 54990.0, 'stock': 12, 'min_stock': 5, 'trend': 'up', 'trend_percentage': 15.3, 'supplier': 'Sony'},
        {'name': 'Nintendo Switch OLED', 'category': 'Gaming', 'price': 34990.0, 'stock': 15, 'min_stock': 8, 'trend': 'up', 'trend_percentage': 12.7, 'supplier': 'Nintendo'},
    ]

    for product in trending_products:
        product.update({
            'category': product.get('category', 'Electronics'),
            'max_stock': product['stock'] * 3,
            'brand': product['supplier'],
            'description': f'Latest {product["name"]} with advanced features',
            'is_active': True,
            'ai_confidence': round(random.uniform(85, 99), 1),
            'demand_level': 'Very High',
            'days_to_stockout': random.randint(1, 30),
            'last_updated': datetime.utcnow(),
            'created_at': datetime.utcnow() - timedelta(days=random.randint(1, 30))
        })
        products.append(product)

    return products

def seed_database():
    """Seed the database with 1000+ products"""
    try:
        # Initialize database connection
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/qwipo_ai')
        init_db(mongo_uri)
        
        # Get products collection
        products_collection = get_collection('products')
        
        # Clear existing products
        products_collection.delete_many({})
        print("Cleared existing products...")
        
        # Generate products
        print("Generating 1000+ products...")
        products = generate_1000_products()
        
        # Insert products in batches
        batch_size = 100
        for i in range(0, len(products), batch_size):
            batch = products[i:i + batch_size]
            products_collection.insert_many(batch)
            print(f"Inserted batch {i//batch_size + 1}/{(len(products) + batch_size - 1)//batch_size}")
        
        print(f"Successfully seeded {len(products)} products!")
        
        # Create indexes for better performance
        products_collection.create_index("name")
        products_collection.create_index("category")
        products_collection.create_index("trend")
        products_collection.create_index("demand_level")
        products_collection.create_index("is_active")
        print("Created database indexes...")
        
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_database()
