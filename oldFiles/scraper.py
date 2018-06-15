#!/usr/bin/env python3

import calendar
import course
import sys
from bs4 import BeautifulSoup
import json

genId = []
terms = {"summer": 5, "winter": 1 , "fall": 9}

def main(requestedCourses):
    global genId
    genId = []
    courses = []
    for section in requestedCourses:
        courses.append(course.course(["201805", section["fos"], section["num"]]))
    '''course1 = course.course(["201805", "ASTR", "101"])
    course2 = course.course(["201805", "ECON", "180"])
    course3 = course.course(["201805", "CSC", "225"])
    course4 = course.course(["201805", "SENG", "275"])
    course5 = course.course(["201805", "SENG", "310"])
    list = [course1, course2 , course3, course4, course5]'''
    newList = constructList(courses)
    possibility = []
    generateCalendar(newList, possibility)
    
    #print(json.JSONEncoder().encode(genId))
    temp = json.JSONEncoder().encode(toJson())
    #print(temp)
    file = open("./static/tempsend.txt", "w")
    file.write(temp)
    file.close()
    return temp

def toJson():
    allPossibleWeeks = []
    for week in genId:
        oneWeek = []
        for day in week.daysOfTheWeek:
            oneDay = []
            for course in day:
                tempdict = {"st": course.start_time, "et": course.end_time, "info": course.info, "fos": course.fos}
                oneDay.append(tempdict)
            oneWeek.append(oneDay)
        allPossibleWeeks.append(oneWeek)
    return allPossibleWeeks


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

def possible(possibility):
    temp = calendar.calendar()
    for course in possibility:
        if temp.conlfictCheck(course):
            return
        else:
            temp.addCourse(course)
    return temp

def generateCalendar(listOfCourses, possibility):
    if(possibility == None):
        print("none")
        possibility = []
    if len(listOfCourses) == 0:
        possibleCalendar = possible(possibility)
        if possibleCalendar:
            print(possibleCalendar)
            genId.append(possibleCalendar)
            return possibility
    else:
        for course in listOfCourses[0]:
            m = []
            m.extend(possibility)
            m.append(course)
            generateCalendar(listOfCourses[1:], m)
        return 

if __name__ == "__main__":
    main()
