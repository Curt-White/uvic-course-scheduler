
init();
var courseAdded = false;
var mainCourses = [];
var colours = [];

function init(){
let fosDropdown = $(".fosDropdown");
fosDropdown.empty();
fosDropdown.append('<option selected="true" disabled>Field of Study</option>');
fosDropdown.prop('selectedIndex', 0);

let numDropdown = $(".numDropdown");
numDropdown.empty();
numDropdown.append('<option selected="true" disabled>Course Number</option>');
numDropdown.prop('selectedIndex', 0);
}

$("document").ready(function(){
    $(window).on("load", function(){
        $.getJSON("/text", function(data){
            $.each(data, function(key, entry){
                $($('<option>')).val(entry.name).html(entry.name).appendTo($(".fosDropdown"));
            });
            $("#courseDiv").on('change',function(event){
                if(event.target.className == "fosDropdown"){
                    var st = event.target.id;
                    var currval = $("#"+st).val();
                    st = st.replace(/[^\d]/g, '');
                    $("#inputcoursenum"+st).empty();
                    var array;
                    $.each(data, function(key, entry){
                        if(entry.name == currval){
                            array = entry.nums;
                            for(var i = 0; i < array.length; i++){
                                $($('<option>')).val(array[i]).html(array[i]).appendTo($("#inputcoursenum"+st));
                            }
                        }
                    });
                }
            });
        });
    });
});

function initializeCourse(string){
    var cssHSL = "hsl(" + 360 * Math.random() + ',' +(25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%)';
    $("#course"+string).css("background-color", cssHSL).show();
}

function addHandler(objNum){
    
    $("#courseRemove"+objNum).show();
    $("#courseCancel"+objNum).hide();
    $("#courseAdd"+objNum).hide();
    $("#inputfos"+objNum).attr("disabled", "disabled");
    $("#inputcoursenum"+objNum).attr("disabled", "disabled");

    var obj = {fos: $("#inputfos"+objNum).val(), num: $("#inputcoursenum"+objNum).val(), colour:$("#course"+objNum).css("color")};
    //colours.push($("#course"+objNum).css("color"));
    mainCourses.push(obj);
}

$(document).ready(function(){
    var coursesadded = 1;
    var numofcourses = 0;
        $("#addCourse").click(function(){
            if(numofcourses <10 && courseAdded == false){
                var name = "course"+coursesadded;
                var inputfosname = "inputfos"+coursesadded;
                var clone = $("#course").clone();
                clone.attr("id", name ).attr("class", "Course").appendTo("#courseDiv");
                clone.find(".fosDropdown").attr("id", "inputfos"+coursesadded);
                clone.find(".numDropdown").attr("id", "inputcoursenum"+coursesadded);
                clone.find(".courseAddButton").attr("id", "courseAdd"+coursesadded);
                clone.find(".courseCancelButton").attr("id", "courseCancel"+coursesadded);
                clone.find(".courseRemoveButton").attr("id", "courseRemove"+coursesadded);
                initializeCourse(coursesadded);
                coursesadded ++;
                numofcourses++;
                courseAdded = true;
            }
        });

        $("#courseDiv").on("click", ".courseCancelButton", function(){
            var st = this.id.replace(/[^\d]/g, '');
            $("#course"+st).remove();
            numofcourses--;
        });

        $("#courseDiv").on("click", ".courseRemoveButton", function(){
            console.log(mainCourses);
            var st = event.target.id.replace(/[^\d]/g, '');
            var tempfos = $("#inputfos"+st).val();
            var tempnum = $("#inputcoursenum"+st).val();
            //console.log(mainCourses[1]);
            for(var i = 0; i < mainCourses.length; i++){
                console.log("list" + mainCourses.length);
                if(mainCourses[i].fos == tempfos && mainCourses[i].num == tempnum){
                    console.log(mainCourses[i]);
                    if(i == 1){
                        mainCourses.shift();
                    }
                    mainCourses.splice(i);
                    console.log("list" + mainCourses.length)
                }
                console.log(mainCourses[0]);
            }
            console.log(mainCourses);
            $("#course"+st).remove();
            numofcourses--;
            getNewInfo();
            
        });

        $("#courseDiv").on("click", ".courseAddButton", function(){
            var st = event.target.id.replace(/[^\d]/g, '');
            var currfos = $("#inputfos"+ st);
            var currnum = $("#inputcoursenum"+st);
            courseAdded = false;

            if(currfos.val() != null && currnum.val() != null){
                addHandler(st);
            }
        });
});