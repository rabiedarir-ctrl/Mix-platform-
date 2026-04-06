from flask import Blueprint, request, jsonify
from auth import auth_required
from memory import social_memory, messages_memory, users_memory
from logger import log_info

# ===============================
# 🔹 Blueprint Social API
# ===============================
social_bp = Blueprint('social', __name__)

# -------------------------------
# 🔹 Create a new post
@social_bp.route('/api/social/posts', methods=['POST'])
@auth_required
def create_post():
    data = request.get_json()
    user_id = request.user.get("id")
    content = data.get("content")

    if not content:
        return jsonify({"error": "Content is required"}), 400

    post = {
        "id": len(social_memory.all()) + 1,
        "user_id": user_id,
        "content": content,
        "comments": [],
        "created_at": str(datetime.datetime.utcnow())
    }
    social_memory.append(post)
    log_info(f"Post created by user {user_id}: {post['id']}")
    return jsonify(post), 201

# -------------------------------
# 🔹 List all posts
@social_bp.route('/api/social/posts', methods=['GET'])
def list_posts():
    posts = social_memory.all()
    return jsonify(posts), 200

# -------------------------------
# 🔹 Add comment to a post
@social_bp.route('/api/social/posts/<int:post_id>/comments', methods=['POST'])
@auth_required
def add_comment(post_id):
    data = request.get_json()
    user_id = request.user.get("id")
    comment_text = data.get("comment")

    post_list = social_memory.get("id", post_id)
    if not post_list:
        return jsonify({"error": "Post not found"}), 404

    post = post_list[0]
    comment = {
        "id": len(post["comments"]) + 1,
        "user_id": user_id,
        "comment": comment_text,
        "created_at": str(datetime.datetime.utcnow())
    }
    post["comments"].append(comment)
    social_memory.update("id", post_id, post)
    log_info(f"Comment added by user {user_id} to post {post_id}")
    return jsonify(comment), 201

# -------------------------------
# 🔹 Send a direct message
@social_bp.route('/api/social/messages', methods=['POST'])
@auth_required
def send_message():
    data = request.get_json()
    sender_id = request.user.get("id")
    receiver_id = data.get("receiver_id")
    content = data.get("content")

    if not receiver_id or not content:
        return jsonify({"error": "Receiver ID and content are required"}), 400

    message = {
        "id": len(messages_memory.all()) + 1,
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "content": content,
        "created_at": str(datetime.datetime.utcnow())
    }
    messages_memory.append(message)
    log_info(f"Message sent from {sender_id} to {receiver_id}: {message['id']}")
    return jsonify(message), 201

# -------------------------------
# 🔹 List messages for current user
@social_bp.route('/api/social/messages', methods=['GET'])
@auth_required
def list_messages():
    user_id = request.user.get("id")
    all_messages = messages_memory.all()
    user_messages = [m for m in all_messages if m["sender_id"] == user_id or m["receiver_id"] == user_id]
    return jsonify(user_messages), 200
