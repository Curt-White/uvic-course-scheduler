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

  //hold all possible schedules, the currently displayed schedule and the list of courses present in each schedule
  schedules:string[][];
  currentSchedule:string[];
  currentCourses:string[];

  //hold half hour incrememnts
  timeSlots:string[];

  //give an id to each table incremented each time the table is updated to prevent colflicts with css id selector
  tableID:number = 0;
  //the position of currently displayed schedule in schedules list
  calIndex:number = 0;

  //hold the copy of an empty table
  recovery;
  
  constructor(private service: calDataService) { 
    this.schedules = [];
    this.currentSchedule = this.schedules[0];
    this.timeSlots = [];
    this.fillhours();

    //subscribe to the data service to update the calendar with new schedules when courses are added and remove 
    this.service.currentData.subscribe(calData => {
      this.schedules = calData;
      //default return to first item in the list and update the calendar for the new schedule
      this.calIndex = 0;
      this.currentSchedule = this.schedules[this.calIndex];
      this.updateCalendar();
    });

    this.service.currentCourseData.subscribe(courseData => {
      this.currentCourses = courseData;
    });
  }

  ngOnInit() {
    
  }

  /*go to the next item in the list and go to the first item if pressed and on the last item */
  nextRight(){
    this.calIndex ++;
    if(this.calIndex == this.schedules.length){
      this.calIndex = 0;
    }
    this.currentSchedule = this.schedules[this.calIndex];
    this.updateCalendar();
  }

  /*move one calendar possibility to the left and go to the last item if left is clicked and are presently on spot the first item*/
  nextLeft(){
    this.calIndex --;
    if(this.calIndex < 0){
      this.calIndex = this.schedules.length-1;
    }
    this.currentSchedule = this.schedules[this.calIndex];
    this.updateCalendar();
  }

  /*fill a list with every half hour incrememnt between 8:30 and 10:30 for filling the calendar time column */
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

  adjustTime(time){
    var temp = time.match(/.{2}$/g);
    time = time.replace(/.{2}$/g, ":" + temp );
    return time;
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

  clearEmptyRows(){

  }

  /* look up the color of the given course in the array of courses and return null if it is not present*/
  getColor(fos,number):string{
    for(var iter = 0; iter < this.currentCourses.length; iter++){
      if(this.currentCourses[iter]['fos'] == fos && this.currentCourses[iter]['num'] == number){
        return this.currentCourses[iter]['color'];
      }
    }
    return null;
  }

  /*remove current table body and replace it with an empty table body */
  refreshTable(){
    //if there is no clone make one
    if(this.recovery == undefined){
      this.recovery = ($("#mainCal").clone());
      $("#mainCal").remove();
    }else if(this.recovery != undefined){
      $("#mainCal"+(this.tableID - 1)).remove(); 
    }

    $("#calTable").append(this.recovery.clone().attr("id", "mainCal"+this.tableID));
    this.tableID++;
  }

  /*choose white if the background is light and black if the background is dark */
  fontColor(hexColor){
    var red = parseInt(hexColor[1] + hexColor[2], 16);
    var green = parseInt(hexColor[3] + hexColor[4], 16);
    var blue = parseInt(hexColor[5] + hexColor[6], 16);
    console.log((red*0.299 + green*0.587 + blue*0.114));
    if ((red*0.299 + green*0.587 + blue*0.114) > 186){
      return "#000000";
    }else{
      return "#ffffff";
    }
  }

  /*build a card with all the data */
  addCourseCard(curr, day){
        //get number of half hour incrememnts the item will take up
        var rows = Math.ceil((curr['et']-curr['st'])/50);
        //select block to append the card to, clone, then append
        var appendBlock = $("#"+curr['st']+""+ day);
        var card = $("#baseCard").clone();
        card.appendTo(appendBlock);
        //assign attributes to card and block
        card.attr('class', 'courseCard');
        card.css('display', 'block');
        card.attr('id', '');
        appendBlock.attr('rowspan', rows);
        //delete excess rows under cards tha span multiple rows
        this.removeRows(curr['st'], rows-1, day);
        //get heigh of parent div to make card full height of div
        var offsetHeight = card.first()[0].parentElement.clientHeight;
        card.html("<strong>" + curr['fos'] + " " + curr['num'] + "</strong></br>" + curr['section']).css('height', offsetHeight - 25);
        //generate a random color for the card
        var tempColor = this.getColor(curr['fos'], curr['num']);
        card.css('background-color', tempColor);
        //decide font color based on the brightness of the background
        var fontColor = this.fontColor(tempColor);
        card.css('color', fontColor);
  }

  /*update the calendar object by removing all the items currently on the table and filling it with new items
  gets called every time an object is deleted or added and when the user chooses to go to the next schedule possibility*/
  updateCalendar(){
    //deals with the intial string value of behvaioral subject
    if(this.recovery == undefined && $("#mainCal").length == 0){
      return;
    }
    //replace the filled table with an empty one
    this.refreshTable();

    //update the calender number count
    $("#calCount").html("<strong>"+(this.calIndex + 1) + " of " + this.schedules.length + "</strong>");

    //return function if it gets called on component inititalization
    if(this.currentCourses == undefined || this.currentCourses.length == 0){
      return;
    }
    //make a new card and append it to the calendar
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < this.currentSchedule[i].length; j++){
        var curr = this.currentSchedule[i][j];
        this.addCourseCard(curr, i);
      }
    }
  }
}
