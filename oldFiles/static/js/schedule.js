var courseAdded = false; //set to false when addCourse clicked and then True when courseAddButton clicked
var mainCourses = [];   //holds course obj for added courses



$("document").ready(function(){
    $(window).on("load",function(){
        intializeDropdown();
        fillDropdown();
    });
});

function fillDropdown(){
    //fill the Field of study select menu with options
    $.getJSON("/text", function(data){
        $.each(data, function(key, entry){
            $($('<option>')).val(entry.name).html(entry.name).appendTo($("#FosIn"));
        });
    });
    $('#addCourseDiv').on('change', function(event){
        if(event.target.id == "FosIn"){
            var targetId = event.target.id;
            var currentValue = $('#'+targetId).val();
            
        }
    });
}

//initialize the drop down menues in the course selection menu
function intializeDropdown(){
    //field of study selection 
    let fosDropdown = $("#FosIn");
    fosDropdown.empty();
    fosDropdown.append('<option selected="true" disabled>Field of Study</option>');
    fosDropdown.prop('selectedIndex', 0);

    //course number selector
    let numDropdown = $("#NumIn");
    numDropdown.empty();
    numDropdown.append('<option selected="true" disabled>Course Number</option>');
    numDropdown.prop('selectedIndex', 0);   
}

function addCourse(){

}
    