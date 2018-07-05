#!/usr/bin/env python3
from flask import Flask, render_template, send_file, request
import scraper

app = Flask(__name__)
#Bootstrap(app)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/text')
def returnCourseInfo():
    return send_file('/Users/curtwhite/Desktop/webDev/webSchedule/static/courseinfo.txt')

@app.route('/cal', methods = ["POST"])
def returnCalendar():
    list = request.get_json(force=True)
    m = scraper.main(list)
    print(list)
    return m

if __name__ == "__main__":
    app.static_folder = 'static'
    app.run(debug=True)