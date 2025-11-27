from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user import User
from db import db
from flask_jwt_extended import jwt_required, get_jwt
from models.task import Task

auth_bp = Blueprint('auth', __name__)

@auth_bp.post('/register')
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(username=username)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.post('/login')
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.username, additional_claims={"user_id": user.id})

    return jsonify({"token": access_token}), 200


@auth_bp.delete('/delete')
@jwt_required()
def delete_account():
    data = request.get_json() or {}
    password = data.get('password', None)

    jwt_data = get_jwt()
    user_id = jwt_data.get('user_id')

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if password is None or not user.check_password(password):
        return jsonify({"error": "Invalid password"}), 401

    Task.query.filter_by(user_id=user.id).delete()

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted"}), 200


@auth_bp.post('/verify-password')
@jwt_required()
def verify_password():
    data = request.get_json() or {}
    password = data.get('password', None)

    jwt_data = get_jwt()
    user_id = jwt_data.get('user_id')

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if password is None or not user.check_password(password):
        return jsonify({"error": "Invalid password"}), 401

    return jsonify({"message": "Password verified"}), 200
