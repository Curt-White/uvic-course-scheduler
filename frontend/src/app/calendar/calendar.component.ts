import { Component, OnInit } from '@angular/core';
import { CourseMenuComponent } from '../course-menu/course-menu.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  halfHours = new Array(26);

  constructor() { }

  ngOnInit() {
  }

  updateCalendar(){
    
  }

}
