import { Component, OnInit, Input } from '@angular/core';
import { CourseMenuComponent } from '../course-menu/course-menu.component';
import { calDataService } from '../calendarData.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() calUpdateEvent:any;


  schedules;
  

  halfHours:string[];
  
  constructor(private service: calDataService) { }

  ngOnChanges() {
    this.service.currentData.subscribe(calData => {
      this.schedules = calData;
    });
    console.log(this.schedules);
  }

  ngOnInit() {
  }

  updateCalendar(){
    
  }
}
