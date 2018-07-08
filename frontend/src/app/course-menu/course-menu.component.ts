import { Component, OnInit, HostListener, Output } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { API_URL } from '../env';
import { FormsModule } from '@angular/forms';
import { course } from '../course.model';
import { calDataService } from '../calendarData.service';

import {observable} from 'rxjs';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-course-menu',
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.scss']
})

export class CourseMenuComponent implements OnInit {

  @Output() updateCal = new EventEmitter<any>();  //emit event so calendar component can update
  
  currentCourses: course[];

  selectedOption;
  lastSelected;
  
  searchOptions;  //all of the elements in the search bar suggestions
  searchActive; //showing or not showing the search nar

  schedules;  //all possible schedules given added courses
  
  addError = false; //for handling errors when adding courses

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
  }

  ngOnInit() {
  }

  update(event:any):void{
    if(this.currentCourses.length == 0){
      return;
    }
    this.http.post(API_URL + "/schedule", JSON.stringify(this.currentCourses)).subscribe(data =>{
      this.service.updateCalendar(data);
    });
    this.updateCal.emit(event);
  }

  updateSearchBar(event:any){
    var temp = event.target;
    while(temp.childNodes.length < 3){
      temp = temp.parentNode;
    }
    temp = temp.childNodes[2].value;
    this.selectedOption = this.searchOptions[temp];
  }

  addCourse(event:any){
    this.lastSelected = this.selectedOption;

    var currentNode = event.target;
    while(currentNode.childNodes.length < 3){
      currentNode = currentNode.parentNode;
    }
    var optionNumber = currentNode.childNodes[2].value;
    this.selectedOption = this.searchOptions[optionNumber];

    if(this.currentCourses.filter(e => e.comp === this.selectedOption).length > 0){
      this.addError = true;
      
    }else{
      var tempColor = "#" + Math.random().toString(16).slice(2, 8);
      var info;
      var temp = new course(this.selectedOption['field'], this.selectedOption['num'], tempColor, this.selectedOption, this.selectedOption['name'], info);
      this.currentCourses.push(temp);
      this.getCourseInfo();
      this.addError = false;
    }
  }

  getCourseInfo(){
    this.http.post(API_URL + "/courseData", JSON.stringify(this.selectedOption)).subscribe(data => {
      this.currentCourses[this.currentCourses.length-1].info = data as JSON;
    });
  }

  getSearchResults(value:string){
    this.http.post(API_URL + "/search", JSON.stringify(value)).subscribe(data => {
      this.searchOptions = data as JSON;
    });
  }

  removeClass(i:number){
    this.currentCourses.splice(i,1);
  }

  print(){
    console.log(this.schedules);
  }
}
