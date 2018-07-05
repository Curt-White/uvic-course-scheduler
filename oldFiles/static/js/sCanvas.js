var day = 0;
var course = 0;
var index = 0;
var weeks;

$("document").ready(function(){
    $(window).on("load", function(){
        appendTime();
    });
    
    $("#courseDiv").on("click", function(event){
        if(event.target.className == "courseAddButton"){
            getNewInfo();
        }
    });

    $("#schedButtons").on("click", function(event){
        if(event.target.id == "nextButton"){
            index++;
            if(index > weeks.length-1){
                index = 0;
            }
            update();
        }
    });
    
    $("#schedButtons").on("click", function(event){
            if(event.target.id == "lastButton"){
                index--;
                if(index < 0){
                    index = weeks.length-1;
                }
                update();
        }
    });
});

function getNewInfo(){
    console.log(JSON.stringify(mainCourses), mainCourses.length);
    $.post("/cal", JSON.stringify(mainCourses), function(data){
        index = 0; 
        weeks = data;
        update();
    }, "json");
}

function update(){
    $("#schedTable").find("tr:gt(0)").remove();
    appendTime();
    week = weeks[index];
    for(var day = 0; day < week.length; day++){
        thisday = week[day];
        createDay(thisday);
    }
}

function createDay(day){
    for(var i =0; i<day.length; i++){
        for(var j = i+1; j<day.length; j++ ){
            if(day[i].st > day[j].st){
                temp = day[i]
                day[i] = day[j];
                day[j] = temp;
            }
        }
    }
    
    var currhour = 830;
    var coursecount = 0;
    var m = 0;
    while(currhour < 2300){
        if(coursecount < day.length && day[coursecount].st == currhour){
            currhour = addToSchedule(day[coursecount].st, day[coursecount].et, day[coursecount].info);
            coursecount ++;
        }else{
            $($('<td>')).appendTo($("#time"+currhour)).attr("class", "schedBlank");
            if(String(currhour).search(/\d+(30)$/) != -1){
                currhour+=70;
            }else if(String(currhour).search(/\d+(50)$/) != -1){
                currhour+=50;
            }else{
                currhour+=30;
            }
        }
    }
}

function addToSchedule(startTime, endTime, info){
    var rows = Math.ceil((endTime-startTime)/50);
    var clone = $('#calendarobj').clone();
    var temp = $('<td>');
    temp.attr("class", "tableCourse");
    temp.appendTo($('#time'+startTime));
    clone.appendTo(temp).show();
    clone.text(info);
    temp.attr('rowspan', rows);
    if(String(endTime).search(/\d+(20)$/) != -1){
        endTime+=10;
    }else if(String(endTime).search(/\d+(50)$/) != -1){
        endTime+=50;
    }
    return endTime
}

function appendTime(){
    var halfhour = 3;
    var hour = 8;
    while(hour < 23){
        $($('<tr>')).attr("id", "time"+hour+""+halfhour+"0").attr("class", "timerow").appendTo($("#schedTable"));
        $($('<td>')).html(hour + ":" + halfhour + "0").attr("class", "timeColumn").appendTo($("#time"+hour+""+halfhour+"0"));
        if(halfhour == 3){
            halfhour = 0;
            hour++;
        }else{
            halfhour = 3;
        }
    }
    $($('<td>')).appendTo("#time"+8+""+3);
}

