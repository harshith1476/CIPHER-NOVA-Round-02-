from flask import Blueprint, request, jsonify
from functools import wraps
from bson import ObjectId
from datetime import datetime
import uuid

cart_orders_bp = Blueprint('cart_orders', __name__)

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = token.split(' ')[1]
        
        try:
            from app.utils.auth import decode_token
            payload = decode_token(token)
            request.current_user = payload
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
    
    return decorated_function

@cart_orders_bp.route('/api/cart', methods=['GET'])
@require_auth
def get_cart():
    """Get user's cart items"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_id = request.current_user['user_id']
        
        # Get cart items
        cart_items = list(db.cart.find({'user_id': user_id}))
        
        # Get product details for each cart item
        for item in cart_items:
            product = db.products.find_one({'_id': ObjectId(item['product_id'])})
            if product:
                item['product_details'] = {
                    'name': product.get('product_name', 'Unknown Product'),
                    'price': product.get('price', 0),
                    'image': product.get('images', [''])[0] if product.get('images') else '',
                    'brand': product.get('brand', ''),
                    'category': product.get('category', ''),
                    'stock_quantity': product.get('stock_quantity', 0)
                }
            else:
                item['product_details'] = None
        
        # Calculate totals
        total_items = sum(item['quantity'] for item in cart_items)
        total_amount = sum(
            item['quantity'] * item['product_details']['price'] 
            for item in cart_items 
            if item['product_details']
        )
        
        return jsonify({
            'success': True,
            'cart_items': cart_items,
            'total_items': total_items,
            'total_amount': round(total_amount, 2)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_orders_bp.route('/api/cart/add', methods=['POST'])
@require_auth
def add_to_cart():
    """Add item to cart"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400
        
        user_id = request.current_user['user_id']
        
        # Check if product exists and has stock
        product = db.products.find_one({'_id': ObjectId(product_id)})
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        if product.get('stock_quantity', 0) < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        # Check if item already in cart
        existing_item = db.cart.find_one({
            'user_id': user_id,
            'product_id': product_id
        })
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item['quantity'] + quantity
            if new_quantity > product.get('stock_quantity', 0):
                return jsonify({'error': 'Cannot add more items than available in stock'}), 400
            
            db.cart.update_one(
                {'user_id': user_id, 'product_id': product_id},
                {'$set': {'quantity': new_quantity, 'updated_at': datetime.utcnow()}}
            )
        else:
            # Add new item to cart
            cart_item = {
                'user_id': user_id,
                'product_id': product_id,
                'quantity': quantity,
                'added_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            db.cart.insert_one(cart_item)
        
        return jsonify({
            'success': True,
            'message': 'Item added to cart successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_orders_bp.route('/api/cart/update', methods=['PUT'])
@require_auth
def update_cart_item():
    """Update cart item quantity"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity')
        
        if not product_id or quantity is None:
            return jsonify({'error': 'Product ID and quantity are required'}), 400
        
        user_id = request.current_user['user_id']
        
        # Check product stock
        product = db.products.find_one({'_id': ObjectId(product_id)})
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        if quantity > product.get('stock_quantity', 0):
            return jsonify({'error': 'Insufficient stock'}), 400
        
        if quantity <= 0:
            # Remove item from cart
            db.cart.delete_one({'user_id': user_id, 'product_id': product_id})
            message = 'Item removed from cart'
        else:
            # Update quantity
            db.cart.update_one(
                {'user_id': user_id, 'product_id': product_id},
                {'$set': {'quantity': quantity, 'updated_at': datetime.utcnow()}}
            )
            message = 'Cart item updated successfully'
        
        return jsonify({
            'success': True,
            'message': message
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_orders_bp.route('/api/cart/remove', methods=['DELETE'])
@require_auth
def remove_from_cart():
    """Remove item from cart"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        data = request.get_json()
        product_id = data.get('product_id')
        
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400
        
        user_id = request.current_user['user_id']
        
        result = db.cart.delete_one({'user_id': user_id, 'product_id': product_id})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Item not found in cart'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Item removed from cart successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_orders_bp.route('/api/orders', methods=['POST'])
@require_auth
def create_order():
    """Create order from cart"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        data = request.get_json()
        delivery_address = data.get('delivery_address')
        payment_method = data.get('payment_method', 'COD')
        
        if not delivery_address:
            return jsonify({'error': 'Delivery address is required'}), 400
        
        user_id = request.current_user['user_id']
        
        # Get cart items
        cart_items = list(db.cart.find({'user_id': user_id}))
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Generate order ID
        order_id = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Calculate order details
        order_items = []
        total_amount = 0
        
        for item in cart_items:
            product = db.products.find_one({'_id': ObjectId(item['product_id'])})
            if not product:
                continue
            
            item_total = item['quantity'] * product['price']
            order_items.append({
                'product_id': item['product_id'],
                'product_name': product['product_name'],
                'quantity': item['quantity'],
                'unit_price': product['price'],
                'total': item_total
            })
            total_amount += item_total
        
        if not order_items:
            return jsonify({'error': 'No valid items in cart'}), 400
        
        # Create order
        order = {
            'order_id': order_id,
            'user_id': user_id,
            'retailer_id': user_id,  # Assuming user_id is retailer_id
            'items': order_items,
            'total_amount': round(total_amount, 2),
            'delivery_address': delivery_address,
            'payment_method': payment_method,
            'payment_status': 'pending',
            'status': 'pending',
            'status_history': [{
                'status': 'pending',
                'timestamp': datetime.utcnow(),
                'note': 'Order placed'
            }],
            'tracking_number': f"TRK-{str(uuid.uuid4())[:12].upper()}",
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Save order
        result = db.orders.insert_one(order)
        order['_id'] = str(result.inserted_id)
        
        # Clear cart
        db.cart.delete_many({'user_id': user_id})
        
        # Update product stock
        for item in cart_items:
            db.products.update_one(
                {'_id': ObjectId(item['product_id'])},
                {'$inc': {'stock_quantity': -item['quantity']}}
            )
        
        return jsonify({
            'success': True,
            'message': 'Order created successfully',
            'order': order
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_orders_bp.route('/api/orders', methods=['GET'])
@require_auth
def get_orders():
    """Get user's orders"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_id = request.current_user['user_id']
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        # Get orders with pagination
        skip = (page - 1) * limit
        orders = list(db.orders.find({'user_id': user_id})
                     .sort('created_at', -1)
                     .skip(skip)
                     .limit(limit))
        
        # Convert ObjectId to string
        for order in orders:
            order['_id'] = str(order['_id'])
            order['created_at'] = order['created_at'].isoformat()
            order['updated_at'] = order['updated_at'].isoformat()
            for status in order.get('status_history', []):
                status['timestamp'] = status['timestamp'].isoformat()
        
        # Get total count
        total_orders = db.orders.count_documents({'user_id': user_id})
        
        return jsonify({
            'success': True,
            'orders': orders,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_orders,
                'pages': (total_orders + limit - 1) // limit
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_orders_bp.route('/api/orders/<order_id>', methods=['GET'])
@require_auth
def get_order_details(order_id):
    """Get specific order details"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_id = request.current_user['user_id']
        
        # Find order
        order = db.orders.find_one({
            'order_id': order_id,
            'user_id': user_id
        })
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Convert ObjectId and datetime
        order['_id'] = str(order['_id'])
        order['created_at'] = order['created_at'].isoformat()
        order['updated_at'] = order['updated_at'].isoformat()
        for status in order.get('status_history', []):
            status['timestamp'] = status['timestamp'].isoformat()
        
        return jsonify({
            'success': True,
            'order': order
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_orders_bp.route('/api/orders/<order_id>/track', methods=['GET'])
@require_auth
def track_order(order_id):
    """Track order status"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_id = request.current_user['user_id']
        
        # Find order
        order = db.orders.find_one({
            'order_id': order_id,
            'user_id': user_id
        })
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Simulate tracking data (in real app, integrate with shipping API)
        tracking_data = {
            'tracking_number': order['tracking_number'],
            'status': order['status'],
            'current_location': get_current_location(order['status']),
            'estimated_delivery': get_estimated_delivery(order['created_at']),
            'status_history': order['status_history']
        }
        
        return jsonify({
            'success': True,
            'tracking': tracking_data
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_current_location(status):
    """Get current location based on order status"""
    locations = {
        'pending': 'Processing at warehouse',
        'confirmed': 'Confirmed and ready for shipping',
        'shipped': 'In transit to delivery hub',
        'in_transit': 'Out for delivery',
        'delivered': 'Delivered successfully',
        'cancelled': 'Order cancelled'
    }
    return locations.get(status, 'Status unknown')

def get_estimated_delivery(created_at):
    """Calculate estimated delivery date"""
    from datetime import timedelta
    delivery_date = created_at + timedelta(days=3)  # 3 days delivery
    return delivery_date.isoformat()
