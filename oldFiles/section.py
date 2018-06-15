import re
class section:
    def __init__(self,info):
        extractedInfo = self.extractTime(info[1])
        fosInfo = self.fosExtract(info[0])
        self.start_time = extractedInfo[1]
        self.end_time = extractedInfo[2]
        self.days = extractedInfo[0]
        self.type = extractedInfo[3]
        self.info = info[0]
        self.fos = fosInfo[0]
        self.infoExtended = info[1]
    
    def fosExtract(self, info):
        infotemp = re.search(r'(\w{2,4}) \d{3}(\w)?', info)
        return infotemp
        
    def extractTime(self, information):
        timeOfDay = information[1]
        timeOfDay = re.search(r'(^((\d{2}|\d)\:\d{2}) ([ap]m)) - ((\d{2}|\d)\:\d{2} ([ap]m))', timeOfDay)
        start_time = timeOfDay.group(2)
        end_time = timeOfDay.group(5)
        start_time = int(re.sub(r'[^0-9]', '', start_time))
        end_time = int(re.sub(r'[^0-9]', '', end_time))
        if(timeOfDay.group(4) == "pm" and start_time < 1200):
            start_time += 1200
        if(timeOfDay.group(7) == "pm" and end_time < 1200):
            end_time += 1200
        days = list(information[2])
        type = information[5]
        return[days, start_time, end_time, type]
