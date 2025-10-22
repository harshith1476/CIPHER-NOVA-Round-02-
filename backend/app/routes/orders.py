from flask import Blueprint, request, jsonify
from app.utils.database import get_collection
from app.utils.auth import token_required
from datetime import datetime
from bson import ObjectId

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
def get_orders():
    """Get all orders (filtered by user role)"""
    try:
        orders = get_collection('orders')
        
        # Get query parameters
        retailer_id = request.args.get('retailer_id')
        status = request.args.get('status')
        
        # Build query
        query = {}
        if retailer_id:
            query['retailer_id'] = retailer_id
        if status:
            query['status'] = status
        
        # Get orders
        order_list = list(orders.find(query).sort('created_at', -1).limit(100))
        
        # Convert ObjectId to string
        for order in order_list:
            order['_id'] = str(order['_id'])
            if 'retailer_id' in order:
                order['retailer_id'] = str(order['retailer_id'])
            for item in order.get('items', []):
                if 'product_id' in item:
                    item['product_id'] = str(item['product_id'])
        
        return jsonify({
            'orders': order_list,
            'count': len(order_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<order_id>', methods=['GET'])
def get_order(order_id):
    """Get single order by ID"""
    try:
        orders = get_collection('orders')
        order = orders.find_one({'_id': ObjectId(order_id)})
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        order['_id'] = str(order['_id'])
        if 'retailer_id' in order:
            order['retailer_id'] = str(order['retailer_id'])
        for item in order.get('items', []):
            if 'product_id' in item:
                item['product_id'] = str(item['product_id'])
        
        return jsonify({'order': order}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/', methods=['POST'])
def create_order():
    """Create new order (Retailer)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'items' not in data or not data['items']:
            return jsonify({'error': 'Order must have at least one item'}), 400
        
        # Calculate total amount
        total_amount = 0
        for item in data['items']:
            if 'quantity' not in item or 'price' not in item:
                return jsonify({'error': 'Each item must have quantity and price'}), 400
            total_amount += item['quantity'] * item['price']
        
        # Create order document
        orders = get_collection('orders')
        order_doc = {
            'retailer_id': data.get('retailer_id', ''),
            'items': data['items'],
            'total_amount': total_amount,
            'status': 'pending',
            'delivery_address': data.get('delivery_address', ''),
            'notes': data.get('notes', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'mobile_order': data.get('mobile_order', False)
        }
        
        result = orders.insert_one(order_doc)
        
        # Update product stock
        products = get_collection('products')
        for item in data['items']:
            if 'product_id' in item:
                products.update_one(
                    {'_id': ObjectId(item['product_id'])},
                    {
                        '$inc': {'stock': -item['quantity']},
                        '$set': {'updated_at': datetime.utcnow()}
                    }
                )
        
        return jsonify({
            'message': 'Order created successfully',
            'order_id': str(result.inserted_id),
            'total_amount': total_amount
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
        if data['status'] not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        orders = get_collection('orders')
        result = orders.update_one(
            {'_id': ObjectId(order_id)},
            {
                '$set': {
                    'status': data['status'],
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'message': 'Order status updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/stats', methods=['GET'])
def get_order_stats():
    """Get order statistics"""
    try:
        orders = get_collection('orders')
        
        # Get stats
        total_orders = orders.count_documents({})
        pending_orders = orders.count_documents({'status': 'pending'})
        completed_orders = orders.count_documents({'status': 'delivered'})
        
        # Calculate total revenue
        pipeline = [
            {'$match': {'status': 'delivered'}},
            {'$group': {'_id': None, 'total_revenue': {'$sum': '$total_amount'}}}
        ]
        revenue_result = list(orders.aggregate(pipeline))
        total_revenue = revenue_result[0]['total_revenue'] if revenue_result else 0
        
        return jsonify({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'total_revenue': total_revenue
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

