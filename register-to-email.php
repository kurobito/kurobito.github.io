<?php
$playerFirstName = $_POST['playerFirstName'];
$playerLastName = $_POST['playerLastName'];
$streetAddress = $_POST['inputStreet'];
$city = $_POST['inputCity'];
$zipCode = $_POST['inputZipCode'];
$birthDate = $_POST['inputBDay'];
$genderOptions = $_POST['genderOptions'];
$gradeOptions = $_POST['gradeOptions'];
$parent = $_POST['inputParent'];
$phone = $_POST['inputPhone'];
$email = $_POST['inputEmail'];
$firstClosestSchool = $_POST['firstClosestSchool'];
$secondClosestSchool = $_POST['secondClosestSchool'];
$usualPositions = $_POST['usualPositionOptions'];
$wantPositions = $_POST['wantPositionOptions'];
$parentFullName = $_POST['parentFullName'];
$currentDate = $_POST['currentDate'];

$to = 'van.dihn.ha+nysl@gmail.com';
$subject = "Registration";
$headers = "From: van.dihn.ha@gamil.com\r\n";
$message = "Player $playerFirstName $playerLastName has registered.\n".
"Residence: $streetAddress, $city, IL $zipCode\n".
"Birth date $birthDate\n".
"Gender: $genderOptions\n".
"Grade: $gradeOptions\n".
"Parent/Guardian: $parent\n".
"Contact: $phone; $email\n".
"Closest schools: $firstClosestSchool, $secondClosestSchool\n".
"Usual position(s): ";

// loop usualPositions and append to message
for($i=0; $i < count($usualPositions); $i++){
	if($i == count($usualPositions) - 1){
		$message.= $usualPositions[$i]. ".\n";
	} else{
		$message .= $usualPositions[$i]. ", ";
	}
}

// loop wantPositions and append to message
$message .= "Want position(s): ";
for($i=0; $i < count($wantPositions); $i++){
	if($i == count($wantPositions) - 1){
		$message.= $wantPositions[$i]. ".\n";
	} else{
		$message .= $wantPositions[$i]. ", ";
	}
}
if(isset($_POST['ownUniform']) && $_POST['ownUniform'] == 'on'){
	$message .= "Owns a uniform: yes\n";
}else{
	$jerseySize = $_POST['jerseyOptions'];
	$shortsSize = $_POST['shortsOptions'];
	$message .= "Owns a uniform: no\n".
	"Jersey size: $jerseySize; Shorts size: $shortsSize\n";
}

$message.= "Full name of parent/guardian: $parentFullName\n".
"Date of registration: $currentDate";

// echo $message;
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>NYSL</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<link href="./resources/css/style.css" type="text/css" rel="stylesheet">
	<link href="./resources/css/form-feedback.css" type="text/css" rel="stylesheet">
</head>
<body>
	<header class="header">
		<a href="index.html"><img src="resources/image.png"></a>
	</header>
	<nav class="nav">
		<ul class="nav_items">
			<li><a class="active" href="index.html">Home</a></li>
			<li><a href="about.html">About NYSL</a></li>
			<li><a href="gameinfo.html">Game Information</a></li>
			<li><a href="rules.html">Rules</a></li>
			<li><a href="registration.html">Registration</a></li>
			<li><a href="contact.html">Contact</a></li>
		</ul>
	</nav>
	<main>
		<div class="mail-feedback">
			<h1>
				<?php if(mail($to, $subject, $message, $headers)){
					echo('You have successfully registered at NYSL, we will contact you in a few days.');
				}else{
					echo('Something went wrong, please try again.');
				}
				?>
			</h1>
		</div>
	</main>
</body>
</html>
