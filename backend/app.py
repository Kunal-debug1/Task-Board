from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend requests

tasks = []
task_id_counter = 1


@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)


@app.route("/tasks", methods=["POST"])
def add_task():
    global task_id_counter

    data = request.get_json() or {}
    title = data.get("title")


    if not title:
        return jsonify({"error": "Title is required"}), 400

    task = {
        "id": task_id_counter,
        "title": title,
        "completed": False
    }

    tasks.append(task)
    task_id_counter += 1

    return jsonify(task), 201


@app.route("/tasks/<int:task_id>", methods=["PUT"])
def toggle_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            return jsonify(task)

    return jsonify({"error": "Task not found"}), 404


@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"message": "Task deleted"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
