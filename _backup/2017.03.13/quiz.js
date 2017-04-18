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

//sets up the question template object
//create using var newQuestion = QuestionTemplate(argument1, argument2, argument3)
function QuestionTemplate(qDomRef, qType, qOptions) {
	this.qDomRef = qDomRef;
	this.qType = qType;
	this.qOptions = qOptions;
}

//question option strings (add one of these before the last child of .possibleAnswers in the triggered question)
var qOptionCheckbox = 
`<div class="multipleChoiceAnswer">
<div class="mcqDelete"><a href="#" title="Delete this option"><i class="fa fa-close btnQODelete"></i></a></div>
<div class="mcqCheck"><a href="#"><i class="fa fa-square-o btnQOCheck"></i></a></div>
<div class="mcqAnswer"><input type="text" name="" placeholder="Type one of the answers here, check the correct answer" /></div>
</div>`;
var qOptionRadio = ``;
var qOptionShortAnswer = ``;

//loads one default question
$questionContainer = $('#questionContainer');
insertNewQuestion();

//event delegator for element clicked in 'qBlockWrapper' div
function questionButtons(e, whichQ) {
	console.log(`Add an option for question: ${whichQ}`);
	//stop bubbling to prevent further triggering of event handlers
	e.stopPropagation();
	//trigger switch based on last classname of clicked element
	// console.log(e.target.className.split(' ').pop());
	switch (e.target.className.split(' ').pop()) {
		case 'btnQODelete': //delete question option
			console.log('Delete this question answer option');
			break;
		case 'btnQOAdd': //add new question option
			addQuestionOption(e);
			break;
		case 'btnQOCheck': //mark question option as selected
			console.log(e.target.className.split(' '));
			if (e.target.className.split(' ')[1] == 'fa-square-o') {
				e.target.className = e.target.className.replace('fa-square-o', 'fa-check-square');
			} else {
				e.target.className = e.target.className.replace('fa-check-square', 'fa-square-o');
			}
			break;
		case 'btnQDelete': //delete this question
			deleteQuestion(e);
			break;
		case 'btnQAdd': //add a new question
			console.log('Add a new question');
			insertNewQuestion();
			break;
		case 'btnQTypeMenu': //show dropdown question type menu
			if ($(e.target).is('a')) {
				$(e.target.parentNode.parentNode).next().toggle();
			} else {
				$(e.target.parentNode.parentNode.parentNode).next().toggle();
			}
			break;
		case 'possibleQType':
			switch (e.target.textContent) {
				case 'Multiple Choice':
					console.log('convert question to MC');
					break;
				case 'Short Answer':
					console.log('convert question to SA');
					break;
				case 'Checkboxes':
					console.log('convert question to Checkboxes');
					break;
				default:
					// statements_def
					break;
			}
			break;
		case 'btnQUp':
			console.log('Move this question up');
			break;
		case 'btnQDown':
			console.log('Move this question down');
			break;
		default:
			break;
	}
}

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
		//event lister delegator for all <i> and <a> elements
		$lastQuestion.on('click', "i, a", function(e){
			//whichQ will store which question the event listener is attached to so that selectors are easy to use for the question buttonevent delegator
			var whichQ = $lastQuestion[0].id;
			questionButtons(e, whichQ);
		});
	});
}

//deletes question
function deleteQuestion(e) {
	console.log('question delete button clicked');
	//delWhichQuestion is the second character of the parent qBlockWrapper div event target (would be an <i> element)
	if (questionContainer.children.length > 1) {
		var delWhichQuestion = Number(e.target.parentNode.parentNode.parentNode.parentNode.id.charAt(1)) - 1;
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
	} else {
		$("#q1 .qBlockTitle :input").attr("placeholder", "You need at least one question!");
	}
}

//adds a possible answer to a question
function addQuestionOption(e) {
	console.log(e.target.parentNode.parentNode);
}

//switches between question types (multiple choice, short answer, checkboxes)
function convertQuestion(e, qtype) {
	switch (qtype) {
		case label_1:
			// statements_1
			break;
		default:
			// statements_def
			break;
	}
}

/*
Steps for effective event delegation and consistent, accurate tracking of master questionArray
	-Need array to be in the following object format instead of just dom references
		[
			0 : {
				domRef : DOMreference to .questionWrapper div (<div class"qBlockWrapper" id="q1">...</div>)
				qType : QuestionType (multiple choice, short answer, checkboxes)
				qOptions : ["question option 1", "question option 2", "question option 3"]
			},
			1 : {next question object}
		]
	-Inserting and deleting questions in the dom is reflected in this master array
	-Changing question types changes the qtype value in that question object
	-To test implementation, first create a parallel array and have insertion/deletion events act across both the existing questionArray and this new objectArray
	-Look up templated object creation in that javascript book
	-This is to ease implementation of changing question types dynamically while retaining entered information and for adding the correct template string 
	 when adding question options
	-This will also help final quiz generation
*/


