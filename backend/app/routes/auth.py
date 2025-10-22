from flask import Blueprint, request, jsonify
from app.utils.database import get_collection
from app.utils.auth import hash_password, verify_password, generate_token
from datetime import datetime
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate role
        if data['role'] not in ['retailer', 'distributor', 'admin', 'head_retailer', 'head_distributor']:
            return jsonify({'error': 'Invalid role'}), 400
        
        # Check if user already exists
        users = get_collection('users')
        if users.find_one({'email': data['email']}):
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Hash password
        hashed_password = hash_password(data['password'])
        
        # Set status based on role - retailers need admin approval
        status = 'pending_approval' if data['role'] == 'retailer' else 'approved'
        
        # Create user document
        user_doc = {
            'name': data['name'],
            'email': data['email'],
            'password': hashed_password,
            'role': data['role'],
            'status': status,
            'company_name': data.get('company_name', ''),
            'phone': data.get('phone', ''),
            'address': data.get('address', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True,
            'mobile_device': data.get('mobile_device', False)
        }
        
        # Insert user
        result = users.insert_one(user_doc)
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        users = get_collection('users')
        user = users.find_one({'email': data['email']})
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not verify_password(data['password'], user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if user is active
        if not user.get('is_active', True):
            return jsonify({'error': 'Account is deactivated'}), 403
        
        # Check approval status for retailers
        if user.get('role') == 'retailer' and user.get('status') == 'pending_approval':
            return jsonify({'error': 'Your account is pending admin approval. Please wait for verification.'}), 403
        
        if user.get('status') == 'rejected':
            return jsonify({'error': 'Your account has been rejected. Please contact support.'}), 403
        
        # Update last login
        users.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        # Generate token
        token = generate_token(user)
        
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'company_name': user.get('company_name', '')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user info"""
    try:
        # This would typically use a token verification decorator
        # For now, we'll implement basic user info retrieval
        from app.utils.auth import verify_token
        
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
            
        token = token[7:]  # Remove 'Bearer ' prefix
        
        try:
            payload = verify_token(token)
            user_id = payload['user_id']
            
            users = get_collection('users')
            user = users.find_one({'_id': ObjectId(user_id)})
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
                
            return jsonify({
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role'],
                    'company_name': user.get('company_name', ''),
                    'phone': user.get('phone', ''),
                    'address': user.get('address', ''),
                    'created_at': user['created_at'].isoformat(),
                    'last_login': user.get('last_login', user['created_at']).isoformat(),
                    'is_active': user.get('is_active', True),
                    'mobile_device': user.get('mobile_device', False)
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user (invalidate token on client side)"""
    try:
        # In a real implementation, you might want to blacklist the token
        # For now, we'll just return success as token invalidation is handled client-side
        return jsonify({
            'message': 'Logged out successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

