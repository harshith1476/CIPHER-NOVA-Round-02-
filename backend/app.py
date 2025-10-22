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
from app.routes.recommendations import recommendations_bp
from app.routes.predictions import predictions_bp
from app.routes.head_routes import head_bp
from app.routes.admin_verification import admin_verification_bp
from app.routes.cart_orders import cart_orders_bp
from app.utils.database import init_db
import threading
import time

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
    app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
    app.register_blueprint(predictions_bp, url_prefix='/api/predictions')
    app.register_blueprint(head_bp, url_prefix='/api')
    app.register_blueprint(admin_verification_bp, url_prefix='/api/admin')
    app.register_blueprint(cart_orders_bp, url_prefix='/api')
    
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
    
    @socketio.on('subscribe_stock_predictions')
    def handle_subscribe_predictions(data):
        """Subscribe to real-time stock predictions"""
        from app.services.stock_predictions import StockPredictionEngine
        from app.utils.database import get_db
        
        room = data.get('room', 'predictions')
        join_room(room)
        
        # Send initial predictions
        try:
            db = get_db()
            if db is not None:  # MongoDB objects need explicit None check
                stock_engine = StockPredictionEngine(db)
                predictions = stock_engine.predict_stock_levels(days_ahead=7)
                
                emit('stock_predictions_update', {
                    'predictions': predictions[:20],  # Top 20
                    'timestamp': str(datetime.utcnow()),
                    'update_interval': 30  # seconds
                }, room=room)
            else:
                emit('error', {'message': 'Database not available'})
        except Exception as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('subscribe_recommendations')
    def handle_subscribe_recommendations(data):
        """Subscribe to real-time recommendations"""
        from app.services.ai_recommendations import AIRecommendationEngine
        from app.utils.database import get_db
        
        retailer_id = data.get('retailer_id')
        room = f"recommendations_{retailer_id}"
        join_room(room)
        
        # Send initial recommendations
        try:
            db = get_db()
            if db is not None:  # MongoDB objects need explicit None check
                rec_engine = AIRecommendationEngine(db)
                recommendations = rec_engine.get_personalized_recommendations(
                    retailer_id=retailer_id,
                    limit=10
                )
                
                emit('recommendations_update', {
                    'recommendations': recommendations,
                    'timestamp': str(datetime.utcnow())
                }, room=room)
            else:
                emit('error', {'message': 'Database not available'})
        except Exception as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('request_trending')
    def handle_request_trending(data):
        """Get trending products in real-time"""
        from app.services.ai_recommendations import AIRecommendationEngine
        from app.utils.database import get_db
        
        try:
            db = get_db()
            if db is not None:  # MongoDB objects need explicit None check
                rec_engine = AIRecommendationEngine(db)
                trending = rec_engine.get_trending_products(limit=10)
                
                emit('trending_update', {
                    'trending': trending,
                    'timestamp': str(datetime.utcnow())
                })
            else:
                emit('error', {'message': 'Database not available'})
        except Exception as e:
            emit('error', {'message': str(e)})
    
    # Background task for real-time prediction updates
    def broadcast_predictions():
        """Background task to broadcast predictions every 30 seconds"""
        from app.services.stock_predictions import StockPredictionEngine
        from app.utils.database import get_db
        
        while True:
            try:
                time.sleep(30)  # Update every 30 seconds
                
                db = get_db()
                if db is not None:  # MongoDB objects need explicit None check
                    stock_engine = StockPredictionEngine(db)
                    predictions = stock_engine.predict_stock_levels(days_ahead=7)
                    alerts = stock_engine.get_realtime_alerts()
                    
                    # Broadcast to all connected clients in predictions room
                    socketio.emit('stock_predictions_update', {
                        'predictions': predictions[:20],
                        'alerts': alerts[:10],
                        'timestamp': str(datetime.utcnow())
                    }, room='predictions')
            except Exception as e:
                print(f"Error broadcasting predictions: {e}")
    
    # Start background prediction broadcaster (disabled by default to avoid errors)
    # Uncomment next 2 lines to enable real-time broadcasts:
    # prediction_thread = threading.Thread(target=broadcast_predictions, daemon=True)
    # prediction_thread.start()
    
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
