from extensions import db

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    description = db.Column(db.String(200))
    receipt = db.Column(db.String(200)) 
    status = db.Column(db.String(20), default="pending")
