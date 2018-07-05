import sqlite3
import json

def fetchSelectList(term, year):
    dbName = "summer2018.db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    selectOptions = myCursor.execute("SELECT DISTINCT course_field,course_num, course_name FROM {tableName}".format(tableName = "courses")).fetchall()
    objectList = []
    for field in selectOptions:
        newDict = {}
        newDict['field'] = field[0]
        newDict['num'] = field[1]
        newDict['name'] = field[2]
        objectList.append(newDict)
    return json.JSONEncoder().encode(objectList)

def search(term, year, searchCode):
    dbName = "summer2018.db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    options = myCursor.execute("SELECT DISTINCT course_field, course_num, course_name FROM {tableName} WHERE (course_field || ' ' || course_num) LIKE '%{input}%' OR (course_name LIKE '%{input}%')".format(tableName = "courses", input = searchCode)).fetchall()
    #options = myCursor.execute("SELECT DISTINCT course_field, course_num, course_name FROM {tableName} WHERE (course_field LIKE '%{input}%') OR (course_num LIKE '%{input}%') OR (course_name LIKE '%{input}%')".format(tableName = "courses", input = searchCode)).fetchall()
    objectList = []
    for field in options:
        newDict = {}
        newDict['field'] = field[0]
        newDict['num'] = field[1]
        newDict['name'] = field[2]
        objectList.append(newDict)
    return json.JSONEncoder().encode(objectList)

def courseInfo(term, year, fos, num):
    dbName = "summer2018.db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    data = myCursor.execute("SELECT * FROM {tableName} WHERE (course_field = '{course_fos}') AND (course_num = '{course_number}')".format(tableName = "courses", course_fos = fos, course_number = num)).fetchall()
    dataList = {}
    lecture = []
    lab = []
    tutorial = []
    for field in data:
        newDict = {}
        newDict['section'] = field[3]
        newDict['crn'] = field[4]
        newDict['time'] = field[5]
        newDict['days'] = field[6]
        newDict['building'] = field[7]
        newDict['prof'] = field[8]
        if(field[9] == "Lecture" or field[9] == "Lecture Topic"):
            lecture.append(newDict)
        elif(field[9] == "Lab" or field[9] == "Gradable"):
            lab.append(newDict)
        elif(field[9] == "Tutorial"):
            tutorial.append(newDict)
    dataList["Lecture"] = lecture
    dataList["Lab"] = lab
    dataList["Tutorial"] = tutorial
    return json.JSONEncoder().encode(dataList)

if __name__ == "__main__":
    search(0,0,searchCode = "seng 275")
