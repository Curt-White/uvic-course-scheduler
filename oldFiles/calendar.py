import section

class calendar:

    dayValues = {'M': 0,'T': 1, 'W': 2, 'R': 3, 'F': 4, 'S': 5}

    def __init__(self):
        self.daysOfTheWeek = [[],[],[],[],[],[]]
        self.numofcourses = 0;

    def addCourse(self,course):
        self.numofcourses +=1;
        for day in course.days:
            self.daysOfTheWeek[self.dayValues[day]].append(course)
            
    def conlfictCheck(self,newSection):
        if self.numofcourses == 0:
            return False
        ss = newSection.start_time
        se = newSection.end_time
        for day in newSection.days:
            for course in self.daysOfTheWeek[self.dayValues[day]]:
                cs = course.start_time
                ce = course.end_time
                if((ss >= cs and ss <= ce) or (se >= cs and se <= ce) or (cs >= ss and cs <= se) or (ce >= ss and ce <= se)):
                    return True
        return False

    def printCalendar(self):
        for day in self.daysOfTheWeek:
            for course in day:
                print(course.info)