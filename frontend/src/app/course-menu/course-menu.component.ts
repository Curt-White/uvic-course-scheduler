import { Component, OnInit, HostListener, Output } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { API_URL } from '../env';
import { FormsModule } from '@angular/forms';
import { course } from '../course.model';
import { calDataService } from '../calendarData.service';

import {observable} from 'rxjs';
import { EventEmitter } from '@angular/core';

declare var jquery:any; 
declare var $ :any;


@Component({
  selector: 'app-course-menu',
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.scss']
})

export class CourseMenuComponent implements OnInit {
  
  currentCourses: course[];

  //all of the elements in the search bar suggestions
  selectedOption;
  
  //all search options
  searchOptions;
  //showing or not showing the search bar, set false when anywhere on the screen is clicked  
  searchActive; 

  schedules;  //all possible schedules given added courses
  
  addError = false; //for handling errors when adding courses
  previousRadios;

  currScheduleIndex = 0;

  //close the search bar if the page is clicked anywhere except on the search bar
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
      if(document.activeElement.id == "courseSel"){
        this.searchActive = true;
      }else{
        this.searchActive = false;
      }
  }

  constructor(private http: HttpClient, private service: calDataService) { 
    this.currentCourses = [];
    this.searchOptions = [];
    this.searchActive = false;
    this.schedules = [];
    this.previousRadios = [];
    //update the values in the radio
    this.service.currentlyDisplayedSchedule.subscribe(index => {
      this.currScheduleIndex = index;
      this.updateCourseRadio();
    });
    //update course data from calendar
    this.service.currentCourseData.subscribe(courseData =>{
      if(this.currentCourses.length > 0){
        this.currentCourses = courseData;
      }
    });
  }

  ngOnInit() {
  }

  /*use data from the currently addded course in the calendar element to highlight the courses displayed in the side menu*/
  updateCourseRadio(){
    //on change of schedule we set all the previously coloured items to normal colouring
    for(var m = 0; m < this.previousRadios.length; m++){
      this.previousRadios[m].css("font-weight", "normal").css("color", "black");
    }
    //remove references to previous radios
    this.previousRadios = [];
    if(this.schedules[this.currScheduleIndex] == undefined){
      return;
    }
    //go through all of the courses at that are present in the array, highligh it, and then added it to the previosu radios list
    for(var i = 0; i < this.schedules[this.currScheduleIndex].length; i++){
      for(var j = 0; j < this.schedules[this.currScheduleIndex][i].length; j++){
        var temp = this.schedules[this.currScheduleIndex][i][j];
        var selectedRadio = $("#"+temp['fos'] + temp['num']+temp['section']).parent();
        selectedRadio.css("font-weight", "bold").css("color", "blue");
        this.previousRadios.push(selectedRadio);
      }
    }
  }

  update(event:any):void{
    this.service.updateCourses(this.currentCourses);
    if(this.currentCourses.length == 0){
      this.service.updateCalendar([]);
      return;
    }
    this.http.post(API_URL + "/schedule", JSON.stringify(this.currentCourses)).subscribe(data =>{
      this.service.updateCalendar(data);
      this.schedules = data;
      this.updateCourseRadio();
    });
  }

  /*unused currently */
  updateSearchBar(event:any){
    var temp = event.target;
    while(temp.childNodes.length < 3){
      temp = temp.parentNode;
    }
    temp = temp.childNodes[2].value;
    this.selectedOption = this.searchOptions[temp];
  }

  addCourse(event:any){
    //get course at target mouse location in the search suggestions menu
    var currentNode = event.target;
    //navigate up two levels to the parent of the item clicked on to find the value element
    while(currentNode.childNodes.length < 3){
      currentNode = currentNode.parentNode;
    }
    //get the value of the item clicked on and send to server
    var optionNumber = currentNode.childNodes[2].value;
    this.selectedOption = this.searchOptions[optionNumber];

    //if course already added to schedule set error
    if(this.currentCourses.filter(e => e.comp === this.selectedOption).length > 0){
      this.addError = true;
      
    }else{
      //get random color and make a course object then add to list
      var tempColor = "#" + Math.random().toString(16).slice(2, 8);
      var info;
      var temp = new course(this.selectedOption['field'], this.selectedOption['num'], tempColor, this.selectedOption, this.selectedOption['name'], info);
      this.currentCourses.push(temp);
      //get extra course info to display
      this.getCourseInfo();
      this.addError = false;
    }
  }

  /*get extra information about a particular course such as the course time/place/sections etc. once the course is added to users list */
  getCourseInfo(){
    this.http.post(API_URL + "/courseData", JSON.stringify(this.selectedOption)).subscribe(data => {
      this.currentCourses[this.currentCourses.length-1].info = data as JSON;
    });
  }

  /*calls server for list of courses based on the value of the element passed */
  getSearchResults(value:string){
    if(value.length < 2){
      return;
    }
    this.http.post(API_URL + "/search", JSON.stringify(value)).subscribe(data => {
      this.searchOptions = data as JSON;
    });
  }

  /*remove a given class based on its index in the list of courses displayed on the webpage */
  removeClass(i:number){
    this.currentCourses.splice(i,1);
  }
  print(f:any){
    console.log(f );
  }
}
