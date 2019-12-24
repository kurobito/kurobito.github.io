let inputDate = document.getElementById('inputBDay');
let currentDate = document.getElementById('currentDate')
let today = new Date();
let backspacePressed = false;

currentDate.value = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

inputDate.addEventListener('input', function(e){
	this.type = 'text';
	let input = this.value; // get text form input
	// Check whether backspace is pressed and remove input appropriately
	console.log(input)
	if (backspacePressed) {
		if(!/\d{2}\/\d{2}\//.test(input)){
			input = input.substring(0, input.length - 1);
		}
		backspacePressed = false;
		// console.log(input)
		
	}
	// if (/\D\/$/.test(input)){
	// 	input = input.substring(0, input.length - 3);
	// }
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
	// substring is 10 chars long so that we can get "mm/dd/yyyy"
	this.value = output.join('').substring(0, 10);
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

document.addEventListener("keydown", keyCheck);
function keyCheck(event){
	let key = event.key;
	if(key == 'Backspace') backspacePressed = true;
	else backspacePressed = false;
}