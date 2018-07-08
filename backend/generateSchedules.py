import json
import re
import sqlite3

schedules = []

class course:
    """An object that holds all the sections for each individual courses added"""
    def __init__(self, courseName, courseNum, term, year):
        self.lectures = self.dbRetrieve(courseName, courseNum, term, year, "Lecture")
        self.labs = self.dbRetrieve(courseName, courseNum, term, year, "Lab")
        self.tutorials = self.dbRetrieve(courseName, courseNum, term, year, "Tutorial")

    """retrieve course data from the database and create lists of sections"""
    def dbRetrieve(self, courseName, courseNum, term, year, courseType):
        dbName = "summer2018.db"
        conn = sqlite3.connect(dbName)
        myCursor = conn.cursor()
        selectList = myCursor.execute("SELECT * FROM '{tableName}' WHERE course_field = '{c_field}' AND course_num = '{c_num}' And section_type = '{c_type}'".format(tableName = "courses", c_field = courseName, c_num = courseNum, c_type = courseType)).fetchall()
        return(self.createSection(selectList))
    
    def createSection(self, selectedCourses):
        sections = []
        for item in selectedCourses:
            sections.append(section(item))
        return sections
       
class section:
    """A section stores the course section in a way that is easier to compare"""
    def __init__(self, courseInfo):
        temp = self.extractTime(courseInfo)
        self.courseInfo = courseInfo
        self.start = temp[1]
        self.end = temp[2]
        self.days = temp[0]

    """transform the time into 24 hour time without colon and seperate day string into list"""
    def extractTime(self, courseInfo):
        oldTime = courseInfo[5]
        oldTime = timeOfDay = re.search(r'(^((\d{2}|\d)\:\d{2}) ([ap]m)) - ((\d{2}|\d)\:\d{2} ([ap]m))', oldTime)
        if oldTime == None:
            return "N/A"
        start = oldTime.group(2)
        end = oldTime.group(5)
        start = int(re.sub(r'[^0-9]', '', start))
        end = int(re.sub(r'[^0-9]', '', end))
        #add 12 hours if the course is in the PM to make 24 hour time
        if(oldTime.group(4) == "pm" and start < 1200):
            start += 1200
        if(oldTime.group(7) == "pm" and end < 1200):
            end += 1200
        #split day string into list
        days = list(courseInfo[6])
        return[days, start, end]

class calendar:
    """calendar object checks all conflicts of a possible schedule"""
    dayValues = {'M': 0,'T': 1, 'W': 2, 'R': 3, 'F': 4, 'S': 5}

    def __init__(self):
        self.daysOfWeek = [[],[],[],[],[],[]]
        self.numOfCourses = 0

    def addCourse(self, course):
        self.numOfCourses += 1
        for day in course.days:
            self.daysOfWeek[self.dayValues[day]].append(course)

    """checks if the current course called newsection will conflict with anything else in the current calendar
    return true if the course conflicts and false otherwise"""
    def checkConflict(self, newSection):
        if self.numOfCourses == 0:
            return False
        B1 = newSection.start
        B2 = newSection.end
        for day in newSection.days:
            for course in self.daysOfWeek[self.dayValues[day]]:
                A1 = course.start
                A2 = course.end
                #check if the boundaries conflict with the selected course
                if((B1 >= A1 and B1 <= A2) or (B2 >= A1 and B2 <= A2) or (A1 >= B1 and A1 <= B2) or (A2 >= B1 and A2 <= B2)):
                    return True
        return False

"""append all of the courses sections to the same list"""
def constructList(list):
    newList = []
    for course in list:
        if len(course.lectures) > 0:
            newList.append(course.lectures)
        if len(course.labs) > 0:
            newList.append(course.labs)
        if len(course.tutorials) > 0:
            newList.append(course.tutorials)
    return newList

"""returns the calendar if the calendar is possible else returns None"""
def possible(possibility):
    newCalendar = calendar()
    for course in possibility:
        if newCalendar.checkConflict(course):
            return
        else:
            newCalendar.addCourse(course)
    return newCalendar

"""generates all possibe calendars and if they are valid it will append it to the global schedules list"""
def generateCalendar(listOfCourses, possibility):
    if(possibility == None):
        possibility = []
    #reaching this point means that we have reached the highest point and we can check if the schedule is valid
    if len(listOfCourses) == 0:
        possibleCalendar = possible(possibility)
        if possibleCalendar:
            schedules.append(possibleCalendar)
            return possibility
    else:
        #splice the list for the next row of possibilities and recursively call for each course
        for course in listOfCourses[0]:
            currentPossiblity = []
            currentPossiblity.extend(possibility)
            currentPossiblity.append(course)
            generateCalendar(listOfCourses[1:], currentPossiblity)
        return

def toJson():
    print(schedules)
    allPossibleWeeks = []
    for week in schedules:
        oneWeek = []
        for day in week.daysOfWeek:
            oneDay = []
            for course in day:
                tempdict = {"st": course.start, "et": course.end, "section": course.courseInfo[3], "fos": course.courseInfo[0], "num": course.courseInfo[1]}
                oneDay.append(tempdict)
            oneWeek.append(oneDay)
        allPossibleWeeks.append(oneWeek)
    return allPossibleWeeks

def main(requestedCourses, term, year):
    global schedules
    schedules = []
    courses = []
    for section in requestedCourses:
        courses.append(course(section['fos'], section['num'], term , year))
    allCourses = constructList(courses)
    possibility = []
    #print(schedules,"really Befor")
    generateCalendar(allCourses, possibility)
    #print(schedules,"before")
    schedules = json.JSONEncoder().encode(toJson())
    #print(schedules,"after")
    return schedules

if __name__ == "__main__":
    main([{"fos" : "SENG", "num" : "265"}, {"fos" : "ECON", "num" : "180"}], "summer", "2018")