from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import Task
from db import db

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.get('/tasks')
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()

    tasks = Task.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "done": t.done
        } for t in tasks
    ])

@tasks_bp.post('/tasks')
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()

    new_task = Task(
        title=data.get("title"),
        description=data.get("description"),
        done = False,
        user_id=user_id
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message": "Task created!"}), 201

@tasks_bp.put('/tasks/<int:task_id>')
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({"error": "Task not found!"}), 404

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.done = data.get("done", task.done)

    db.session.commit()

    return jsonify({"message": "Task updated!"})

@tasks_bp.delete('/tasks/<int:task_id>')
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({"error": "Task not found!"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task bye bye!"})