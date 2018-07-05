import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { API_URL } from '../env';
import { FormsModule } from '@angular/forms';
import { course } from '../course.model';

import {observable} from 'rxjs';

@Component({
  selector: 'app-course-menu',
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.scss']
})

export class CourseMenuComponent implements OnInit {
  currentCourses: course[];

  selectedOption;
  lastSelected;
  
  searchOptions;
  searchActive;

  schedules;
  
  addError = false;

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
      if(document.activeElement.id == "courseSel"){
        this.searchActive = true;
      }else{
        this.searchActive = false;
      }
  }

  constructor(private http: HttpClient) { 
    this.currentCourses = [];
    this.searchOptions = [];
    this.searchActive = false;
    this.schedules = [];
  }

  ngOnInit() {
  }

  update(){
    var courseList = this.http.post(API_URL + "/schedule", JSON.stringify(this.currentCourses)).subscribe(data =>{
      this.schedules = data as JSON;
    });
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
      console.log(this.currentCourses[this.currentCourses.length-1]);
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

  print(event:number){
    for (var i = 0; i < this.currentCourses.length; i++){
      console.log(this.currentCourses[i]);
    }
  }
}
