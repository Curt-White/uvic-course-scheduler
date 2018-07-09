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
  currentCourses;

  timeSlots:string[];

  recovery;
  
  constructor(private service: calDataService) { 
    this.schedules = [];
    this.currentSchedule = this.schedules[0];
    this.timeSlots = [];
    this.fillhours();
    this.recovery = $("#mainCal").clone();
    console.log($("#mainCal"));
    this.service.currentData.subscribe(calData => {
      console.log("dd");
      this.clear();
      this.schedules = calData;
      this.currentSchedule = this.schedules[0];
      this.updateCalendar();
    });

    this.service.currentCourseData.subscribe(courseData => {
      this.currentCourses = courseData;
      //console.log(courseData);
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

  clear(){
    //$("#schedTable").find("tr:gt(0)").remove();
    //console.log($("#mainCal").find("td:gt(0)"));
    $("#mainCal").find(".courseCard").remove();
    //$("#mainCal").remove();
    console.log(this.recovery);
    //$("#mainCal").append(this.recovery);
    //this.timeSlots = [];
    //this.fillhours();
  }

  //remove the rows that fall under an item with a rowspan greater than one where rows is the height of the item aka the number of rows to be removed 
  removeRows(time, rows, day):void{
    for(var k = 0; k < rows; k++){
      if(String(time).search(/\d+(00)$/) != -1){
        time+=30;
      }else if(String(time).search(/\d+(30)$/) != -1){
        time+=70;
      }
      $("#"+time+""+day).remove();
    }
  }

  getColor(fos,number):string{
    for(var iter = 0; iter < this.currentCourses.length; iter++){
      if(this.currentCourses[iter]['fos'] == fos && this.currentCourses[iter]['num'] == number){
        return this.currentCourses[iter]['color'];
      }
    }
    return "";
  }

  updateCalendar(){
    var rows:number;
    if(this.currentCourses == undefined){
      return;
    }
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < this.currentSchedule[i].length; j++){
        var curr = this.currentSchedule[i][j];
        //get number of half hour incrememnts the item will take up
        rows = Math.ceil((curr['et']-curr['st'])/50);
        var temp = $("#"+curr['st']+""+i);
        var card = $("#baseCard").clone();
        card.attr('class', 'courseCard');
        card.appendTo(temp);
        temp.attr('rowspan', rows);

        this.removeRows(curr['st'], rows-1, i);
        
        var tempColor = this.getColor(curr['fos'], curr['num']);
        card.first().css('background-color', tempColor);
      }
    }
  }
}
