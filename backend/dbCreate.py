#!/usr/bin/env python3
import sys
from bs4 import BeautifulSoup
import urllib.request
import re
import json
import sqlite3

terms = {"summer": "5", "winter": "1" , "fall": "9"}

"""takes a year and a term and retrieves all available courses and filtering out all of the unvailable courses in a given semester"""
def makeCourseList(term, year):
    courseNames = []
    allFosInfo = []
    print(term)
    #go to the url which contains all of the fields of study that is updated for the given semester
    url = "https://web.uvic.ca/calendar"+str(year)+"-0"+terms[term]+"/courses/"
    with urllib.request.urlopen(url) as url:
            webpage = url.read()
    html_data = BeautifulSoup(webpage, "html.parser")
    #use bs4 to find all of the html table elements
    tables = html_data.find_all("table")
    #find all of the fields of study in the two tables
    for t in tables:
        m = [a.getText() for a in t.find_all("a")]
        courseNames.extend(m)
    #create list coursenames ignore 1 letter words to prevent adding A,B,C,D... headers
    courseNames = [x for x in courseNames if len(x) > 1]
    l1 = courseNames[:int(len(courseNames)/2):2];
    #for each fos go to page and find all course numbers in that field
    for fos in l1:
        url = "https://web.uvic.ca/calendar"+str(year)+"-0"+terms[term]+"/CDs/"+fos+"/CTs.html"
        with urllib.request.urlopen(url) as url:
            webpage = url.read()
        #bs4 to clean html to a list of tables
        htmlData = BeautifulSoup(webpage, "html.parser")
        tables = htmlData.find_all("td")
        #each row has two of the same tables remove duplicates
        tables = tables[::2]
        #get the text of the links aka the actual course numbers
        tables = [coursenum.getText() for coursenum in tables]
        #holds the items that need to be removed if not available this semester
        removed=[]
        #check if number is available in selected term
        for num in tables:
            if(not isAvailable(term,year,fos,num)):
                removed.append(num)
        #remove course if not availabe in the current term
        for num in removed:
            tables.remove(num)
        #create a json object and add it to the list
        jsobj = {"name": fos, "nums": tables}
        if(len(tables)>0):
            allFosInfo.append(jsobj)
    return allFosInfo

"""returns true if the course is available in the given term and false if not"""
def isAvailable(term,year,name,num):
    #bs4
    url = "https://www.uvic.ca/BAN1P/bwckctlg.p_disp_listcrse?term_in="+str(year)+"0"+terms[term]+"&subj_in="+name+"&crse_in="+num+"&schd_in="
    with urllib.request.urlopen(url) as url:
        webpage = url.read()
    htmlData = BeautifulSoup(webpage, "html.parser")
    #find all tables that are of class pldefault
    data = htmlData.find_all("td",{"class": "pldefault"})
    #if a given page contains any table with the text "no classes were found..." than return false
    for i in data:
        if(i.text.strip() == "No classes were found that meet your search criteria"):
            return False
    return True

"""take the information scraped from the webpage and prep an entry for the databas"""
def prepEntry(string1, infoList = None):
    tempDict = {}
    m = re.search(r"[A-Z]\d\d", string1, re.IGNORECASE)
    tempDict['section'] = m.group(0)
    m = re.search(r"^.+ - [0-9]", string1, re.IGNORECASE)
    if(m == None):
        print(string1, infoList)
    tempDict['course_name'] = m.group(0)[:-4]
    m = re.search(r" [0-9]{5} ", string1, re.IGNORECASE)
    tempDict['crn'] = m.group(0)
    #if there is no table for some course without specific times and places such as thesis course we ignore this part
    if(infoList != None):
        tempDict['time'] = infoList[1]
        tempDict['days'] = infoList[2]
        tempDict['building'] = infoList[3]
        tempDict['professor'] = infoList[6]
        tempDict['section_type'] = infoList[5]
    return tempDict
    
"""takes a list of courses and calls other functions to produce entries which this function then enters into the database"""
def FillDataBase(fosList, term, year):
    dbName = term+str(year)+".db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    #cycle through every entry in the given file and insert every course into the database
    for entry in fosList:
        for course in entry["nums"]:
            info = getClassInfo(entry["name"],course,term,year)
            for section in info:
                #for thesis and research courses
                if(len(info[0]) == 3):
                    myCursor.execute("INSERT INTO courses VALUES(?,?,?,?,?,?,?,?,?,?)",(entry["name"],str(course),section['course_name'],section['section'], section['crn'], "N\A", "N\A", "N\A", "N\A", "N\A"))
                else:
                    myCursor.execute("INSERT INTO courses VALUES(?,?,?,?,?,?,?,?,?,?)",(entry["name"],str(course), section['course_name'],section['section'], section['crn'], section['time'], section['days'], section['building'], section['professor'], section['section_type']))
                conn.commit()

"""get all of the information from each page of every course and return alist of dictionaries where each dictionary has 1 course section on it aka A01, A02 would each be a list item"""
def getClassInfo(fos,num,term,year):
    sections = []
    currTerm = str(year)+"0"+terms[term]
    baseurl = "https://www.uvic.ca/BAN1P/bwckctlg.p_disp_listcrse?term_in="+currTerm+"&subj_in="+fos+"&crse_in="+str(num)+"&schd_in="
    with urllib.request.urlopen(baseurl) as url:
        webpage = url.read()
    html_data = BeautifulSoup(webpage,"html.parser")
    #find header for each course on the page, every course will have this
    title = [section.getText() for section in html_data.find_all("th", {"class": "ddtitle"})]
    #find the tables for each class which contains time and other specific data, not all courses will have this
    datadisplaytables = [table.find_all("td", {"class": "dddefault"}) for table in html_data.find_all("table", {"summary": "This table lists the scheduled meeting times and assigned instructors for this class.."})]
    for section in datadisplaytables:
        sections.append([info.getText() for info in section])
    info = []
    for i in range(0,len(title)):
        if len(sections) == 0:
            sec = prepEntry(title[i])
        elif(len(sections) != len(title)):
            sec = prepEntry(title[i], sections[0])
        else:
            print(title, sections)
            sec = prepEntry(title[i], sections[i])
        info.append(sec)
    return info

"""create a new table in the courseInfo database for the specific term given"""
def constructTable(myCursor, term, year):
    myCursor.execute("""CREATE TABLE {tname} (
        course_field text,
        course_num text,
        course_name text,
        section text,
        crn text,
        time text,
        days text,
        building text,
        professor text,
        section_type text
    )""".format(tname = term+str(year)))

def main(term, year):
    dbName = "courseInfo.db"
    conn = sqlite3.connect(dbName)
    myCursor = conn.cursor()
    constructTable(myCursor, term, year)
    conn.commit()
    conn.close()
    
    listOfCourses = makeCourseList(term, year)
    FillDataBase(listOfCourses, term, year)

if __name__ == "__main__":
    main("winter",2018)