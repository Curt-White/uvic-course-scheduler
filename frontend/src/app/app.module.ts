import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CourseMenuComponent } from './course-menu/course-menu.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { CourseHolderComponent } from './course-holder/course-holder.component';
import { calDataService } from './calendarData.service';
import { TopBarComponent } from './top-bar/top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseMenuComponent,
    CalendarComponent,
    CourseCardComponent,
    CourseHolderComponent,
    TopBarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [calDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
