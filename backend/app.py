#!/usr/bin/env python3
from flask import Flask, render_template, send_file, request
import dbCreate, dbFetchUI, generateSchedules
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return ''

@app.route('/getselectitems', methods = ["GET"])
def getSelect():
    return dbFetchUI.fetchSelectList("summer", "2018")

@app.route('/schedule', methods = ["POST", "GET"])
def returnSchedule():
    json = request.get_json(force=True)
    schedules = generateSchedules.main(json, "summer", "2018")
    print(schedules)
    return schedules

if __name__ == '__main__':
     app.run(port=5000)