#!/usr/bin/env python3
import section
import re
from bs4 import BeautifulSoup
import urllib.request

class course:

    classType = {"Lecture": 0, "Lab": 1, "Tutorial": 2}

    def __init__(self, courseInfo):
        listOfSections = self.getClassInfo(courseInfo)
        self.lectures = listOfSections[0]
        self.labs = listOfSections[1]
        self.tutorials = listOfSections[2]

    def getClassInfo(self, classInfo):
        sections = []
        baseurl = "https://www.uvic.ca/BAN1P/bwckctlg.p_disp_listcrse?term_in="+classInfo[0]+"&subj_in="+classInfo[1]+"&crse_in="+classInfo[2]+"&schd_in="
        with urllib.request.urlopen(baseurl) as url:
            webpage = url.read()
        html_data = BeautifulSoup(webpage,"html.parser")
        title = [section.getText() for section in html_data.find_all("th", {"class": "ddtitle"})]
        datadisplaytables = [table.find_all("td", {"class": "dddefault"}) for table in html_data.find_all("table", {"summary": "This table lists the scheduled meeting times and assigned instructors for this class.."})]
        for section in datadisplaytables:
            sections.append([info.getText() for info in section])
        info = [(title[i],sections[i]) for i in range(0,len(title))]
        return self.createClassSection(info)

    def createClassSection(self, classInfo):
        sections = [[],[],[]]
        for classSection in classInfo:
            currsection = section.section(classSection)
            sections[self.classType[currsection.type]].append(currsection)
        return sections