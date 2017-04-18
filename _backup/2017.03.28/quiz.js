/*
 ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗         ███████╗███████╗████████╗██╗   ██╗██████╗ 
██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║         ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
██║  ███╗██║     ██║   ██║██████╔╝███████║██║         ███████╗█████╗     ██║   ██║   ██║██████╔╝
██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║         ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ 
╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗    ███████║███████╗   ██║   ╚██████╔╝██║     
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝    ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
*/

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
`<div class="mcqDelete"><a href="#" title="Delete this option"><i class="fa fa-close btnQODelete"></i></a></div>
<div class="mcqCheck"><a href="#"><i class="fa fa-square-o btnQOCheck"></i></a></div>
<div class="mcqAnswer"><input type="text" name="" placeholder="Type one of the answers here, check the correct answer" /></div>`;
var qOptionMultipleChoice = 
`<div class="mcqDelete"><a href="#" title="Delete this option"><i class="fa fa-close btnQODelete"></i></a></div>
<div class="mcqCheck"><a href="#"><i class="fa fa-circle-o btnQORadio"></i></a></div>
<div class="mcqAnswer"><input type="text" name="" placeholder="Type one of the answers here, check the correct answer" /></div>`;
var qOptionShortAnswer = ``;

//loads one default question
$questionContainer = $('#questionContainer');
insertNewQuestion();

//function to update the variables that contain the information of which question the button was clicked in and which question it was in the master array
function updateWhichQuestionVars(e) {
	//sets the which question clicked var by finding parents until one parent has the .qBlockWrapper class and sets the ID
	whichQuestionClicked = $(e.target).parentsUntil('.qBlockWrapper').last()[0].parentNode.id;
	whichQuestionClickedInArray = Number(whichQuestionClicked.slice(1)) - 1;
}

/*
██████╗ ███████╗██╗     ███████╗ ██████╗  █████╗ ████████╗ ██████╗ ██████╗ 
██╔══██╗██╔════╝██║     ██╔════╝██╔════╝ ██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
██║  ██║█████╗  ██║     █████╗  ██║  ███╗███████║   ██║   ██║   ██║██████╔╝
██║  ██║██╔══╝  ██║     ██╔══╝  ██║   ██║██╔══██║   ██║   ██║   ██║██╔══██╗
██████╔╝███████╗███████╗███████╗╚██████╔╝██║  ██║   ██║   ╚██████╔╝██║  ██║
╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
*/

//event delegator for all buttons that you can click in a question including blur events from unfocues input fields
function questionButtonsClick(e) {
	//stop default behavior and bubbling propagation to prevent triggering further handlers, and to prevent a="#" scroll-to-top behavior
	e.preventDefault();
	e.stopPropagation();
	//updates the variables which keeps track of which question the button was clicked in
	updateWhichQuestionVars(e);
	//trigger switch based on last classname of clicked element
	switch (e.target.className.split(' ').pop()) {
		case 'btnQODelete': //delete question option
			deleteQuestionOption(e);
			break;
		case 'btnQOAdd': //add new question option
			addQuestionOption(e);
			break;
		case 'btnQOCheck': //mark question option as selected
			// if the question type is checkboxes then
			if (masterArray[whichQuestionClickedInArray].qType == "Checkboxes") {
				// if the checkbox is unchecked
				if (e.target.className.split(' ')[1] == 'fa-square-o') {
					//check it
					e.target.className = e.target.className.replace('fa-square-o', 'fa-check-square');
				// otherwise, the checkbox must be checked so
				} else {
					//uncheck it
					e.target.className = e.target.className.replace('fa-check-square', 'fa-square-o');
				}
			// otherwise the qType must be multiple choice so
			} else {
				//if an empty circle is clicked
				if (e.target.className.split(' ')[1] == 'fa-circle-o') {
					//for every option in the question, uncheck the circles
					for(var i = 0, length1 = qOptions.length; i < length1; i++){
						qOptions[i].getElementsByTagName('i')[0].className = qOptions[i].getElementsByTagName('i')[0].className.replace('fa-dot-circle-o', 'fa-circle-o');
					}
					//then check the circle that was clicked
					e.target.className = e.target.className.replace('fa-circle-o', 'fa-dot-circle-o');
				}
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
			//sets up destructured variables for easy access within the current question object
			let {qDomRef, qType, qOptions} = masterArray[whichQuestionClickedInArray];
			//qType new is what the question type will be changing to
			var qTypeNew = e.target.textContent;
			//dom reference for question type dropdown menu button
			var qTypeDisplayTextNode = e.target.parentNode.parentNode.children[0].children[0].children[0];
			//text content of which option was clicked in the question type submenu: e.g. "Multiple Choice", "Short Answer", "Checkboxes"
			var clickedOptionTextContent = e.target.textContent;
			//function to change the displayed word in the qType Menu and hide the sub menu
			function changeQTypeMenuWork(changeTo) {
				//updates the qType in the master array
				qType = changeTo;
				//sets the innerHTML of that qType text node to replace everything before the '<' character with the new qType
				qTypeDisplayTextNode.innerHTML = qTypeDisplayTextNode.innerHTML.replace(/(?:(?!<).)*/, changeTo);
				toggleQTypeSubMenu();
			}
			//function to toggle visibility of the submenu
			function toggleQTypeSubMenu () {
				$(qDomRef).find('.qBlockTypePossible').toggle();
			}
			//if the clicked question type is different than what the question type already is
			if (qType !== clickedOptionTextContent) {
				//update the master array qType for that question
				masterArray[whichQuestionClickedInArray].qType = clickedOptionTextContent;
				//run the convert question function, passing in all parameters of that question object
				convertQuestion(e, qType, qTypeNew, qDomRef, qOptions);
				//change what the dropdown menu displays
				changeQTypeMenuWork(clickedOptionTextContent);
			//otherwise, just hide the submenu because theres no change to the question type
			} else {
				toggleQTypeSubMenu();
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

/*
 █████╗ ██████╗ ██████╗        ██╗       ██████╗ ███████╗██╗     ███████╗████████╗███████╗
██╔══██╗██╔══██╗██╔══██╗       ██║       ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
███████║██║  ██║██║  ██║    ████████╗    ██║  ██║█████╗  ██║     █████╗     ██║   █████╗  
██╔══██║██║  ██║██║  ██║    ██╔═██╔═╝    ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝  
██║  ██║██████╔╝██████╔╝    ██████║      ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚═════╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
                                                                                          
 ██████╗ ██╗   ██╗███████╗███████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗                 
██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝                 
██║   ██║██║   ██║█████╗  ███████╗   ██║   ██║██║   ██║██╔██╗ ██║███████╗                 
██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║                 
╚██████╔╝╚██████╔╝███████╗███████║   ██║   ██║╚██████╔╝██║ ╚████║███████║                 
 ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝                 
*/

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
		var newQObj = new QuestionTemplate($lastQuestion[0], `q${masterArray.length}`, "title", "Checkboxes", questionOptions);
		//pushes newly created object into the master array
		masterArray.push(newQObj);
	});
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

/*
 █████╗ ██████╗ ██████╗        ██╗       ██████╗ ███████╗██╗     ███████╗████████╗███████╗
██╔══██╗██╔══██╗██╔══██╗       ██║       ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
███████║██║  ██║██║  ██║    ████████╗    ██║  ██║█████╗  ██║     █████╗     ██║   █████╗  
██╔══██║██║  ██║██║  ██║    ██╔═██╔═╝    ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝  
██║  ██║██████╔╝██████╔╝    ██████║      ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚═════╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
                                                                                          
 ██████╗ ██████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗                                  
██╔═══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝                                  
██║   ██║██████╔╝   ██║   ██║██║   ██║██╔██╗ ██║███████╗                                  
██║   ██║██╔═══╝    ██║   ██║██║   ██║██║╚██╗██║╚════██║                                  
╚██████╔╝██║        ██║   ██║╚██████╔╝██║ ╚████║███████║                                  
 ╚═════╝ ╚═╝        ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝                                  
*/

//adds a possible answer to a question
function addQuestionOption(e) {
	updateWhichQuestionVars(e);
	//sets up destructured variables for easy access within the current question object
	let {qDomRef, qType, qOptions} = masterArray[whichQuestionClickedInArray];
	//switch to activate the correct option to add
	switch (qType) {
		case "Multiple Choice":
			addMcOption();
			break;
		case "Short Answer":
			addSaOption();
			break;
		case "Checkboxes":
			addCheckboxesOption();
			break;
		default:
			// statements_def
			break;
	}
	//functions to add options
	function addMcOption() {
		console.log(`Add a ${qType} option.`)
	}
	function addSaOption() {
		console.log(`Add a ${qType} option.`)
	}
	function addCheckboxesOption() {
		console.log(`Add a ${qType} option.`)
		var newOption = document.createElement('div');
		newOption.className = "multipleChoiceAnswer"
		newOption.innerHTML = qOptionCheckbox;
		qOptions.push(newOption);
		$(newOption).insertBefore($(qDomRef).find('.multipleChoiceAddAnswer'));
	}
}

//deletes a specific question option
function deleteQuestionOption(e) {
	let {qDomRef, qType, qOptions} = masterArray[whichQuestionClickedInArray];
	updateWhichQuestionVars(e);
	//creates a variable for the individual question option div
	var removeOptionDomRef = e.target.parentNode.parentNode.parentNode;
	//variable showing that options position in the options array for that question by counting previous siblings
	var whichOptionToRemove = $(removeOptionDomRef).prevAll().length;
	//dom reference to the overall option container div
	var optionContainer = removeOptionDomRef.parentNode;
	if (qOptions.length > 1) { //if theres more than one option
		console.log('remove this option from the question and from the master array');
		qOptions.splice(whichOptionToRemove, 1);
		optionContainer.removeChild(optionContainer.children[whichOptionToRemove]);
	} else { //otherwise, do nothing
		console.log('there has to be at least one option');
	}
}

/*
 ██████╗ ██████╗ ███╗   ██╗██╗   ██╗███████╗██████╗ ████████╗     ██████╗ ██╗   ██╗███████╗███████╗████████╗██╗ ██████╗ ███╗   ██╗
██╔════╝██╔═══██╗████╗  ██║██║   ██║██╔════╝██╔══██╗╚══██╔══╝    ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
██║     ██║   ██║██╔██╗ ██║██║   ██║█████╗  ██████╔╝   ██║       ██║   ██║██║   ██║█████╗  ███████╗   ██║   ██║██║   ██║██╔██╗ ██║
██║     ██║   ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║       ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   ██║██║   ██║██║╚██╗██║
╚██████╗╚██████╔╝██║ ╚████║ ╚████╔╝ ███████╗██║  ██║   ██║       ╚██████╔╝╚██████╔╝███████╗███████║   ██║   ██║╚██████╔╝██║ ╚████║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝        ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
*/
//switches between question types (multiple choice, short answer, checkboxes)
function convertQuestion(e, qTypeOld, qTypeNew, qDomRef, qOptions) {
	console.log(`Convert question from ${qTypeOld} to ${qTypeNew}`);
	//switch to run different things depending on which type of question type conversion is happening	
	switch (qTypeNew) {
		case "Checkboxes": //converting to checkboxes
			convertToCheckboxes(e, qTypeOld, masterArray[whichQuestionClickedInArray]);
			break;
		case "Multiple Choice":
			convertToMultipleChoice(e, qTypeOld, masterArray[whichQuestionClickedInArray]);
			break;
		case "Short Answer":
			convertToShortAnswer(e, qTypeOld, masterArray[whichQuestionClickedInArray]);
			break;
		default:
			break;
	}
}
function convertToCheckboxes(e, qTypeOld, qObj) {
	if (qTypeOld == "Multiple Choice") {
		var checkboxOptions = $(qObj.qDomRef).find('i.btnQOCheck');
		for(var i = 0, length1 = checkboxOptions.length; i < length1; i++){
			console.log(checkboxOptions[i].className);
			checkboxOptions[i].className = checkboxOptions[i].className.replace('fa-square-o', 'fa-circle-o');
			checkboxOptions[i].className = checkboxOptions[i].className.replace('fa-check-square', 'fa-circle-o');
		}
	} else {
		console.log('insert blank checkbox option');
	}
}
function convertToMultipleChoice(e, qTypeOld, qObj) {
	if (qTypeOld == "Checkboxes") {
		var checkboxOptions = $(qObj.qDomRef).find('i.btnQOCheck');
		for(var i = 0, length1 = checkboxOptions.length; i < length1; i++){
			console.log(checkboxOptions[i].className);
			checkboxOptions[i].className = checkboxOptions[i].className.replace('fa-square-o', 'fa-circle-o');
			checkboxOptions[i].className = checkboxOptions[i].className.replace('fa-check-square', 'fa-circle-o');
		}
	} else {
		console.log('insert blank checkbox option');
	}
}
function convertToShortAnswer(e, qTypeOld, qObj) {
	console.log(qTypeOld);
	console.log(qObj.qType);
}
/*
██████╗ ██╗     ██╗   ██╗██████╗ ██████╗ ██╗███╗   ██╗ ██████╗     ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
██╔══██╗██║     ██║   ██║██╔══██╗██╔══██╗██║████╗  ██║██╔════╝     ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
██████╔╝██║     ██║   ██║██████╔╝██████╔╝██║██╔██╗ ██║██║  ███╗    █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗
██╔══██╗██║     ██║   ██║██╔══██╗██╔══██╗██║██║╚██╗██║██║   ██║    ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║
██████╔╝███████╗╚██████╔╝██║  ██║██║  ██║██║██║ ╚████║╚██████╔╝    ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║
╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
*/
//function that fires when an input field blurs to update the question options array
function questionButtonsBlur(e) {
	updateWhichQuestionVars(e);
	console.log(e.target);
	console.log(`in ${$(e.target).parentsUntil('.qBlockWrapper').last()[0].parentNode.id} has lost focus`);
}

