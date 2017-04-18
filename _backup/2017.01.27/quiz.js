//entire script runs only whent he document is ready
$(document).ready(function() {
//logs that the script has loaded
console.log('quiz.js has successfully loaded');
//creates empty variable that will store array of all questions on the page
var $questionArray;
var lastQuestion;
//loads one question into the page by default
$("#questionsBlock").load("qTemplate.html", function(){
	console.log('html loaded');
	$questionArray = $('.qBlockWrapper');
	parseLastQuestion();
});

function parseLastQuestion(){
	lastQuestion = $questionArray[$questionArray.length - 1];
};


//each qBlockWrapper div is assigned an ID
$questionArray.each(function(index){
	this.id = `q${index + 1}`;
	console.log(this.children);
	console.log(this.id);
});

//event handler for dropdown menus
$('.qBlockTypeCurrent').click(function(e){
	target = e.target;
	console.log('clicked!')
});



});

