from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime
from app.routes.auth import auth_bp
from app.routes.products import products_bp
from app.routes.analytics import analytics_bp
from app.routes.orders import orders_bp
from app.utils.database import init_db

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'qwipo-ai-secret-key-2024')
    app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/qwipo_ai')
    
    # Initialize extensions
    CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])
    socketio = SocketIO(app, cors_allowed_origins=['http://localhost:5173', 'http://127.0.0.1:5173'])
    
    # Initialize database
    init_db(app.config['MONGO_URI'])
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    
    # Health check endpoint for mobile optimization
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'mobile_optimized': True,
            'version': '1.0.0',
            'features': ['voice_assistant', 'real_time_updates', 'mobile_responsive']
        })
    
    # WebSocket events for real-time mobile updates
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')
        emit('status', {'msg': 'Connected to Qwipo AI'})
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')
    
    @socketio.on('join_room')
    def handle_join_room(data):
        room = data.get('room', 'default')
        join_room(room)
        emit('status', {'msg': f'Joined room: {room}'})
    
    @socketio.on('voice_command')
    def handle_voice_command(data):
        command = data.get('command', '')
        user_id = data.get('user_id', 'anonymous')
        
        # Process voice command
        response = process_voice_command(command, user_id)
        
        emit('voice_response', {
            'command': command,
            'response': response,
            'timestamp': str(datetime.utcnow())
        })
    
    @socketio.on('stock_update_request')
    def handle_stock_update_request(data):
        user_id = data.get('user_id')
        
        # Get real-time stock data
        stock_data = get_real_time_stock(user_id)
        
        emit('stock_update', {
            'data': stock_data,
            'timestamp': str(datetime.utcnow())
        })
    
    return app, socketio

def process_voice_command(command, user_id):
    """Process voice commands with mobile-optimized responses"""
    command = command.lower()
    
    # Simple command processing
    if 'stock' in command or 'inventory' in command:
        return {
            'type': 'stock_info',
            'message': 'I can help you check your stock levels. You currently have 142 products with 3 items running low on stock.',
            'data': {
                'total_products': 142,
                'low_stock_items': 3,
                'critical_items': 1
            }
        }
    
    elif 'sales' in command or 'revenue' in command:
        return {
            'type': 'sales_info',
            'message': 'Your sales are looking great! You\'ve sold ₹45,000 worth of products this week.',
            'data': {
                'weekly_sales': 45000,
                'growth': '15%',
                'top_product': 'Maggi Noodles'
            }
        }
    
    elif 'order' in command or 'reorder' in command:
        return {
            'type': 'order_info',
            'message': 'I can help you place orders. Which products would you like to reorder?',
            'data': {
                'suggested_products': ['Maggi Noodles', 'Coca Cola', 'Lays Chips'],
                'auto_reorder': True
            }
        }
    
    else:
        return {
            'type': 'general',
            'message': 'I understand you said "' + command + '". How can I help you with your retail business?',
            'data': {
                'suggestions': ['Check stock levels', 'View sales analytics', 'Place new order']
            }
        }

def get_real_time_stock(user_id):
    """Get real-time stock data optimized for mobile"""
    # This would typically fetch from database
    return {
        'products': [
            {'id': 1, 'name': 'Maggi Noodles', 'stock': 45, 'status': 'good'},
            {'id': 2, 'name': 'Coca Cola', 'stock': 12, 'status': 'low'},
            {'id': 3, 'name': 'Lays Chips', 'stock': 78, 'status': 'good'},
            {'id': 4, 'name': 'Parle-G Biscuits', 'stock': 8, 'status': 'critical'},
        ],
        'summary': {
            'total_products': 142,
            'low_stock': 3,
            'critical_stock': 1,
            'last_updated': str(datetime.utcnow())
        }
    }

if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
