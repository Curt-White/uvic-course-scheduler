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

  tableID = 0;

  recovery;
  
  constructor(private service: calDataService) { 
    this.schedules = [];
    this.currentSchedule = this.schedules[0];
    this.timeSlots = [];
    this.fillhours();

    this.service.currentData.subscribe(calData => {
      
      this.schedules = calData;
      this.currentSchedule = this.schedules[0];
      this.updateCalendar();
    });

    this.service.currentCourseData.subscribe(courseData => {
      this.currentCourses = courseData;
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

  refreshTable(){
    
    if(this.recovery == undefined){
      this.recovery = ($("#mainCal").clone());
      $("#mainCal").remove();
    }else if(this.recovery != undefined){
      $("#mainCal"+(this.tableID - 1)).remove(); 
    }

    $("#calTable").append(this.recovery.clone().attr("id", "mainCal"+this.tableID).css("overflow", "scroll"));
    this.tableID++;
  }

  addCourseCard(curr, day){
        var rows = Math.ceil((curr['et']-curr['st'])/50);
        var appendBlock = $("#"+curr['st']+""+ day);
        var card = $("#baseCard").clone();
        card.attr('class', 'courseCard');
        card.css('display', 'block');
        card.appendTo(appendBlock);
        card.attr('id', '');
        appendBlock.attr('rowspan', rows);
        var offsetHeight = card.first()[0].parentElement.clientHeight;
        this.removeRows(curr['st'], rows-1, day);
        console.log(card[0].parentElement.clientHeight);

        var tempColor = this.getColor(curr['fos'], curr['num']);
        card.css('background-color', tempColor).css('height', offsetHeight - (offsetHeight)*.25);
        console.log(card[0].parentElement.clientHeight)
  }

  updateCalendar(){
    //deals with the intial string value of behvaioral subject
    if(this.recovery == undefined && $("#mainCal").length == 0){
      return;
    }

    this.refreshTable();

    if(this.currentCourses == undefined || this.currentCourses.length == 0){
      return;
    }
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < this.currentSchedule[i].length; j++){
        var curr = this.currentSchedule[i][j];
        //get number of half hour incrememnts the item will take up
        this.addCourseCard(curr, i);
      }
    }
  }
}
