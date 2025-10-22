from flask import Blueprint, request, jsonify
from app.utils.database import get_collection
from app.utils.auth import verify_token
from bson import ObjectId
import random

head_bp = Blueprint('head', __name__)

@head_bp.route('/brands', methods=['GET'])
def get_all_brands():
    """Get all brands in the marketplace - Head Retailer/Distributor access"""
    try:
        # Verify token and check if user has head role
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
            
        token = token[7:]
        payload = verify_token(token)
        
        if payload['role'] not in ['head_retailer', 'head_distributor', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get all brands with product counts
        products = get_collection('products')
        brands = products.aggregate([
            {
                '$group': {
                    '_id': '$brand',
                    'products_count': {'$sum': 1},
                    'total_value': {'$sum': '$price'},
                    'avg_price': {'$avg': '$price'}
                }
            },
            {
                '$project': {
                    'name': '$_id',
                    'products_count': 1,
                    'total_value': 1,
                    'avg_price': {'$round': ['$avg_price', 2]},
                    '_id': 0
                }
            },
            {'$sort': {'products_count': -1}}
        ])
        
        brands_list = list(brands)
        
        # If no brands in database, return mock data
        if not brands_list:
            brands_list = [
                {'name': 'Nestle', 'products_count': 45, 'total_value': 125000, 'avg_price': 125.50},
                {'name': 'Unilever', 'products_count': 38, 'total_value': 98000, 'avg_price': 98.75},
                {'name': 'P&G', 'products_count': 32, 'total_value': 87000, 'avg_price': 156.25},
                {'name': 'Coca-Cola', 'products_count': 28, 'total_value': 45000, 'avg_price': 67.50},
                {'name': 'PepsiCo', 'products_count': 25, 'total_value': 42000, 'avg_price': 72.30},
                {'name': 'ITC', 'products_count': 22, 'total_value': 38000, 'avg_price': 89.75},
                {'name': 'Britannia', 'products_count': 18, 'total_value': 32000, 'avg_price': 95.40},
                {'name': 'Parle', 'products_count': 15, 'total_value': 28000, 'avg_price': 78.90}
            ]
        
        return jsonify(brands_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@head_bp.route('/products/all', methods=['GET'])
def get_all_products():
    """Get all products in the marketplace - Head Retailer/Distributor access"""
    try:
        # Verify token and check if user has head role
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
            
        token = token[7:]
        payload = verify_token(token)
        
        if payload['role'] not in ['head_retailer', 'head_distributor', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        brand = request.args.get('brand')
        category = request.args.get('category')
        
        # Build filter
        filter_query = {}
        if brand and brand != 'all':
            filter_query['brand'] = brand
        if category and category != 'all':
            filter_query['category'] = category
        
        # Get products
        products = get_collection('products')
        
        # Get total count
        total = products.count_documents(filter_query)
        
        # Get products with pagination
        products_list = list(products.find(
            filter_query,
            {
                '_id': 1,
                'name': 1,
                'brand': 1,
                'category': 1,
                'price': 1,
                'stock_quantity': 1,
                'description': 1,
                'distributor_id': 1,
                'created_at': 1
            }
        ).skip((page - 1) * limit).limit(limit))
        
        # Convert ObjectId to string
        for product in products_list:
            product['id'] = str(product['_id'])
            del product['_id']
        
        # If no products in database, return mock data
        if not products_list:
            mock_products = []
            brands = ['Nestle', 'Unilever', 'P&G', 'Coca-Cola', 'PepsiCo', 'ITC', 'Britannia', 'Parle']
            categories = ['Beverages', 'Snacks', 'Dairy', 'Household', 'Personal Care', 'Food Items']
            
            for i in range(min(limit, 100)):  # Generate up to 100 mock products
                product = {
                    'id': f'mock_{i}',
                    'name': f'Product {i + 1}',
                    'brand': random.choice(brands),
                    'category': random.choice(categories),
                    'price': round(random.uniform(20, 500), 2),
                    'stock_quantity': random.randint(10, 1000),
                    'description': f'High-quality product from {random.choice(brands)}',
                    'distributor_id': f'dist_{random.randint(1, 50)}',
                    'created_at': '2024-01-01T00:00:00Z'
                }
                mock_products.append(product)
            
            products_list = mock_products
            total = len(mock_products)
        
        return jsonify({
            'products': products_list,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@head_bp.route('/distributors', methods=['GET'])
def get_all_distributors():
    """Get all distributors - Head Distributor access"""
    try:
        # Verify token and check if user has head role
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
            
        token = token[7:]
        payload = verify_token(token)
        
        if payload['role'] not in ['head_distributor', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get all distributors
        users = get_collection('users')
        distributors = list(users.find(
            {'role': 'distributor'},
            {
                '_id': 1,
                'name': 1,
                'email': 1,
                'company_name': 1,
                'phone': 1,
                'address': 1,
                'created_at': 1,
                'last_login': 1,
                'is_active': 1
            }
        ))
        
        # Convert ObjectId to string and add product count
        for distributor in distributors:
            distributor['id'] = str(distributor['_id'])
            del distributor['_id']
            
            # Get product count for this distributor
            products = get_collection('products')
            product_count = products.count_documents({'distributor_id': distributor['id']})
            distributor['products_count'] = product_count
        
        # If no distributors in database, return mock data
        if not distributors:
            mock_distributors = []
            for i in range(50):
                distributor = {
                    'id': f'dist_{i}',
                    'name': f'Distributor {i + 1}',
                    'email': f'distributor{i + 1}@example.com',
                    'company_name': f'Distribution Company {i + 1}',
                    'phone': f'+91-98765-4321{i % 10}',
                    'address': f'Address {i + 1}, City, State',
                    'created_at': '2024-01-01T00:00:00Z',
                    'last_login': '2024-01-15T10:30:00Z',
                    'is_active': True,
                    'products_count': random.randint(10, 100)
                }
                mock_distributors.append(distributor)
            
            distributors = mock_distributors
        
        return jsonify(distributors), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@head_bp.route('/retailers', methods=['GET'])
def get_all_retailers():
    """Get all retailers - Head Retailer access"""
    try:
        # Verify token and check if user has head role
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
            
        token = token[7:]
        payload = verify_token(token)
        
        if payload['role'] not in ['head_retailer', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        
        # Get all retailers
        users = get_collection('users')
        
        # Get total count
        total = users.count_documents({'role': 'retailer'})
        
        # Get retailers with pagination
        retailers = list(users.find(
            {'role': 'retailer'},
            {
                '_id': 1,
                'name': 1,
                'email': 1,
                'company_name': 1,
                'phone': 1,
                'address': 1,
                'created_at': 1,
                'last_login': 1,
                'is_active': 1,
                'retailer_type': 1,
                'loyalty_tier': 1
            }
        ).skip((page - 1) * limit).limit(limit))
        
        # Convert ObjectId to string and add order count
        for retailer in retailers:
            retailer['id'] = str(retailer['_id'])
            del retailer['_id']
            
            # Get order count for this retailer
            orders = get_collection('orders')
            order_count = orders.count_documents({'retailer_id': retailer['id']})
            retailer['orders_count'] = order_count
        
        # If no retailers in database, return mock data
        if not retailers:
            mock_retailers = []
            retailer_types = ['cafe', 'kirana', 'restaurant', 'general_store']
            loyalty_tiers = ['bronze', 'silver', 'gold', 'platinum']
            
            for i in range(min(limit, 100)):
                retailer = {
                    'id': f'ret_{i}',
                    'name': f'Retailer {i + 1}',
                    'email': f'retailer{i + 1}@example.com',
                    'company_name': f'Retail Store {i + 1}',
                    'phone': f'+91-98765-4321{i % 10}',
                    'address': f'Address {i + 1}, City, State',
                    'created_at': '2024-01-01T00:00:00Z',
                    'last_login': '2024-01-15T10:30:00Z',
                    'is_active': True,
                    'retailer_type': random.choice(retailer_types),
                    'loyalty_tier': random.choice(loyalty_tiers),
                    'orders_count': random.randint(5, 200)
                }
                mock_retailers.append(retailer)
            
            retailers = mock_retailers
            total = len(mock_retailers)
        
        return jsonify({
            'retailers': retailers,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@head_bp.route('/analytics/overview', methods=['GET'])
def get_analytics_overview():
    """Get comprehensive analytics overview - Head roles access"""
    try:
        # Verify token and check if user has head role
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
            
        token = token[7:]
        payload = verify_token(token)
        
        if payload['role'] not in ['head_retailer', 'head_distributor', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get collections
        users = get_collection('users')
        products = get_collection('products')
        orders = get_collection('orders')
        
        # Calculate stats
        total_retailers = users.count_documents({'role': 'retailer'})
        total_distributors = users.count_documents({'role': 'distributor'})
        total_products = products.count_documents({})
        total_orders = orders.count_documents({})
        
        # If no data in database, return mock analytics
        if total_retailers == 0:
            analytics = {
                'total_retailers': 500,
                'total_distributors': 200,
                'total_products': 1247,
                'total_orders': 15420,
                'total_revenue': 2450000,
                'active_retailers': 470,
                'active_distributors': 195,
                'low_stock_products': 23,
                'pending_orders': 45,
                'completed_orders_today': 128,
                'revenue_today': 145000,
                'top_brands': [
                    {'name': 'Nestle', 'products': 45, 'revenue': 125000},
                    {'name': 'Unilever', 'products': 38, 'revenue': 98000},
                    {'name': 'P&G', 'products': 32, 'revenue': 87000}
                ],
                'top_categories': [
                    {'name': 'Beverages', 'orders': 2340, 'revenue': 580000},
                    {'name': 'Snacks', 'orders': 1890, 'revenue': 420000},
                    {'name': 'Dairy', 'orders': 1560, 'revenue': 380000}
                ]
            }
        else:
            # Calculate real analytics
            total_revenue = orders.aggregate([
                {'$group': {'_id': None, 'total': {'$sum': '$total_amount'}}}
            ])
            
            analytics = {
                'total_retailers': total_retailers,
                'total_distributors': total_distributors,
                'total_products': total_products,
                'total_orders': total_orders,
                'total_revenue': list(total_revenue)[0]['total'] if total_revenue else 0,
                'active_retailers': users.count_documents({'role': 'retailer', 'is_active': True}),
                'active_distributors': users.count_documents({'role': 'distributor', 'is_active': True}),
                'low_stock_products': products.count_documents({'stock_quantity': {'$lt': 10}}),
                'pending_orders': orders.count_documents({'status': 'pending'}),
                'completed_orders_today': orders.count_documents({'status': 'completed'}),
                'revenue_today': 0  # Would need date filtering
            }
        
        return jsonify(analytics), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
