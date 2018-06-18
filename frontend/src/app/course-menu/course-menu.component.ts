import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../env';

@Component({
  selector: 'app-course-menu',
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.scss']
})
export class CourseMenuComponent implements OnInit {
  options;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getOptions();
  }

  getOptions() {
    this.http.get(API_URL + "/getselectitems").subscribe(data => {
      this.options = data as JSON;
      console.log(this.options);
    });
  }
}
