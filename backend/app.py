from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from db import db

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

from routes.auth_routes import auth_bp
from routes.task_routes import tasks_bp

app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)

@app.get("/test")
def test():
    return {"message": "Backend is working!"}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
