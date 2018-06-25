import { Component, OnInit } from '@angular/core';
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
  options;

  schedules;
  
  addError = false;

  constructor(private http: HttpClient) { 
    this.currentCourses = [];
  }

  ngOnInit() {
    this.getOptions();
  }

  update(){
    var courseList = this.http.post(API_URL + "/schedule", JSON.stringify(this.currentCourses)).subscribe(data =>{
      console.log(courseList);
    });
    console.log(courseList);
  }

  addCourse(){
    this.lastSelected = this.selectedOption.split("!");
    this.lastSelected = this.lastSelected[0] + " " + this.lastSelected[1];

    if(this.currentCourses.filter(e => e.comp === this.selectedOption).length > 0){
      this.addError = true;
      
    }else{

      var tempString = this.selectedOption.split("!");
      var tempColor = "#" + Math.random().toString(16).slice(2, 8);
      var temp = new course(tempString[0], tempString[1], tempColor, this.selectedOption, tempString[2]);
      this.currentCourses.push(temp);
      this.addError = false;
    }
  }

  removeClass(i:number){
    this.currentCourses.splice(i,1);
  }

  getOptions() {
    this.http.get(API_URL + "/getselectitems").subscribe(data => {
      this.options = data as JSON;
    });
  }

  printOpt(){
    //console.log(this.currentCourses);
  }
}
