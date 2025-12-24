from flask import Blueprint, request, jsonify
from extensions import db
from models.expense import Expense
from models.category import Category
from sqlalchemy import func
from werkzeug.utils import secure_filename
import os

expense_bp = Blueprint("expense", __name__)

UPLOAD_FOLDER = "uploads"

# ---------------------------------
# ADD EXPENSE (Employee + Receipt Upload)
# ---------------------------------
@expense_bp.route("/add-expense", methods=["POST"])
def add_expense():
    user_id = request.form.get("user_id")
    amount = request.form.get("amount")
    category_id = request.form.get("category_id")
    description = request.form.get("description")

    receipt_file = request.files.get("receipt")
    filename = None

    if receipt_file:
        filename = secure_filename(receipt_file.filename)
        receipt_path = os.path.join(UPLOAD_FOLDER, filename)
        receipt_file.save(receipt_path)

    if not user_id or not amount or not category_id:
        return jsonify({"message": "Missing required fields"}), 400

    new_expense = Expense(
        user_id=user_id,
        amount=amount,
        category_id=category_id,
        description=description,
        receipt=filename,
        status="pending"
    )

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"message": "Expense added successfully"})


# ---------------------------------
# GET PENDING EXPENSES (Manager Panel)
# ---------------------------------
@expense_bp.route("/pending-expenses", methods=["GET"])
def pending_expenses():
    expenses = (
        db.session.query(Expense, Category)
        .join(Category, Expense.category_id == Category.id)
        .filter(Expense.status == "pending")
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
            "receipt": e.receipt,
            "status": e.status
        })

    return jsonify(result)


# ---------------------------------
# APPROVE / REJECT EXPENSE (Manager)
# ---------------------------------
@expense_bp.route("/update-expense-status", methods=["POST"])
def update_expense_status():
    data = request.get_json()

    expense_id = data.get("expense_id")
    status = data.get("status")  # approved / rejected

    expense = Expense.query.get(expense_id)

    if not expense:
        return jsonify({"message": "Expense not found"}), 404

    expense.status = status
    db.session.commit()

    return jsonify({"message": f"Expense {status} successfully"})


# ---------------------------------
# ANALYTICS (Dashboard)
# ---------------------------------
@expense_bp.route("/analytics", methods=["GET"])
def analytics():
    total_expense = (
        db.session.query(func.sum(Expense.amount))
        .filter(Expense.status == "approved")
        .scalar()
    ) or 0

    category_data = (
        db.session.query(Category.name, func.sum(Expense.amount))
        .join(Expense, Expense.category_id == Category.id)
        .filter(Expense.status == "approved")
        .group_by(Category.name)
        .all()
    )

    categories = []
    for name, total in category_data:
        categories.append({
            "category": name,
            "total": total
        })

    return jsonify({
        "total_expense": total_expense,
        "category_wise": categories
    })
