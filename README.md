# courseScheduler
Student Schedule Generator

The Course Scheduler is an application which helps students register for courses. It takes the list of courses the student wishes to have and then generates every possible schedule the student could have where the student can then go through and choose one they like. 

The front-end of this application is built using Angular 6 with typescript and bootstrap to make an asthetically pleasing interface and it uses Python and Flask for the API. The program uses the Beautiful Soup library in Python to create the SQLite database that is used for generating the schedules. 

In order to run the application, first navigate to the backend folder and run "./bootstrap.sh" to intitate the python 
envelope and then navigate to the frontend folder and run "ng serve" to launch the angular application.

The program should be running at http://localhost:4200/
