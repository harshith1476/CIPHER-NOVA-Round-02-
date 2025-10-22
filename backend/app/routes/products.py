from flask import Blueprint, request, jsonify
from app.utils.database import get_collection
from app.utils.auth import token_required
from datetime import datetime
from bson import ObjectId

products_bp = Blueprint('products', __name__)

@products_bp.route('/all', methods=['GET'])
def get_all_products():
    """Get all products (public endpoint for landing page)"""
    try:
        products = get_collection('products')
        
        # Get all products with limit
        product_list = list(products.find({'is_active': True}).limit(500))
        
        # Convert ObjectId to string
        for product in product_list:
            product['_id'] = str(product['_id'])
            if 'distributor_id' in product:
                product['distributor_id'] = str(product['distributor_id'])
        
        return jsonify({
            'products': product_list,
            'count': len(product_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all products (with optional filters)"""
    try:
        products = get_collection('products')
        
        # Get query parameters
        category = request.args.get('category')
        distributor_id = request.args.get('distributor_id')
        search = request.args.get('search')
        
        # Build query
        query = {}
        if category:
            query['category'] = category
        if distributor_id:
            query['distributor_id'] = distributor_id
        if search:
            query['name'] = {'$regex': search, '$options': 'i'}
        
        # Get products
        product_list = list(products.find(query).limit(100))
        
        # Convert ObjectId to string
        for product in product_list:
            product['_id'] = str(product['_id'])
            if 'distributor_id' in product:
                product['distributor_id'] = str(product['distributor_id'])
        
        return jsonify({
            'products': product_list,
            'count': len(product_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        products = get_collection('products')
        product = products.find_one({'_id': ObjectId(product_id)})
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        product['_id'] = str(product['_id'])
        if 'distributor_id' in product:
            product['distributor_id'] = str(product['distributor_id'])
        
        return jsonify({'product': product}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/', methods=['POST'])
def create_product():
    """Create new product (Distributor only)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category', 'price', 'stock']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create product document
        products = get_collection('products')
        product_doc = {
            'name': data['name'],
            'description': data.get('description', ''),
            'category': data['category'],
            'price': float(data['price']),
            'mrp': float(data.get('mrp', data['price'])),
            'stock': int(data['stock']),
            'min_stock': int(data.get('min_stock', 10)),
            'unit': data.get('unit', 'pcs'),
            'brand': data.get('brand', ''),
            'image_url': data.get('image_url', ''),
            'distributor_id': data.get('distributor_id', ''),
            'is_active': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = products.insert_one(product_doc)
        
        return jsonify({
            'message': 'Product created successfully',
            'product_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<product_id>', methods=['PUT'])
def update_product(product_id):
    """Update product (Distributor only)"""
    try:
        data = request.get_json()
        products = get_collection('products')
        
        # Update fields
        update_data = {
            'updated_at': datetime.utcnow()
        }
        
        allowed_fields = ['name', 'description', 'category', 'price', 'mrp', 
                         'stock', 'min_stock', 'unit', 'brand', 'image_url', 'is_active']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        result = products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'message': 'Product updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete product (Distributor only)"""
    try:
        products = get_collection('products')
        result = products.delete_one({'_id': ObjectId(product_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        products = get_collection('products')
        categories = products.distinct('category')
        
        return jsonify({'categories': categories}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/low-stock', methods=['GET'])
def get_low_stock():
    """Get products with low stock"""
    try:
        products = get_collection('products')
        
        # Find products where stock <= min_stock
        low_stock_products = list(products.find({
            '$expr': {'$lte': ['$stock', '$min_stock']}
        }).limit(50))
        
        for product in low_stock_products:
            product['_id'] = str(product['_id'])
            if 'distributor_id' in product:
                product['distributor_id'] = str(product['distributor_id'])
        
        return jsonify({
            'products': low_stock_products,
            'count': len(low_stock_products)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

