import json

class SceneBuilder:
    def __init__(self):
        # قائمة الكائنات الحالية في المشهد
        self.objects = []

    # -------------------------------
    # 🔹 تحميل مشهد من بيانات JSON
    def load_scene(self, scene_json):
        if isinstance(scene_json, str):
            scene_data = json.loads(scene_json)
        else:
            scene_data = scene_json

        self.objects = []

        # إضافة كل كائن في المشهد
        for obj in scene_data.get("objects", []):
            self.add_object(obj)

        return self.objects

    # -------------------------------
    # 🔹 إضافة كائن جديد للمشهد
    def add_object(self, obj_data):
        # obj_data يحتوي على: id, name, position, size, color
        obj = {
            "id": obj_data.get("id"),
            "name": obj_data.get("name"),
            "position": obj_data.get("position", {"x":0,"y":0,"z":0}),
            "size": obj_data.get("size", 1),
            "color": obj_data.get("color", 0xffffff)
        }
        self.objects.append(obj)
        return obj

    # -------------------------------
    # 🔹 تصدير المشهد كـ JSON
    def to_json(self):
        return json.dumps({
            "objects": self.objects
        }, ensure_ascii=False, indent=2)


# -------------------------------
# 🔹 مثال للاختبار
if __name__ == "__main__":
    builder = SceneBuilder()
    test_scene = {
        "objects": [
            {"id":"1","name":"شجرة","position":{"x":0,"y":0,"z":0},"size":3,"color":0x00ff00},
            {"id":"2","name":"بيت","position":{"x":10,"y":0,"z":5},"size":5,"color":0xff0000}
        ]
    }
    builder.load_scene(test_scene)
    print(builder.to_json())
