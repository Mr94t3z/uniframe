import os
import sys
from flask import Flask, render_template

sys.path.insert(1, os.path.abspath(os.path.join(os.getcwd())))

app = Flask(__name__)
app.config["SECRET_KEY"] = '@mr94t3z'
app.debug = True


@app.route("/", methods=["POST", "GET"])
@app.route("/dashboard", methods=["POST", "GET"])
def index():

    return render_template("/index.html")


if __name__ == '__main__':
    app.run(debug=True)