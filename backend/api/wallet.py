from flask import Blueprint, request, jsonify
from auth import auth_required
from memory import wallets_memory, transactions_memory, users_memory
from logger import log_info
from datetime import datetime

# ===============================
# 🔹 Blueprint Wallet API
# ===============================
wallet_bp = Blueprint('wallet', __name__)

# -------------------------------
# 🔹 Get current user balance
@wallet_bp.route('/api/wallet/balance', methods=['GET'])
@auth_required
def get_balance():
    user_id = request.user.get("id")
    wallet_list = wallets_memory.get("user_id", user_id)
    balance = wallet_list[0]["balance"] if wallet_list else 0
    return jsonify({"user_id": user_id, "balance": balance}), 200

# -------------------------------
# 🔹 Add funds (Top-up)
@wallet_bp.route('/api/wallet/topup', methods=['POST'])
@auth_required
def top_up():
    data = request.get_json()
    amount = data.get("amount")
    user_id = request.user.get("id")

    if not amount or amount <= 0:
        return jsonify({"error": "Amount must be positive"}), 400

    wallet_list = wallets_memory.get("user_id", user_id)
    if wallet_list:
        wallet = wallet_list[0]
        wallet["balance"] += amount
        wallets_memory.update("user_id", user_id, wallet)
    else:
        wallet = {"user_id": user_id, "balance": amount}
        wallets_memory.append(wallet)

    # تسجيل المعاملة
    transaction = {
        "id": len(transactions_memory.all()) + 1,
        "user_id": user_id,
        "type": "topup",
        "amount": amount,
        "timestamp": str(datetime.utcnow())
    }
    transactions_memory.append(transaction)
    log_info(f"User {user_id} topped up {amount}")
    return jsonify(wallet), 200

# -------------------------------
# 🔹 Spend funds
@wallet_bp.route('/api/wallet/spend', methods=['POST'])
@auth_required
def spend_funds():
    data = request.get_json()
    amount = data.get("amount")
    user_id = request.user.get("id")

    wallet_list = wallets_memory.get("user_id", user_id)
    if not wallet_list:
        return jsonify({"error": "Wallet not found"}), 404

    wallet = wallet_list[0]
    if wallet["balance"] < amount:
        return jsonify({"error": "Insufficient balance"}), 400

    wallet["balance"] -= amount
    wallets_memory.update("user_id", user_id, wallet)

    # تسجيل المعاملة
    transaction = {
        "id": len(transactions_memory.all()) + 1,
        "user_id": user_id,
        "type": "spend",
        "amount": amount,
        "timestamp": str(datetime.utcnow())
    }
    transactions_memory.append(transaction)
    log_info(f"User {user_id} spent {amount}")
    return jsonify(wallet), 200

# -------------------------------
# 🔹 List user transactions
@wallet_bp.route('/api/wallet/transactions', methods=['GET'])
@auth_required
def list_transactions():
    user_id = request.user.get("id")
    user_transactions = [t for t in transactions_memory.all() if t["user_id"] == user_id]
    return jsonify(user_transactions), 200
