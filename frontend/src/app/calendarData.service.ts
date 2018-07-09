import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class calDataService{
    private calendarData = new BehaviorSubject<any>(["default"]);
    currentData = this.calendarData.asObservable();

    private courseData = new BehaviorSubject<any>(["default"]);
    currentCourseData = this.courseData.asObservable();

    constructor(){ }

    updateCalendar(data: any){
        this.calendarData.next(data);
    }

    updateCourses(courses: any){
        this.courseData.next(courses);
    }

}
 