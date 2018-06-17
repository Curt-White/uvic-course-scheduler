#!/usr/bin/env python3
from flask import Flask, render_template, send_file, request
import dbCreate, dbFetchUI, generateSchedules
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return ''

@app.route('/getselectitems')
def getSelect():
    return dbFetchUI.fetchSelectList("summer", "2018")

