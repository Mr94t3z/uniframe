from flask import Flask, render_template

app = Flask(__name__)
app.config["SECRET_KEY"] = '@mr94t3z'

@app.route("/", methods=["POST", "GET"])
def index():

    return render_template("/index.html")
