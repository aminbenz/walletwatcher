import os
from flask import Blueprint, jsonify, request,make_response,session,redirect, abort
from app.models import db, User, Transaction  # Assuming Transaction model exists
from app.schemas import UserSchema, TransactionSchema, RegisterSchema
from app import bcrypt 
from sqlalchemy import func, desc

from sqlalchemy.ext.declarative import declarative_base
from enum import Enum
from datetime import datetime, timedelta

users_bp = Blueprint('users', __name__)
transaction_bp = Blueprint('transactions', __name__)
auth_bp = Blueprint('auth', __name__)
me_bp = Blueprint('me', __name__)

def json(code, message, query_result=None):
    """
    Convert SQLAlchemy query result to JSON-serializable data.
    """
    if query_result is not None:
        if isinstance(query_result, list):
            result = [
                {column.name: getattr(item, column.name) for column in item.__table__.columns}
                for item in query_result
            ]
        elif isinstance(query_result, dict):
            result = {key: getattr(query_result[key], key) for key in query_result}
        else:
            result = {column.name: getattr(query_result, column.name) for column in query_result.__table__.columns}
    else:
        result = None

    return jsonify({"message": message, "result": result}), code

def to_json(code, message, query_result=None, meta =True):
    """
    Convert SQLAlchemy query result to JSON-serializable data.
    """
    if query_result is not None:
        if isinstance(query_result, list):
            result = [
                {column.name: getattr(item, column.name) for column in item.__table__.columns}
                for item in query_result
            ]
        elif isinstance(query_result, dict):
            result = {key: getattr(query_result[key], key) for key in query_result}
        else:
            result = {column.name: getattr(query_result, column.name) for column in query_result.__table__.columns}
    else:
        result = None

    return jsonify({"message": message, "meta" : {
        "count": len(query_result)
        }, "result": result}), code

def cjson(query_result=None):
    """
    Convert SQLAlchemy query result to JSON-serializable data.
    """
    if query_result is not None:
        if isinstance(query_result, list):
            result = [
                {column.name: getattr(item, column.name) for column in item.__table__.columns}
                for item in query_result
            ]
        elif isinstance(query_result, dict):
            result = {key: getattr(query_result[key], key) for key in query_result}
        else:
            result = {column.name: getattr(query_result, column.name) for column in query_result.__table__.columns}
    else:
        result = None

    return result


@me_bp.route("/@me" , methods=["GET" , "PATCH"])
def me():
    try:
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"message":  "Messing Session"}), 401
        
        if request.method == "GET":
            user = User.query.get(user_id)

            return jsonify({"message" : "Get User" , "result" : {
                "id" : user.id,
                "username" : user.username,
                "email" : user.email,
                "first_name" : user.first_name,
                "last_name" : user.last_name,
                # "dob" : user.dob.strftime('%Y-%m-%d'),
                "language" : user.language,
                "currency" : user.currency,
            } })
        
        if request.method == "PATCH":
            new_user_data = request.json
            updated_rows = User.query.filter_by(id=user_id).update(new_user_data)
            db.session.commit()
            if updated_rows > 0:
                return json(202, "User Updated")
                
            
            
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
        
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password:
            return jsonify({'error': 'Please provide email and password'}), 400

        if not 8 <= len(password) <= 30:
            return json(400 , "Password must be between 8 and 30 characters")

        find_user = User.query.filter_by(email=email).first() is not None
        
        if find_user:
            return json(401, "User with this email already exists")
        
        username, _ = email.split("@")
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        new_user = User(email=email, password=hashed_password, username=username, first_name=username, last_name = "")
        db.session.add(new_user)
        db.session.commit()

        session["user_id"] = new_user.id
        return json(201, "User Created")
        
    except Exception as e:
        print(e)
        return json(500, "Error")
        
        

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        email = request.json.get("email")
        password = request.json.get("password")
        
        if not email:
            return jsonify({"error": "Please enter your email"}), 400
        
        if not password:
            return jsonify({"error": "Please enter your password"}), 400
            
        find_user = User.query.filter_by(email=email).first()

        if not find_user:
            return jsonify({"message": "No user with this email"}), 401
        
        
        is_correct_password = bcrypt.check_password_hash(find_user.password, password)
        
        if not is_correct_password:
            return jsonify({"message": "Password Incorrect"}), 400

        session["user_id"] = find_user.id
        return jsonify({"message": "Login successful"}), 200  
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        session["user_id"] = None
        return jsonify({"message" : "Logout"})
    
    except Exception as e:
        print(e)
        return json(500, "Error")


@users_bp.route('/', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        all_users = User.query.all()
        return json(200, "Users", all_users)

    elif request.method == 'POST':
        try:
            user_data = UserSchema.model_validate(request.json)
            new_user = User(
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                email=user_data.email,
                username=user_data.username
            )
            db.session.add(new_user)
            db.session.commit()

            return json(201, "User added successfully")

        except Exception as e:
            return jsonify({'error': str(e)}), 500

class TimeRange(Enum):
    MONTHLY = "month"
    YEARLY = "year"
    CUSTOM_DATE_RANGE = "custom"
def filter_transactions_by_time_range(time_range, limit=20):
    user_id = session.get("user_id")
    if time_range == TimeRange.MONTHLY.value:
        # Filter transactions for the current month
        start_date = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date.replace(month=start_date.month + 1) - timedelta(days=1)
        user_transactions = db.session.query(Transaction).filter(
            Transaction.created_by_id == user_id,
            Transaction.date.between(start_date, end_date)
        ).order_by(desc(Transaction.date) , desc(Transaction.created_at)).limit(limit).all()
        return user_transactions
    elif time_range == TimeRange.YEARLY.value:
        # Filter transactions for the current year
        start_date = datetime.now().replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = datetime.now().replace(month=12, day=31, hour=23, minute=59, second=59, microsecond=999999)
        user_transactions = db.session.query(Transaction).filter(
            Transaction.created_by_id == user_id,
            Transaction.date.between(start_date, end_date)
        ).order_by(desc(Transaction.date) , desc(Transaction.created_at)).limit(limit).all()
        return user_transactions
    elif time_range == TimeRange.CUSTOM_DATE_RANGE.value:
        # Filter transactions for a custom date range (example: last 30 days)
        start_date = datetime.now() - timedelta(days=30)
        end_date = datetime.now()
        user_transactions = session.query(Transaction).filter(
            Transaction.created_by_id == user_id,
            Transaction.date.between(start_date, end_date)
        ).order_by(desc(Transaction.date)).limit(limit).all()
        return user_transactions
    else:
        return []

    
@transaction_bp.route('/', methods=['GET', 'POST' , "DELETE"])
def transactions():
    if request.method == 'GET':
        user_id = session.get("user_id")
        time_range = request.args.get("time_range")
        limit = int(request.args.get("limit", 20))
        type_value = request.args.get("type")
            
        if not user_id:
            return jsonify({'message': 'Missing user_id parameter'})

        if time_range and time_range in [tr.value for tr in TimeRange]:
            user_transactions = filter_transactions_by_time_range(time_range, limit)
            serialized_transactions = cjson(user_transactions)
            count = len(serialized_transactions)
            return jsonify({'meta': {'count': count}, 'result': serialized_transactions})
        
        else:
            if type_value:
                user_transactions = (
                    Transaction.query
                    .filter_by(created_by_id=session.get("user_id"))
                    .filter(Transaction.type == type_value)
                    .order_by(desc(Transaction.date), desc(Transaction.created_at))
                    .limit(limit)
                    .all()
                )
            else:
                user_transactions = (
                    Transaction.query
                    .filter_by(created_by_id=session.get("user_id"))
                    .order_by(desc(Transaction.date), desc(Transaction.created_at))
                    .limit(limit)
                    .all()
                )

            converted_transactions = []
            for transaction in user_transactions:
                converted_transaction = {
                    "id": transaction.id,
                    "description": transaction.description,
                    "category": transaction.category,
                    "amount": transaction.amount,
                    "type": transaction.type,
                    "created_by_id": transaction.created_by_id,
                    "created_at": transaction.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),  # Format date as ISO
                    "date": transaction.date.strftime('%Y-%m-%d')  # Format date as ISO
                }
                converted_transactions.append(converted_transaction)

            return jsonify({
                "message": "Yes",
                "meta": {"count": len(converted_transactions)},
                "result": converted_transactions
            })

    if request.method == 'POST':
        try:
            transaction_data = TransactionSchema.model_validate(request.json)
            user_id = session.get("user_id")

            if not user_id:
                return json(401 , "please login")
            
            new_transaction = Transaction(
                date=transaction_data.date,
                description=transaction_data.description,
                category=transaction_data.category,
                amount=transaction_data.amount,
                type=transaction_data.type,
                created_by_id=user_id
            )

            db.session.add(new_transaction)
            db.session.commit()

            return json(201, 'Transaction added successfully', new_transaction)
        except Exception as e:
            print(e)
            return jsonify({'message': str(e)}), 500
     
    if request.method == "DELETE":
        try:
            deleted_rows = Transaction.query.delete()
            db.session.commit()
            return jsonify({"message": f"Deleted {deleted_rows} Transactions"}), 200
        except Exception as e:
            # Handle exceptions or errors during deletion
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
        
@transaction_bp.route('/overview', methods=['GET'])
def overview():
    if request.method == 'GET':
        user_id = session.get("user_id")
        time_range = request.args.get("time_range")
        limit = int(request.args.get("limit", 20))

        if not user_id:
            return jsonify({'message': 'Missing user_id parameter'})

        if time_range and time_range in [tr.value for tr in TimeRange]:
            user_transactions = filter_transactions_by_time_range(time_range, limit)
        else:
            user_transactions = Transaction.query.filter_by(created_by_id=user_id).order_by(desc(Transaction.date), desc(Transaction.created_at)).limit(limit).all()

        total_income = 0
        total_expense = 0
        total_balance = 0
        for transaction in user_transactions:
            if transaction.type == "income":
                total_income += transaction.amount
            elif transaction.type == "expense":
                  total_expense += transaction.amount
        
        total_balance = total_income - total_expense
        serialized_transactions = cjson(user_transactions)
        count = len(serialized_transactions)
        
        message = f"You made {count} transactions"
        
        if time_range:
            message+= f"in this {time_range}."
        
        
        return jsonify({
            'meta': {'count': count , 
            "time_range" : time_range },
            "message" : message , 
            'result': {
                "transactions": serialized_transactions,
                "total_income": total_income,
                "total_expense": total_expense,
                "total_balance": total_balance
            }
        })
  

@transaction_bp.route('/<int:transaction_id>', methods=["GET", "PATCH", 'DELETE'])
def transaction_by_id(transaction_id):
    try:
        if request.method == "GET":
            transaction = Transaction.query.get(transaction_id)
            transaction_s = {
                "id": transaction.id,
                "description": transaction.description,
                "category": transaction.category,
                "amount": transaction.amount,
                "type": transaction.type,
                "created_by_id": transaction.created_by_id,
                "created_at": transaction.created_at, 
                "date": transaction.date.strftime('%Y-%m-%d')  # Fo
            }
            
            if transaction:
                return jsonify({
                    "message" : f"Transaction with ID {transaction_id} found",
                    "result" : transaction_s
                    })
            else:
                return jsonify({
                    "message" : f"Transaction with ID {transaction_id} not found"
                }), 404
            
        if request.method == "PATCH":
            body = request.json
            updated_rows = Transaction.query.filter_by(id=transaction_id).update(body)

            if updated_rows > 0:
                db.session.commit()
                return jsonify({
                    "message": f"Transaction with ID {transaction_id} updated",
                    "result": None
                }), 200
            else:
                return jsonify({
                    "message": f"Transaction with ID {transaction_id} not found or no changes were made"
                }), 404 
                
        if request.method == "DELETE":
            transaction = Transaction.query.get(transaction_id)

            if transaction:
                # Delete the transaction record
                db.session.delete(transaction)
                db.session.commit()

                return json(200, f"Transaction with ID {transaction_id} deleted successfully")
            else:
                return json(404, f"Transaction with ID {transaction_id} not found")
    except Exception as e:
        return jsonify({'message': str(e)}), 500
