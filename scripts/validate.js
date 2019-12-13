// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
	'use strict';
	window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
    	form.addEventListener('submit', function(event) {
    		validate()
    		if (form.checkValidity() === false) {
    			event.preventDefault();
    			event.stopPropagation();
    		}
    		form.classList.add('was-validated');
    	}, false);
    });
}, false);
})();

let inputDate = document.getElementById('inputBDay');
let currentDate = document.getElementById('currentDate')
let today = new Date();

currentDate.value = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

inputDate.addEventListener('input', function(e){
	this.type = 'text';
	let input = this.value; // get text form input
	// Check whether input is a digit
	if (/\D\/$/.test(input)) input = input.substring(0, input.length - 3);
	let values = input.split('/').map(function(value){
		return value.replace(/\D/g, '')
	})
	if (values[0]) values[0] = checkValue(values[0], 12); // check month
	if (values[1]) values[1] = checkValue(values[1], 31); // check day
	// append a slash every 2 digits
	let output = values.map(function(value, index){
		return value.length == 2 && index < 2 ? value +  '/' : value;
	});
	// set input text to output which is all string joined together
	// substring is 14 chars long so that we can get "mm / dd / yyyy"
	this.value = output.join('').substring(0, 14);
})

function checkValue(str, max) {
	if (str.charAt(0) !== '0' || str == '00') {
		var num = parseInt(str);
    // if num is not a number or num is smaller or equal to 0 or greater than max assign num 1
    if (isNaN(num) || num <= 0 || num > max) num = 1;
    // parse num back to string
    // if num is greater than the first digit of max and lengt of num is equal to 1 return num with 0 appended to the start
    // else return num.toString()
    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
};
return str;
};

function validate(){
	validateDate();
	validateZipCode();
	validatePhone();
	validateEmail();
}

function validateDate(){
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
		}else inputDate.setCustomValidity('');
		if (!leapYear && dd >= 29){
			inputDate.setCustomValidity('Invalid date format!');
		}else inputDate.setCustomValidity('');
	}else {
		inputDate.setCustomValidity('Invalid date format!');
	}
}	

function validateZipCode(){
	let inputZipCode = document.getElementById('inputZipCode');
	const zipCodeFormat = /\d{5}/;

	if (inputZipCode.value.match(zipCodeFormat)){
		inputZipCode.setCustomValidity('');
	} else inputZipCode.setCustomValidity('Invalid zip code format!');

}

function validatePhone(){
	let inputPhone = document.getElementById('inputPhone');
	const phoneFormat = /^[(]?\d{3}[)]?[(\s)?.-]\d{3}[\s.-]\d{4}$/


	if (inputPhone.value.match(phoneFormat)){
		inputPhone.setCustomValidity('');
	} else inputPhone.setCustomValidity('Invalid phone format!');
}
function validateEmail(){
	let inputEmail = document.getElementById('inputEmail');
	const emailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

	if(inputEmail.value.match(emailFormat)){
		inputEmail.setCustomValidity('');
	}else inputEmail.setCustomValidity('Invalid email format!');
}
