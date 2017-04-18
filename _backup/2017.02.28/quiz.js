//logs that the script has loaded
console.log('Script Loaded');

//sets up starting variables
	var questionContainer = document.getElementById('pageWrapperDiv');
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
$questionContainer = $('#pageWrapperDiv');
insertNewQuestion();

//inserts a new question into the page
function insertNewQuestion() {
	//creates div for new question
	var newDiv = document.createElement('div');
	newDiv.setAttribute('class', 'qBlockWrapper');
	newDiv.style.display = "none";
	//insert new div into the dom, in #pageWrapperDiv, before the last child div (generate quiz button)
	questionContainer.insertBefore(newDiv, questionContainer.children[questionContainer.children.length - 1]);
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
		//gives all divs with a classname an id with the prefix 'qNum_' then their classname
		$lastQuestion[0].id = `q${qNum}`;
		/*
		//for all html tags in $lastQuestion, do
		$lastQuestion.find('*').each(function(){
			//if the tags are not <i> tags AND they have a class attribute
			if ($(this).prop("tagName") !== "I" && this.hasAttribute("class")) {
				//set their ID to their class name with a 'qNum_' prefix
				this.id = 'q' + qNum + '_' + this.className;
			};
		});
		*/
		//make the last question visible
		$lastQuestion[0].style.display = "";
		//add event listeners to question buttons
		$lastQuestion.on('click', '.btnAddQuestion', insertNewQuestion);
		$lastQuestion.on('click', '.btnDeleteQuestion', function(e){
			deleteQuestion(e);
		});
		//if there is more than one question, remove the add question button from the second-to-last question
		//increment the question counter
		qNum++;
	});
}

function deleteQuestion(e) {
	//delWhichQuestion is the second character of the parent qBlockWrapper div event target (would be an <i> element)
	var delWhichQuestion = Number(e.target.parentNode.parentNode.parentNode.id.charAt(1));
	console.log('delete button pressed for question:');
	console.log(delWhichQuestion);
	//removes the relevant child from the questionContainer div
	questionContainer.removeChild(delWhichQuestion);
	//update last question and master question array
	$lastQuestion = $('.qBlockWrapper:last')
	questionArray.splice(delWhichQuestion, 1);
	for(var i = 0, length1 = questionArray.length; i < length1; i++){
		questionArray[i].id = 'q' + (i+1);
	}

}

/*
function updateIds(qToRemove) {
	//create an array where its all questions after the deleted question of the master array
	var updateDivIds = questionArray.slice(qToRemove + 1);
	//create counter that adds to the ID of the current question
	var qCounter = 1;
	//for each question in this new array, update the IDs
	for(var i = 0, length1 = updateDivIds.length; i < length1; i++){
		$(updateDivIds[i]).find('*').each(function(){
			//if the tags are not <i> tags AND they have a class attribute
			if ($(this).prop("tagName") !== "I" && this.hasAttribute("class")) {
				//set their ID to their class name with a 'qNum_' prefix
				//this.id = 'q' + qNum + '_' + this.className;
				console.log(qToRemove + qCounter);
			};
		});
		qCounter++;
	}

}
*/

	// for(var i = 0, length1 = questionArray.length; i < length1; i++){
	// 	//put each object in the master question array into a jquery object and do for each
	// 	$(questionArray[i]).each(function(){
	// 		//find all html tags recursively within the jquery object
	// 		$(this).find('*').each(function(){
	// 			//if the tags are not <i> tags AND they have a class attribute
	// 			if ($(this).prop("tagName") !== "I" && this.hasAttribute("class")) {
	// 				//set their ID to their class name with a 'qNum_' prefix
	// 				this.id = 'q' + qNum + '_' + this.className;
	// 			}
	// 		});
	// 	});
	// }

/*
Rework IDs so that only the top-level question divs have IDs
When adding a question
	Do Ajax request and insert into dom
	Push the new div into the master question array
	Set the visibility of the addquestion button in previous divs to hidden
When deleting a question
	Remove that div from the dom, update master array using the splice method
*/