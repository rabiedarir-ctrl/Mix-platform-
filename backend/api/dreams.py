from flask import Blueprint, request, jsonify
from auth import auth_required
from memory import dreams_memory, dream_worlds_memory, users_memory
from modules.ai.dream_ai import analyze_dream
from logger import log_info
import datetime

# ===============================
# 🔹 Blueprint Dreams API
# ===============================
dreams_bp = Blueprint('dreams', __name__)

# -------------------------------
# 🔹 Record a new dream
@dreams_bp.route('/api/dreams', methods=['POST'])
@auth_required
def create_dream():
    data = request.get_json()
    user_id = request.user.get("id")
    dream_text = data.get("content")

    if not dream_text:
        return jsonify({"error": "Dream content is required"}), 400

    dream = {
        "id": len(dreams_memory.all()) + 1,
        "user_id": user_id,
        "content": dream_text,
        "analysis": analyze_dream(dream_text),
        "created_at": str(datetime.datetime.utcnow())
    }
    dreams_memory.append(dream)
    log_info(f"New dream recorded for user {user_id}: {dream['id']}")
    return jsonify(dream), 201

# -------------------------------
# 🔹 List all dreams of the current user
@dreams_bp.route('/api/dreams', methods=['GET'])
@auth_required
def list_dreams():
    user_id = request.user.get("id")
    user_dreams = [d for d in dreams_memory.all() if d["user_id"] == user_id]
    return jsonify(user_dreams), 200

# -------------------------------
# 🔹 Generate or update Dream World
@dreams_bp.route('/api/dreams/world', methods=['POST'])
@auth_required
def generate_dream_world():
    user_id = request.user.get("id")
    user_dreams = [d for d in dreams_memory.all() if d["user_id"] == user_id]

    if not user_dreams:
        return jsonify({"error": "No dreams found for user"}), 404

    # إنشاء أو تحديث عالم الأحلام
    world_list = dream_worlds_memory.get("user_id", user_id)
    dream_state = {"dreams_count": len(user_dreams), "latest_dream": user_dreams[-1]["content"]}

    if world_list:
        world = world_list[0]
        world["dream_state"] = dream_state
        dream_worlds_memory.update("user_id", user_id, world)
    else:
        world = {
            "id": len(dream_worlds_memory.all()) + 1,
            "user_id": user_id,
            "name": f"Dream World {user_id}",
            "players": [user_id],
            "objects": [],
            "dream_state": dream_state
        }
        dream_worlds_memory.append(world)

    log_info(f"Dream world updated for user {user_id}")
    return jsonify(world), 200
