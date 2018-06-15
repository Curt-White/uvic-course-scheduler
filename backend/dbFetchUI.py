import sqlite3

def fetchSelectList(term, year):
    dbName = "summer2018.db"
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
    print(objectList)
    return objectList

if __name__ == "__main__":
    fetchSelectList("courses", "")
