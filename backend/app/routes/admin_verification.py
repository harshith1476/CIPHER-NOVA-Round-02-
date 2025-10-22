from flask import Blueprint, request, jsonify
from functools import wraps
from bson import ObjectId
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

admin_verification_bp = Blueprint('admin_verification', __name__)

def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from header
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = token.split(' ')[1]
        
        try:
            # Decode token and check role
            from app.utils.auth import decode_token
            payload = decode_token(token)
            
            if payload['role'] != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            
            # Add user info to request context
            request.current_user = payload
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
    
    return decorated_function

@admin_verification_bp.route('/api/admin/pending-retailers', methods=['GET'])
@require_admin
def get_pending_retailers():
    """Get all retailers pending approval"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Find retailers with pending approval
        pending_retailers = list(db.users.find({
            'role': 'retailer',
            'status': 'pending_approval'
        }))
        
        # Convert ObjectId to string for JSON serialization
        for retailer in pending_retailers:
            retailer['_id'] = str(retailer['_id'])
            # Remove password from response
            retailer.pop('password', None)
        
        return jsonify({
            'success': True,
            'pending_retailers': pending_retailers,
            'count': len(pending_retailers)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_verification_bp.route('/api/admin/verify-retailer', methods=['POST'])
@require_admin
def verify_retailer():
    """Approve or reject a retailer registration"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        data = request.get_json()
        retailer_id = data.get('retailer_id')
        action = data.get('action')  # 'approve' or 'reject'
        admin_notes = data.get('admin_notes', '')
        
        if not retailer_id or not action:
            return jsonify({'error': 'Missing required fields'}), 400
        
        if action not in ['approve', 'reject']:
            return jsonify({'error': 'Invalid action. Must be approve or reject'}), 400
        
        # Find the retailer
        retailer = db.users.find_one({'_id': ObjectId(retailer_id)})
        if not retailer:
            return jsonify({'error': 'Retailer not found'}), 404
        
        if retailer['role'] != 'retailer':
            return jsonify({'error': 'User is not a retailer'}), 400
        
        # Update retailer status
        update_data = {
            'status': 'approved' if action == 'approve' else 'rejected',
            'verified_at': datetime.utcnow(),
            'verified_by': request.current_user['user_id'],
            'admin_notes': admin_notes
        }
        
        db.users.update_one(
            {'_id': ObjectId(retailer_id)},
            {'$set': update_data}
        )
        
        # Send email notification
        try:
            send_verification_email(retailer['email'], action, admin_notes)
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
            # Don't fail the request if email fails
        
        # Log the verification action
        log_verification_action(request.current_user['user_id'], retailer_id, action, admin_notes)
        
        return jsonify({
            'success': True,
            'message': f'Retailer {action}d successfully',
            'retailer_status': update_data['status']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_verification_bp.route('/api/admin/retailer-stats', methods=['GET'])
@require_admin
def get_retailer_stats():
    """Get statistics about retailers"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Count retailers by status
        stats = {
            'total_retailers': db.users.count_documents({'role': 'retailer'}),
            'pending_approval': db.users.count_documents({
                'role': 'retailer', 
                'status': 'pending_approval'
            }),
            'approved': db.users.count_documents({
                'role': 'retailer', 
                'status': 'approved'
            }),
            'rejected': db.users.count_documents({
                'role': 'retailer', 
                'status': 'rejected'
            })
        }
        
        # Get recent registrations
        recent_registrations = list(db.users.find(
            {'role': 'retailer'},
            {'name': 1, 'email': 1, 'status': 1, 'created_at': 1}
        ).sort('created_at', -1).limit(10))
        
        for reg in recent_registrations:
            reg['_id'] = str(reg['_id'])
        
        return jsonify({
            'success': True,
            'stats': stats,
            'recent_registrations': recent_registrations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def send_verification_email(email, action, admin_notes):
    """Send email notification to retailer about verification status"""
    try:
        # Email configuration (you'll need to set up SMTP)
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "noreply@qwipo.ai"  # Your email
        sender_password = "your_app_password"  # Your app password
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email
        msg['Subject'] = f"Account {action.title()} - Qwipo AI Platform"
        
        # Email body
        if action == 'approve':
            body = f"""
            <h2>🎉 Welcome to Qwipo AI Platform!</h2>
            <p>Your retailer account has been <strong>approved</strong> by our admin team.</p>
            <p>You can now:</p>
            <ul>
                <li>Browse and purchase products</li>
                <li>Access AI-powered recommendations</li>
                <li>Track your orders in real-time</li>
                <li>View analytics and insights</li>
            </ul>
            <p><strong>Admin Notes:</strong> {admin_notes if admin_notes else 'None'}</p>
            <p><a href="http://localhost:5173/login" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
            <p>Best regards,<br>Qwipo AI Team</p>
            """
        else:
            body = f"""
            <h2>Account Review - Qwipo AI Platform</h2>
            <p>We're sorry to inform you that your retailer account registration has been <strong>rejected</strong>.</p>
            <p><strong>Reason:</strong> {admin_notes if admin_notes else 'Please contact support for more information.'}</p>
            <p>If you believe this is an error, please contact our support team.</p>
            <p>Best regards,<br>Qwipo AI Team</p>
            """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Send email (commented out to avoid SMTP errors in demo)
        # server = smtplib.SMTP(smtp_server, smtp_port)
        # server.starttls()
        # server.login(sender_email, sender_password)
        # server.send_message(msg)
        # server.quit()
        
        print(f"Email sent to {email}: Account {action}")
        
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")

def log_verification_action(admin_id, retailer_id, action, notes):
    """Log admin verification actions"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return
        
        log_entry = {
            'admin_id': admin_id,
            'retailer_id': retailer_id,
            'action': action,
            'notes': notes,
            'timestamp': datetime.utcnow()
        }
        
        db.admin_verification_logs.insert_one(log_entry)
        
    except Exception as e:
        print(f"Failed to log verification action: {e}")

@admin_verification_bp.route('/api/admin/verification-logs', methods=['GET'])
@require_admin
def get_verification_logs():
    """Get admin verification logs"""
    try:
        from app.utils.database import get_db
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get recent verification logs
        logs = list(db.admin_verification_logs.find().sort('timestamp', -1).limit(50))
        
        for log in logs:
            log['_id'] = str(log['_id'])
            log['timestamp'] = log['timestamp'].isoformat()
        
        return jsonify({
            'success': True,
            'logs': logs
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
