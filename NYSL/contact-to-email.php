<?php
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['inputEmail'];

$to = 'van.dihn.ha+nysl@gmail.com';
$subject = "Support ticket";
$headers = "From: $email\r\n";
$message = "Message from $firstName $lastName\n\n".
$_POST['inputMessage'];
?>


<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>NYSL</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<link href="./resources/css/style.css" type="text/css" rel="stylesheet">
	<link href="./resources/css/contact.css" type="text/css" rel="stylesheet">
	<script src="https://kit.fontawesome.com/6959a909c1.js" crossorigin="anonymous"></script>
</head>
<body>
	<header class="header" id="header">
		<a href="index.html"><img id="headerImage" src="resources/image.png"></a>
	</header>
	<nav class="nav">
		<ul class="nav_items">
			<li><a href="index.html">Home</a></li>
			<li><a href="about.html">About NYSL</a></li>
			<li><a href="gameinfo.html">Game Information</a></li>
			<li><a href="rules.html">Rules</a></li>
			<li><a href="registration.html">Registration</a></li>
			<li><a class="active" href="contact.html">Contact</a></li>
		</ul>
	</nav>

	<main id="contact">
		<section class="banner bg-light">
			<div class="text-container">
				<small>Got a question?</small>
				<h2>Contact NYSL</h2>
				<p>We're here to help and answer any question you might have. We look forward to hearing from you.</p>
			</div>
		</section>
		<section class="container">
			<section class="faq container"></section>
			<section class="form container col-md-8">
				<hr class="mt-4 mb-4">
				<h3>
					<?php if(mail($to, $subject, $message, $headers)){
						echo('Message successfully sent, we will contact you as soon as possible.');
					}else{
						echo('Something went wrong, please try again.');
					}
					?> 
				</h3>
				<hr class="mt-4 mb-4">
				<div class="row">
					<div class="col">
						<h5>Contact information</h5>
					</div>
				</div>
				<div class="row">
					<div class="col-1">
						<i class="fas fa-map-marker-alt"></i>
					</div>
					<div class="col">
						<p>24 W. Walton St., Chicago, IL 60610</p>
					</div>
				</div>
				<div class="row">
					<div class="col-1">
						<i class="fas fa-phone"></i>
					</div>
					<div class="col">
						<p>+45 71 99 77 07</p>
					</div>
				</div>
				<div class="row">
					<div class="col-1">
						<i class="fas fa-envelope"></i>
					</div>
					<div class="col">
						<p>mail@nysl.com</p>
					</div>
				</div>
			</section>
			
		</section>
	</section>
</main>
<script src="scripts/scroll.js">

</script>
</body>
</html>