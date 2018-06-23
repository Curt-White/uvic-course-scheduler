import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { CourseMenuComponent } from './course-menu/course-menu.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { CourseHolderComponent } from './course-holder/course-holder.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftMenuComponent,
    CourseMenuComponent,
    CalendarComponent,
    CourseCardComponent,
    CourseHolderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
