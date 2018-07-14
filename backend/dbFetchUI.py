import sqlite3
import json

"""this function is not currently in use"""
def fetchSelectList(term, year):
    dbName = "courseInfo.db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    selectOptions = myCursor.execute("SELECT DISTINCT course_field,course_num, course_name FROM {tableName}".format(tableName = term+year)).fetchall()
    objectList = []
    for field in selectOptions:
        newDict = {}
        newDict['field'] = field[0]
        newDict['num'] = field[1]
        newDict['name'] = field[2]
        objectList.append(newDict)
    return json.JSONEncoder().encode(objectList)

"""gets the search bar content and searches the database for anything similar to it and returns a list of all the possible items to be displayed as suggestions for the search bar"""
def search(term, year, searchCode):
    #temp set to summer2018 for testing eventually will be changed to courseInfo.db
    dbName = "courseInfo.db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    #query database for anything sinilat to the searchCode
    options = myCursor.execute("SELECT DISTINCT course_field, course_num, course_name FROM {tableName} WHERE (course_field || ' ' || course_num) LIKE '%{input}%' OR (course_name LIKE '%{input}%') AND course_time != 'N/A' AND course_time != 'TBA' ".format(tableName = term+year, input = searchCode)).fetchall()
    objectList = []
    #make a dictionary of the items available based on the course
    for field in options:
        newDict = {}
        newDict['field'] = field[0]
        newDict['num'] = field[1]
        newDict['name'] = field[2]
        objectList.append(newDict)
    return json.JSONEncoder().encode(objectList)

"""find all of the course times for each courses lab, lecture and tutorial and then return it as a dictionary"""
def courseInfo(term, year, fos, num):
    dbName = "courseInfo.db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    data = myCursor.execute("SELECT * FROM {tableName} WHERE (course_field = '{course_fos}') AND (course_num = '{course_number}')".format(tableName = term+year, course_fos = fos, course_number = num)).fetchall()
    #dictionary of three lists that will be displayed on the webpage as a radio for implying certain course times
    dataList = {}
    lecture = []
    lab = []
    tutorial = []
    #make a new dictionary for every single course time
    for field in data:
        newDict = {}
        newDict['section'] = field[3]
        newDict['crn'] = field[4]
        newDict['time'] = field[5]
        newDict['days'] = field[6]
        newDict['building'] = field[7]
        newDict['prof'] = field[8]
        #append the new dictionary into one of the three sections
        if(field[9] == "Lecture" or field[9] == "Lecture Topic"):
            lecture.append(newDict)
        elif(field[9] == "Lab" or field[9] == "Gradable"):
            lab.append(newDict)
        elif(field[9] == "Tutorial"):
            tutorial.append(newDict)
    #put all of the lists into a dictionary as this is the best format for angular to work with
    dataList["Lecture"] = lecture
    dataList["Lab"] = lab
    dataList["Tutorial"] = tutorial
    return json.JSONEncoder().encode(dataList)

if __name__ == "__main__":
    search(0,0,searchCode = "seng 275")
