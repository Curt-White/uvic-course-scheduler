#!/usr/bin/env python3
from flask import Flask, render_template, send_file, request
import dbCreate, dbFetchUI, generateSchedules

app = Flask(__name__)

@app.route('/')
def index():
    return ''

@app.route('/getselectitems')
def getSelect():
    return dbFetchUI.fetchSelectList("summer", "2018")

