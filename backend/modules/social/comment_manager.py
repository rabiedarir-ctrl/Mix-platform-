from datetime import datetime
from memory import social_memory
from logger import log_info

# ===============================
# 🔹 Comment Manager
# ===============================

class CommentManager:
    def __init__(self):
        self.memory = social_memory  # تستخدم نفس ذاكرة المنشورات لتعليقات متداخلة

    # -------------------------------
    # 🔹 إضافة تعليق
    def add_comment(self, post_id, user_id, content):
        if not content:
            raise ValueError("Content is required for a comment")

        posts = self.memory.get("id", post_id)
        if not posts:
            raise ValueError("Post not found")

        post = posts[0]
        comment_id = len(post.get("comments", [])) + 1
        comment = {
            "id": comment_id,
            "user_id": user_id,
            "content": content,
            "created_at": str(datetime.utcnow()),
            "updated_at": None
        }

        if "comments" not in post:
            post["comments"] = []

        post["comments"].append(comment)
        self.memory.update("id", post_id, post)
        log_info(f"Comment added: ID {comment_id} on Post {post_id} by user {user_id}")
        return comment

    # -------------------------------
    # 🔹 تعديل تعليق
    def update_comment(self, post_id, comment_id, user_id, content):
        posts = self.memory.get("id", post_id)
        if not posts:
            raise ValueError("Post not found")

        post = posts[0]
        comments = post.get("comments", [])
        comment = next((c for c in comments if c["id"] == comment_id), None)
        if not comment:
            raise ValueError("Comment not found")
        if comment["user_id"] != user_id:
            raise PermissionError("Cannot edit another user's comment")

        comment["content"] = content
        comment["updated_at"] = str(datetime.utcnow())
        self.memory.update("id", post_id, post)
        log_info(f"Comment updated: ID {comment_id} on Post {post_id} by user {user_id}")
        return comment

    # -------------------------------
    # 🔹 حذف تعليق
    def delete_comment(self, post_id, comment_id, user_id):
        posts = self.memory.get("id", post_id)
        if not posts:
            raise ValueError("Post not found")

        post = posts[0]
        comments = post.get("comments", [])
        comment = next((c for c in comments if c["id"] == comment_id), None)
        if not comment:
            raise ValueError("Comment not found")
        if comment["user_id"] != user_id:
            raise PermissionError("Cannot delete another user's comment")

        post["comments"] = [c for c in comments if c["id"] != comment_id]
        self.memory.update("id", post_id, post)
        log_info(f"Comment deleted: ID {comment_id} on Post {post_id} by user {user_id}")
        return True

    # -------------------------------
    # 🔹 جلب جميع التعليقات على منشور
    def get_comments(self, post_id):
        posts = self.memory.get("id", post_id)
        if not posts:
            raise ValueError("Post not found")

        post = posts[0]
        return post.get("comments", [])
