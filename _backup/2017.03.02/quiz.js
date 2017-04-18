//logs that the script has loaded
console.log('Script Loaded');

//sets up starting variables
	var questionContainer = document.getElementById('questionContainer');
	//array of all questions on the page
	var questionArray = [];
	//the last question on the page
	var $lastQuestion;
	//the current number of questions there are
	var qNum = 1;
	//array of the add question buttons
	var $btnAddQuestion = [];
	//array of the delete question buttons
	var $btnDelQuestion;

//loads one default question
$questionContainer = $('#questionContainer');
insertNewQuestion();

//inserts a new question into the page
function insertNewQuestion() {
	//creates div for new question
	var newDiv = document.createElement('div');
	newDiv.setAttribute('class', 'qBlockWrapper');
	newDiv.style.display = "none";
	//insert new div into the dom, in #questionContainer, before the last child div (generate quiz button)
	questionContainer.append(newDiv);
	//establies newDiv as the last div with the 'qBlockWrapper' class and converts it into a
	//jquery object so as to use the .load jquery method
	newDiv = $('.qBlockWrapper:last')
	newDiv.load('qTemplate.html', function(){
		//updates the last question variable and master question array
		$lastQuestion = $('.qBlockWrapper:last')
		console.log('last question:');
		console.log($lastQuestion);
		questionArray.push($lastQuestion[0]);
		console.log('all questions:');
		console.log(questionArray);
		//gives the top-level div of each question a unique ID in the form of 'q#' and updates question number
		$lastQuestion[0].id = `q${questionArray.length}`;
		$($lastQuestion[0]).find(".qBlockNumber span").text(questionArray.length + '.');
		//make the last question visible
		$lastQuestion[0].style.display = "";
		//add event listeners to question buttons
		$lastQuestion.on('click', '.btnAddQuestion', insertNewQuestion);
		$lastQuestion.on('click', '.btnDeleteQuestion', function(e){
			deleteQuestion(e);
		});
	});
}

function deleteQuestion(e) {
	//delWhichQuestion is the second character of the parent qBlockWrapper div event target (would be an <i> element)
	var delWhichQuestion = Number(e.target.parentNode.parentNode.parentNode.id.charAt(1)) - 1;
	console.log('delete button pressed for question:');
	console.log(delWhichQuestion + 1);
	//removes the relevant child from the dom and then the master question array
	questionContainer.removeChild(questionContainer.children[delWhichQuestion]);
	questionArray.splice(delWhichQuestion, 1);
	//update last question
	$lastQuestion = $('.qBlockWrapper:last')
	//for each question in the question array, set the id of that question to q[index in array] and update number
	for(var i = 0, length1 = questionArray.length; i < length1; i++){
		questionArray[i].id = `q${i+1}`;
		$(questionArray[i]).find(".qBlockNumber span").text(`${i + 1}.`);
	}

}