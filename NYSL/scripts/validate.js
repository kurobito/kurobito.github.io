// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
	'use strict';
	window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
    	form.addEventListener('submit', function(event) {
    		validate(form.elements);
    		if (form.checkValidity()) {
    			document.getElementById("mail-anim").style.display = "block"; // show anim if form valid
    		}else{
    			event.preventDefault();
    			event.stopPropagation();
    		}
    		form.classList.add('was-validated');
    	}, false);
    });
}, false);
})();

function showAlert(){
	if(!confirm("Are you sure you have entered everything correctly?")){
		return false;
	}
}

function validate(formElements){
	// console.log(formElements.length)
	for (let i = 0; i < formElements.length; i++) {
		switch(formElements[i].id){
			case 'inputBDay':
			validateDate(formElements[i]);
			break;
			case 'inputZipCode':
			validateZipCode(formElements[i]);
			break;
			case 'inputPhone':
			validatePhone(formElements[i]);
			break;
			case 'inputEmail':
			validateEmail(formElements[i]);
			break;
			case 'ownUniform':
			checkUniform(formElements[i]);
			break; 
		}
	}
}

function validateDate(element){
	let inputDate = element;
	let invalidFeedback = element.parentElement.children.namedItem("invalidBDay");
	let dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
	if (inputDate.value.match(dateformat)) {
		let date = inputDate.value.split('/');
		let mm = parseInt(date[0]);
		let dd = parseInt(date[1]);
		let yy = parseInt(date[2]);
		let daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		console.log(yy)

		// validate days of every month except feb
		if (mm = 1 || mm>2) {
			console.log(date)
			if(dd>daysOfMonths[mm-1]){
				inputDate.setCustomValidity('Invalid date format!');
				invalidFeedback.innerHTML = 'Invalid date format!'
			}
		}

		// check leap years
		let leapYear = false;
		if(yy % 4 === 0 ) {
			if(yy % 100 === 0){
				if(yy % 400 === 0){
					leapYear = true;
				}
			}else leapYear = true;
		}
		console.log(yy % 400)
		console.log(leapYear)
		if (leapYear && dd > 29) {
			inputDate.setCustomValidity('Invalid date format!');
			invalidFeedback.innerHTML = 'Invalid date format!'
		}else inputDate.setCustomValidity('');
		if (!leapYear && dd >= 29){
			inputDate.setCustomValidity('Invalid date format!');
			invalidFeedback.innerHTML = 'Invalid date format!'
		}else inputDate.setCustomValidity('');
	}else {
		inputDate.setCustomValidity('empty');
	}
}	

function validateZipCode(element){
	let inputZipCode = element;
	let invalidFeedback = element.parentElement.children.namedItem("invalidZipCode");
	const zipCodeFormat = /\d{5}/;

	if (inputZipCode.value.match(zipCodeFormat)){
		inputZipCode.setCustomValidity('');
	}else if(inputZipCode){
		inputZipCode.setCustomValidity('empty')
	}else {
		inputZipCode.setCustomValidity('Invalid zip code format!');
		invalidFeedback.innerHTML = 'Invalid zip code format!'
	}
}

function validatePhone(element){
	let inputPhone = element;
	let invalidFeedback = element.parentElement.children.namedItem("invalidPhone");
	const phoneFormat = /^[(]?\d{3}[)]?[(\s)?.-]\d{3}[\s.-]\d{4}$/

	if (inputPhone.value.match(phoneFormat)){
		inputPhone.setCustomValidity('');
	} else if(inputPhone){
		inputPhone.setCustomValidity('empty')
	}else {
		inputPhone.setCustomValidity('Invalid phone format!');
		invalidFeedback.innerHTML = 'Invalid phone format!';
	}
}
function validateEmail(element){
	let inputEmail = element;
	let invalidFeedback = element.parentElement.children.namedItem("invalidEmail");
	const emailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

	if(inputEmail.value.match(emailFormat)){
		inputEmail.setCustomValidity('');
	}else if(inputEmail){
		inputEmail.setCustomValidity('empty');
	}else {
		inputEmail.setCustomValidity('Invalid email format!');
		invalidFeedback.innerHTML = 'Invalid email format!';
	}
}


function checkUniform(element){
	let ownUniform = element.checked;
	let inputJersey = document.getElementById('jerSizeYouthSmall');
	let inputShorts = document.getElementById('shortsSizeYouthSmall');
	if(ownUniform){
		inputJersey.required = false;
		inputShorts.required = false;
	}else{
		inputJersey.required = true;
		inputShorts.required = true;
	}
}