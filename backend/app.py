#!/usr/bin/env python3
from flask import Flask, render_template, send_file, request
import dbCreate, dbFetchUI, generateSchedules
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return ''

@app.route('/search', methods = ["POST", "GET"])
def getSelect():
    webData = str(request.get_json(force=True))
    return dbFetchUI.search("fall", "2018", webData)

@app.route('/courseData', methods = ["POST", "GET"])
def getCourseInfo():
    webData = request.get_json(force=True)
    return dbFetchUI.courseInfo("fall", "2018", webData['field'], webData['num'])

@app.route('/schedule', methods = ["POST", "GET"])
def returnSchedule():
    webData = request.get_json(force=True)
    print(webData)
    schedules = generateSchedules.main(webData, "fall", "2018")
    return schedules

if __name__ == '__main__':
    app.run(port=5000)