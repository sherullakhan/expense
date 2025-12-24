from flask import Blueprint, jsonify
from extensions import db
from models.user import User
from models.expense import Expense
from models.category import Category

admin_bp = Blueprint("admin", __name__)

# -------------------------------
# GET ALL USERS
# -------------------------------
@admin_bp.route("/admin/users", methods=["GET"])
def get_users():
    users = User.query.all()
    result = []

    for u in users:
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        })

    return jsonify(result)


# -------------------------------
# GET ALL EXPENSES (WITH CATEGORY)
# -------------------------------
@admin_bp.route("/admin/expenses", methods=["GET"])
def get_expenses():
    expenses = (
        db.session.query(Expense, Category)
        .join(Category, Expense.category_id == Category.id)
        .all()
    )

    result = []
    for e, c in expenses:
        result.append({
            "id": e.id,
            "user_id": e.user_id,
            "amount": e.amount,
            "category": c.name,
            "description": e.description,
            "status": e.status
        })

    return jsonify(result)
