from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "https://career-ai-chatbot-20dhfied1-my-project-a7a1.vercel.app"
            ]
        }
    }
)
# Gemini API
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "CareerAI Backend is running!"
    })


@app.route("/api/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        message = data.get("message", "")
        mode = data.get("mode", "Chat")

        if not message:
            return jsonify({
                "success": False,
                "error": "Message cannot be empty."
            }), 400

        prompt = f"""
You are CareerAI, an AI career assistant.

Current Mode: {mode}

Help the user with:
- Python
- Full Stack Development
- AI
- Generative AI
- Interview preparation
- Resume
- Coding
- SQL
- MySQL
- Flask

Give simple, accurate and professional answers.

User:
{message}
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return jsonify({
            "success": True,
            "reply": response.text,
            "mode": mode
        })

    except Exception as error:

        print("ERROR:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


if __name__ == "__main__":

    print("================================")
    print("CareerAI Backend Starting...")
    print("http://127.0.0.1:5000")
    print("================================")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )