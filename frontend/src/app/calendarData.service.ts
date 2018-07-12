import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class calDataService{
    //makes the schedule possibilities recieved in course-menu available in the calendar component for displaying
    private calendarData = new BehaviorSubject<any>(["default"]);
    currentData = this.calendarData.asObservable();
    //list of courses currently available so that calendar component can have access to the colors of each course
    private courseData = new BehaviorSubject<any>(["default"]);
    currentCourseData = this.courseData.asObservable();
    //the index of current schedule being passed back to current course-menu to update the currently displayed sections
    private currentSchedule = new BehaviorSubject<any>(["default"]);
    currentlyDisplayedSchedule = this.currentSchedule.asObservable();

    constructor(){ }

    updateCalendar(data: any){
        this.calendarData.next(data);
    }

    updateCourses(courses: any){
        this.courseData.next(courses);
    }

    setCurrentSchedule(schedule:any){
        this.currentSchedule.next(schedule);
    }

}
 