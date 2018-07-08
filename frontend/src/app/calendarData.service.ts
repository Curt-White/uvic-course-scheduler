import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class calDataService{
    private calendarData = new BehaviorSubject<any>(["default"]);
    currentData = this.calendarData.asObservable();

    constructor(){ }

    updateCalendar(data: any){
        this.calendarData.next(data);
    }

}
 