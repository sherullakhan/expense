import os
from flask import request
from flask import Flask
from config import Config
from extensions import db
from models.user import User
from routes.auth import auth_bp
from models.expense import Expense
from routes.expense import expense_bp
from flask import render_template
from routes.admin import admin_bp
from models.category import Category
from flask import redirect, url_for


app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(auth_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(admin_bp)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db.init_app(app)

@app.route("/")
def home():
    return redirect(url_for("login_page"))

@app.route("/login-page")
def login_page():
    return render_template("login.html")

@app.route("/signup-page")
def signup_page():
    return render_template("signup.html")


@app.route("/dashboard-page")
def dashboard_page():
    return render_template("dashboard.html")

@app.route("/add-expense-page")
def add_expense_page():
    return render_template("add_expense.html")

@app.route("/manager-page")
def manager_page():
    return render_template("manager.html")

@app.route("/admin-page")
def admin_page():
    return render_template("admin.html")



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        with app.app_context():
            db.create_all()
            if Category.query.count() == 0:
             db.session.add(Category(name="Travel"))
             db.session.add(Category(name="Food"))
             db.session.add(Category(name="Internet"))
             db.session.add(Category(name="Other"))
             db.session.commit()
    app.run(debug=True)


DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
