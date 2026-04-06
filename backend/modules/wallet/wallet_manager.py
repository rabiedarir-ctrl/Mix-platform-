from datetime import datetime
from memory import wallets_memory
from logger import log_info

# ===============================
# 🔹 Wallet Manager
# ===============================

class WalletManager:
    def __init__(self):
        self.memory = wallets_memory

    # -------------------------------
    # 🔹 إنشاء محفظة جديدة للمستخدم
    def create_wallet(self, user_id):
        existing = self.memory.get("user_id", user_id)
        if existing:
            return existing[0]  # المحفظة موجودة مسبقًا

        wallet_id = len(self.memory.all()) + 1
        wallet = {
            "id": wallet_id,
            "user_id": user_id,
            "balance": 0.0,
            "transactions": [],
            "created_at": str(datetime.utcnow()),
            "updated_at": None
        }
        self.memory.append(wallet)
        log_info(f"Wallet created: ID {wallet_id} for user {user_id}")
        return wallet

    # -------------------------------
    # 🔹 جلب رصيد المحفظة
    def get_balance(self, user_id):
        wallet_list = self.memory.get("user_id", user_id)
        if not wallet_list:
            return 0.0
        return wallet_list[0]["balance"]

    # -------------------------------
    # 🔹 تحديث الرصيد وإضافة معاملة
    def update_balance(self, user_id, amount, description=""):
        wallet_list = self.memory.get("user_id", user_id)
        if not wallet_list:
            raise ValueError("Wallet not found")

        wallet = wallet_list[0]
        wallet["balance"] += amount

        transaction_id = len(wallet["transactions"]) + 1
        transaction = {
            "id": transaction_id,
            "amount": amount,
            "description": description,
            "date": str(datetime.utcnow())
        }
        wallet["transactions"].append(transaction)
        wallet["updated_at"] = str(datetime.utcnow())
        self.memory.update("user_id", user_id, wallet)
        log_info(f"Wallet updated: ID {wallet['id']} for user {user_id}, Amount: {amount}")
        return wallet
