from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import json
# from bson.json_util import loads

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/guns")

@app.route("/")
def home():
    return  render_template("index.html")

@app.route("/jsonifiedcities")
def jsonifiedcities():
    citylist = []
    cityinfo =  mongo.db.cities.find()
    for city in cityinfo:
        del city["_id"]
        citylist.append(city)
    return jsonify(citylist)

@app.route("/jsonifiedguns")
def jsonifiedguns():
    gunlist = []
    guninfo =  mongo.db.guns.find()
    for gun in guninfo:
        del gun["_id"]
        gunlist.append(gun)
    return jsonify(gunlist)


if __name__ == "__main__":
    app.run(debug=True)
