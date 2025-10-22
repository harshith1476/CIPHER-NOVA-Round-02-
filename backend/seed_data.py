"""
Seed database with sample data
Run with: python seed_data.py
"""

from pymongo import MongoClient
from datetime import datetime
from app.utils.auth import hash_password
import random

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['qwipo_ai']

def clear_database():
    """Clear all collections"""
    print("Clearing database...")
    db.users.delete_many({})
    db.products.delete_many({})
    db.orders.delete_many({})
    db.stock_history.delete_many({})
    print("✓ Database cleared")

def seed_users():
    """Seed users"""
    print("\nSeeding users...")
    
    users = [
        {
            'name': 'Rajesh Kumar',
            'email': 'retailer@test.com',
            'password': hash_password('password123'),
            'role': 'retailer',
            'company_name': 'Kumar General Store',
            'phone': '+91 98765 43210',
            'address': '123 MG Road, Mumbai, Maharashtra 400001',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        },
        {
            'name': 'Priya Sharma',
            'email': 'distributor@test.com',
            'password': hash_password('password123'),
            'role': 'distributor',
            'company_name': 'Sharma Distributors Pvt Ltd',
            'phone': '+91 98765 12345',
            'address': '456 Industrial Area, Delhi 110001',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        },
        {
            'name': 'Admin User',
            'email': 'admin@test.com',
            'password': hash_password('password123'),
            'role': 'admin',
            'company_name': 'Qwipo AI Platform',
            'phone': '+91 98765 00000',
            'address': 'Qwipo Headquarters, Bangalore',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        }
    ]
    
    result = db.users.insert_many(users)
    print(f"✓ Created {len(result.inserted_ids)} users")
    return result.inserted_ids

def seed_products(distributor_id):
    """Seed Indian FMCG products"""
    print("\nSeeding 50+ Indian FMCG products...")
    
    products = [
        # Noodles & Pasta
        {'name': 'Maggi 2-Minute Noodles', 'category': 'Noodles', 'brand': 'Maggi', 'price': 12, 'mrp': 15, 'stock': 150, 'min_stock': 30, 'unit': 'pack'},
        {'name': 'Yippee Noodles', 'category': 'Noodles', 'brand': 'Yippee', 'price': 10, 'mrp': 12, 'stock': 120, 'min_stock': 25, 'unit': 'pack'},
        {'name': 'Top Ramen Noodles', 'category': 'Noodles', 'brand': 'Nissin', 'price': 13, 'mrp': 15, 'stock': 90, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'Sunfeast Pasta', 'category': 'Pasta', 'brand': 'Sunfeast', 'price': 45, 'mrp': 50, 'stock': 60, 'min_stock': 15, 'unit': 'pack'},
        
        # Biscuits
        {'name': 'Parle-G Biscuits', 'category': 'Biscuits', 'brand': 'Parle', 'price': 5, 'mrp': 5, 'stock': 8, 'min_stock': 30, 'unit': 'pack'},
        {'name': 'Britannia Good Day', 'category': 'Biscuits', 'brand': 'Britannia', 'price': 10, 'mrp': 12, 'stock': 95, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'Britannia Marie Gold', 'category': 'Biscuits', 'brand': 'Britannia', 'price': 25, 'mrp': 30, 'stock': 75, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'Sunfeast Dark Fantasy', 'category': 'Biscuits', 'brand': 'Sunfeast', 'price': 30, 'mrp': 35, 'stock': 55, 'min_stock': 15, 'unit': 'pack'},
        {'name': 'Oreo Biscuits', 'category': 'Biscuits', 'brand': 'Cadbury', 'price': 10, 'mrp': 12, 'stock': 110, 'min_stock': 25, 'unit': 'pack'},
        {'name': 'Monaco Biscuits', 'category': 'Biscuits', 'brand': 'Parle', 'price': 10, 'mrp': 10, 'stock': 85, 'min_stock': 20, 'unit': 'pack'},
        
        # Beverages
        {'name': 'Coca Cola 600ml', 'category': 'Beverages', 'brand': 'Coca Cola', 'price': 35, 'mrp': 40, 'stock': 12, 'min_stock': 15, 'unit': 'bottle'},
        {'name': 'Pepsi 600ml', 'category': 'Beverages', 'brand': 'Pepsi', 'price': 35, 'mrp': 40, 'stock': 145, 'min_stock': 30, 'unit': 'bottle'},
        {'name': 'Thums Up 600ml', 'category': 'Beverages', 'brand': 'Coca Cola', 'price': 35, 'mrp': 40, 'stock': 130, 'min_stock': 30, 'unit': 'bottle'},
        {'name': 'Sprite 600ml', 'category': 'Beverages', 'brand': 'Coca Cola', 'price': 35, 'mrp': 40, 'stock': 125, 'min_stock': 25, 'unit': 'bottle'},
        {'name': 'Fanta 600ml', 'category': 'Beverages', 'brand': 'Coca Cola', 'price': 35, 'mrp': 40, 'stock': 100, 'min_stock': 25, 'unit': 'bottle'},
        {'name': 'Bisleri Water 1L', 'category': 'Beverages', 'brand': 'Bisleri', 'price': 20, 'mrp': 20, 'stock': 200, 'min_stock': 50, 'unit': 'bottle'},
        {'name': 'Real Juice 1L', 'category': 'Beverages', 'brand': 'Dabur', 'price': 99, 'mrp': 110, 'stock': 45, 'min_stock': 15, 'unit': 'pack'},
        {'name': 'Frooti Mango Drink', 'category': 'Beverages', 'brand': 'Parle', 'price': 10, 'mrp': 10, 'stock': 180, 'min_stock': 40, 'unit': 'pack'},
        
        # Snacks
        {'name': 'Lays Classic Salted', 'category': 'Snacks', 'brand': 'Lays', 'price': 10, 'mrp': 10, 'stock': 78, 'min_stock': 25, 'unit': 'pack'},
        {'name': 'Kurkure Masala Munch', 'category': 'Snacks', 'brand': 'Kurkure', 'price': 10, 'mrp': 10, 'stock': 165, 'min_stock': 30, 'unit': 'pack'},
        {'name': 'Bingo Mad Angles', 'category': 'Snacks', 'brand': 'Bingo', 'price': 10, 'mrp': 10, 'stock': 140, 'min_stock': 30, 'unit': 'pack'},
        {'name': 'Uncle Chips', 'category': 'Snacks', 'brand': 'Uncle Chipps', 'price': 10, 'mrp': 10, 'stock': 95, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'Haldiram Bhujia', 'category': 'Snacks', 'brand': 'Haldiram', 'price': 55, 'mrp': 60, 'stock': 70, 'min_stock': 15, 'unit': 'pack'},
        {'name': 'Bikaji Namkeen', 'category': 'Snacks', 'brand': 'Bikaji', 'price': 50, 'mrp': 55, 'stock': 60, 'min_stock': 15, 'unit': 'pack'},
        
        # Dairy Products
        {'name': 'Amul Butter 100g', 'category': 'Dairy', 'brand': 'Amul', 'price': 50, 'mrp': 55, 'stock': 85, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'Amul Cheese Slices', 'category': 'Dairy', 'brand': 'Amul', 'price': 130, 'mrp': 140, 'stock': 45, 'min_stock': 10, 'unit': 'pack'},
        {'name': 'Mother Dairy Milk 1L', 'category': 'Dairy', 'brand': 'Mother Dairy', 'price': 60, 'mrp': 62, 'stock': 50, 'min_stock': 15, 'unit': 'pack'},
        {'name': 'Nestle Milkmaid', 'category': 'Dairy', 'brand': 'Nestle', 'price': 110, 'mrp': 120, 'stock': 35, 'min_stock': 10, 'unit': 'can'},
        
        # Personal Care
        {'name': 'Colgate Toothpaste', 'category': 'Personal Care', 'brand': 'Colgate', 'price': 85, 'mrp': 90, 'stock': 95, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'Dettol Soap', 'category': 'Personal Care', 'brand': 'Dettol', 'price': 35, 'mrp': 40, 'stock': 120, 'min_stock': 25, 'unit': 'piece'},
        {'name': 'Lifebuoy Soap', 'category': 'Personal Care', 'brand': 'Lifebuoy', 'price': 32, 'mrp': 35, 'stock': 110, 'min_stock': 25, 'unit': 'piece'},
        {'name': 'Head & Shoulders Shampoo', 'category': 'Personal Care', 'brand': 'H&S', 'price': 180, 'mrp': 200, 'stock': 45, 'min_stock': 10, 'unit': 'bottle'},
        {'name': 'Clinic Plus Shampoo', 'category': 'Personal Care', 'brand': 'Clinic Plus', 'price': 95, 'mrp': 100, 'stock': 65, 'min_stock': 15, 'unit': 'bottle'},
        
        # Household
        {'name': 'Surf Excel Detergent', 'category': 'Household', 'brand': 'Surf Excel', 'price': 175, 'mrp': 190, 'stock': 55, 'min_stock': 15, 'unit': 'pack'},
        {'name': 'Vim Bar', 'category': 'Household', 'brand': 'Vim', 'price': 10, 'mrp': 10, 'stock': 150, 'min_stock': 30, 'unit': 'piece'},
        {'name': 'Harpic Toilet Cleaner', 'category': 'Household', 'brand': 'Harpic', 'price': 110, 'mrp': 120, 'stock': 40, 'min_stock': 10, 'unit': 'bottle'},
        {'name': 'Colin Glass Cleaner', 'category': 'Household', 'brand': 'Colin', 'price': 95, 'mrp': 100, 'stock': 35, 'min_stock': 10, 'unit': 'bottle'},
        
        # Cooking Essentials
        {'name': 'Fortune Sunflower Oil 1L', 'category': 'Cooking Oil', 'brand': 'Fortune', 'price': 150, 'mrp': 160, 'stock': 75, 'min_stock': 20, 'unit': 'bottle'},
        {'name': 'Aashirvaad Atta 5kg', 'category': 'Flour', 'brand': 'Aashirvaad', 'price': 240, 'mrp': 250, 'stock': 45, 'min_stock': 10, 'unit': 'pack'},
        {'name': 'Tata Salt 1kg', 'category': 'Salt', 'brand': 'Tata', 'price': 20, 'mrp': 22, 'stock': 95, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'MDH Masala', 'category': 'Spices', 'brand': 'MDH', 'price': 45, 'mrp': 50, 'stock': 85, 'min_stock': 20, 'unit': 'pack'},
        {'name': 'Everest Garam Masala', 'category': 'Spices', 'brand': 'Everest', 'price': 50, 'mrp': 55, 'stock': 70, 'min_stock': 15, 'unit': 'pack'},
        {'name': 'India Gate Basmati Rice 5kg', 'category': 'Rice', 'brand': 'India Gate', 'price': 450, 'mrp': 480, 'stock': 30, 'min_stock': 8, 'unit': 'pack'},
        
        # Chocolates & Confectionery
        {'name': 'Dairy Milk Chocolate', 'category': 'Chocolate', 'brand': 'Cadbury', 'price': 30, 'mrp': 35, 'stock': 125, 'min_stock': 30, 'unit': 'piece'},
        {'name': '5 Star Chocolate', 'category': 'Chocolate', 'brand': 'Cadbury', 'price': 10, 'mrp': 10, 'stock': 155, 'min_stock': 35, 'unit': 'piece'},
        {'name': 'KitKat Chocolate', 'category': 'Chocolate', 'brand': 'Nestle', 'price': 10, 'mrp': 10, 'stock': 145, 'min_stock': 30, 'unit': 'piece'},
        {'name': 'Munch Chocolate', 'category': 'Chocolate', 'brand': 'Nestle', 'price': 10, 'mrp': 10, 'stock': 135, 'min_stock': 30, 'unit': 'piece'},
        {'name': 'Perk Chocolate', 'category': 'Chocolate', 'brand': 'Cadbury', 'price': 10, 'mrp': 10, 'stock': 140, 'min_stock': 30, 'unit': 'piece'},
        
        # Tea & Coffee
        {'name': 'Tata Tea Premium', 'category': 'Tea', 'brand': 'Tata', 'price': 200, 'mrp': 210, 'stock': 55, 'min_stock': 15, 'unit': 'pack'},
        {'name': 'Brooke Bond Red Label', 'category': 'Tea', 'brand': 'Brooke Bond', 'price': 195, 'mrp': 205, 'stock': 50, 'min_stock': 12, 'unit': 'pack'},
        {'name': 'Nescafe Classic Coffee', 'category': 'Coffee', 'brand': 'Nescafe', 'price': 150, 'mrp': 160, 'stock': 45, 'min_stock': 12, 'unit': 'jar'},
        {'name': 'Bru Instant Coffee', 'category': 'Coffee', 'brand': 'Bru', 'price': 140, 'mrp': 150, 'stock': 40, 'min_stock': 10, 'unit': 'jar'},
    ]
    
    # Add common fields and distributor_id
    for product in products:
        product['distributor_id'] = str(distributor_id)
        product['description'] = f"Premium quality {product['name']} from {product['brand']}"
        product['image_url'] = f"/images/products/{product['name'].lower().replace(' ', '-')}.jpg"
        product['is_active'] = True
        product['created_at'] = datetime.utcnow()
        product['updated_at'] = datetime.utcnow()
    
    result = db.products.insert_many(products)
    print(f"✓ Created {len(result.inserted_ids)} products")
    return result.inserted_ids

def seed_orders(retailer_id, product_ids):
    """Seed sample orders"""
    print("\nSeeding sample orders...")
    
    orders = []
    statuses = ['delivered', 'delivered', 'delivered', 'delivered', 'shipped', 'processing', 'pending']
    
    for i in range(10):
        num_items = random.randint(3, 8)
        selected_products = random.sample(product_ids, num_items)
        
        items = []
        total_amount = 0
        
        for product_id in selected_products:
            product = db.products.find_one({'_id': product_id})
            if product:
                quantity = random.randint(5, 20)
                price = product['price']
                items.append({
                    'product_id': str(product_id),
                    'product_name': product['name'],
                    'quantity': quantity,
                    'price': price,
                    'total': quantity * price
                })
                total_amount += quantity * price
        
        order = {
            'retailer_id': str(retailer_id),
            'items': items,
            'total_amount': total_amount,
            'status': random.choice(statuses),
            'delivery_address': '123 MG Road, Mumbai, Maharashtra 400001',
            'notes': f'Sample order #{i+1}',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'mobile_order': random.choice([True, False])
        }
        orders.append(order)
    
    result = db.orders.insert_many(orders)
    print(f"✓ Created {len(result.inserted_ids)} sample orders")

def main():
    """Main seed function"""
    print("=" * 50)
    print("Qwipo AI - Database Seeding")
    print("=" * 50)
    
    clear_database()
    user_ids = seed_users()
    
    retailer_id = user_ids[0]
    distributor_id = user_ids[1]
    
    product_ids = seed_products(distributor_id)
    seed_orders(retailer_id, product_ids)
    
    print("\n" + "=" * 50)
    print("✓ Database seeding completed successfully!")
    print("=" * 50)
    print("\nTest Credentials:")
    print("-" * 50)
    print("Retailer: retailer@test.com / password123")
    print("Distributor: distributor@test.com / password123")
    print("Admin: admin@test.com / password123")
    print("=" * 50)

if __name__ == '__main__':
    main()

