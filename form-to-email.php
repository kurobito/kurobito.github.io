<?php
$to = 'van.dihn.ha@gmail.com';
$subject = 'Hello from XAMPP!';
$message = 'This is a test';
$headers = "From: van.dihn.ha@gamil.com\r\n";
if (mail($to, $subject, $message, $headers)) {
	echo "SUCCESS";
} else {
	echo "ERROR";
}