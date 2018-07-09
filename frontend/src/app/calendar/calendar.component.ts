import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { CourseMenuComponent } from '../course-menu/course-menu.component';
import { calDataService } from '../calendarData.service';

declare var jquery:any; 
declare var $ :any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  schedules;
  calIndex:number = 0;
  currentSchedule;

  timeSlots:string[];
  
  constructor(private service: calDataService) { 
    this.schedules = [];
    this.currentSchedule = this.schedules[0];
    this.timeSlots = [];
    this.fillhours();
    
    this.service.currentData.subscribe(calData => {
      this.schedules = calData;
      this.currentSchedule = this.schedules[0];
      this.updateCalendar();
      console.log(this.schedules);
    });
  }

  ngOnInit() {
  }

  fillhours(){
    var halfhour = 3;
    var hour = 8;
    while(hour < 23){
      this.timeSlots.push(hour+""+halfhour+"0");
        if(halfhour == 3){
            halfhour = 0;
            hour++;
        }else{
            halfhour = 3;
        }
    }
  }

  removeRows(time, rows, day){
    for(var k = 0; k < rows; k++){
      if(String(time).search(/\d+(00)$/) != -1){
        time+=30;
      }else if(String(time).search(/\d+(30)$/) != -1){
        time+=70;
      }
      $("#"+time+""+day).remove();
      //console.log("#"+time+""+day);
    }
  }

  updateCalendar(){
    var rows:number;
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < this.currentSchedule[i].length; j++){
        var curr = this.currentSchedule[i][j];
        //console.log("#"+curr['st']+""+i);
        rows = Math.ceil((curr['et']-curr['st'])/50);
        var temp = $("#"+curr['st']+""+i);
        temp.attr('rowspan', rows);
        //console.log(curr['et'] + " " + curr['st'] + " " + rows);
        this.removeRows(curr['st'], rows-1, i);
        $().appendTo($("#"+curr['st']+""+i));
        temp.attr('class', 'courseCard');
      }
    }
  }
}
