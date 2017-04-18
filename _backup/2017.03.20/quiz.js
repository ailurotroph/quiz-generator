//logs that the script has loaded
console.log('Script Loaded');

//sets up starting variables
	var questionContainer = document.getElementById('questionContainer');
	//the last question on the page
	var $lastQuestion;
	//master object array
	var masterArray = [];
	//returns which question a button was just clicked in
	var whichQuestionClicked = "q1";
	var whichQuestionClickedInArray = 0;

//sets up the question template object
//create using var newQuestion = QuestionTemplate(argument1, argument2, argument3)
function QuestionTemplate(qDomRef, qNumber, qTitle, qType, qOptions) {
	this.qDomRef = qDomRef;
	this.qNumber = qNumber;
	this.qTitle = qTitle;
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

function updateWhichQuestionVars(e) {
	whichQuestionClicked = $(e.target).parentsUntil('.qBlockWrapper').last()[0].parentNode.id;
	whichQuestionClickedInArray = Number(whichQuestionClicked.slice(1)) - 1;
}

//event delegator for element clicked in 'qBlockWrapper' div
function questionButtonsClick(e) {
	//stop default behavior and bubbling propagation
	e.preventDefault();
	e.stopPropagation();
	//updates the variables which keeps track of which question the button was clicked in
	updateWhichQuestionVars(e);
	//trigger switch based on last classname of clicked element
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
		//shows or hides the question type selection menu
		case 'btnQTypeMenu':
			if ($(e.target).is('a')) {
				$(e.target.parentNode.parentNode).next().toggle();
			} else {
				$(e.target.parentNode.parentNode.parentNode).next().toggle();
			}
			break;
		//delegation for clicking a question type selection menu option
		case 'possibleQType':
			//sets a variable for the dom reference of the div that displays the question type
			var qTypeDisplayTextNode = e.target.parentNode.parentNode.children[0].children[0].children[0];
			//function to change the displayed word in the qType Menu and hide the sub menu
			function changeQTypeMenuWork(changeTo) {
				console.log(`Convert question to ${changeTo}`);
				//updates the qType in the master array
				masterArray[whichQuestionClickedInArray].qType = changeTo;
				//sets the innerHTML of that qType text node to replace everything before the '<' character with the new qType
				qTypeDisplayTextNode.innerHTML = qTypeDisplayTextNode.innerHTML.replace(/(?:(?!<).)*/, changeTo);
				toggleQTypeSubMenu();
			}
			//function to toggle the current question submenu
			function toggleQTypeSubMenu () {
				$(masterArray[whichQuestionClickedInArray].qDomRef).find('.qBlockTypePossible').toggle();
			}
			//identifies which qType button was clicked based on its text content
			switch (e.target.textContent) {
				case 'Multiple Choice':
					//if the question type of the clicked current question is not already the same, then change it
					if (masterArray[whichQuestionClickedInArray].qType !== "Multiple Choice") {
						changeQTypeMenuWork("Multiple Choice");
					//otherwise, just hide the submenu
					} else {
						toggleQTypeSubMenu();
					}
					break;
				case 'Short Answer':
					if (masterArray[whichQuestionClickedInArray].qType !== "Short Answer") {
						changeQTypeMenuWork("Short Answer");
					} else {
						toggleQTypeSubMenu();
					}
					break;
				case 'Checkboxes':
					if (masterArray[whichQuestionClickedInArray].qType !== "Checkboxes") {
						changeQTypeMenuWork("Checkboxes");
					} else {
						toggleQTypeSubMenu();
					}
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

function questionButtonsBlur(e) {
	//updates the variables which keeps track of which question the button was clicked in
	updateWhichQuestionVars(e);
	console.log(e.target);
	console.log(`in ${$(e.target).parentsUntil('.qBlockWrapper').last()[0].parentNode.id} has lost focus`);
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
		//gives the top-level div of each question a unique ID in the form of 'q#' and updates question number
		$lastQuestion[0].id = `q${masterArray.length + 1}`;
		$($lastQuestion[0]).find(".qBlockNumber span").text(masterArray.length + 1 + '.');
		//make the last question visible
		$lastQuestion[0].style.display = "";
		//event lister delegator for all <i> and <a> elements
		$lastQuestion.on('click', "i, a", function(e){
			questionButtonsClick(e);
		});
		//event listener delegator for all input elements in a question when they unfocus
		$lastQuestion.on('blur', "input", function(e){
			//event delegator for unfocus events, so if someone clicks away from a text field it updates that text fields property in the master object
			questionButtonsBlur(e);
		});

		//grabs the question options and puts them into an array
		var questionOptions = $lastQuestion.find(".possibleAnswers .multipleChoiceAnswer");
		//creates new question object with empty properties
		//domref, qNum, qTitle, qType, qOptions
		var newQObj = new QuestionTemplate($lastQuestion[0], `q${masterArray.length}`, "title", "Multiple Choice", questionOptions);
		//pushes newly created object into the master array
		masterArray.push(newQObj);
	});
}

//functions for gathering question inputs to update the master array
function gatherTitle(e) {
	console.log("this is" + this);
	return $(this).find(".qBlockTitle input");
}
function gatherType() {
	
}
function gatherOptions() {

}

//deletes question
function deleteQuestion(e) {
	console.log('question delete button clicked');
	//if theres more then one question
	if (questionContainer.children.length > 1) {
		//establishes which question to delete by grabbing the id of the question wrapper div
		var delWhichQuestion = Number(e.target.parentNode.parentNode.parentNode.parentNode.id.charAt(1)) - 1;
		//removes that wrapper div from its parent
		questionContainer.removeChild(questionContainer.children[delWhichQuestion]);
		//removes that entry from the master array
		masterArray.splice(delWhichQuestion, 1);
		//updates the last question variable
		$lastQuestion = $('.qBlockWrapper:last')
		//updates all question div IDs and their numbers
		for(var i = 0, length1 = masterArray.length; i < length1; i++){
			masterArray[i].qDomRef.id = `q${i+1}`;
			$(masterArray[i].qDomRef).find(".qBlockNumber span").text(`${i + 1}.`);
		}
	//if theres only one question, just change the question title to say you need at least one question
	} else {
		$("#q1 .qBlockTitle :input").attr("placeholder", "You need at least one question!");
	}
}

//adds a possible answer to a question
function addQuestionOption(e) {
	//updates the variables which keeps track of which question the button was clicked in
	updateWhichQuestionVars(e);
	var qDomRef = masterArray[whichQuestionClickedInArray].qDomRef;
	var qType = masterArray[whichQuestionClickedInArray].qType;
	switch (qType) {
		case "mc":
			console.log("insert a mutliple choice option for question" + (whichQuestionClickedInArray + 1));
			break;
		case "sa":
			console.log("insert a short answer option for question" + (whichQuestionClickedInArray + 1));
			break;
		case "checkboxes":
			console.log("insert a checkbox choice option for question" + (whichQuestionClickedInArray + 1));
			break;
		default:
			// statements_def
			break;
	}
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


