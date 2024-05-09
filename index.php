<?php
// Assuming you receive JSON data from Glide app in the POST request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true); // Convert JSON data to PHP array

// Process the data (for demonstration, simply send back the received data)
header('Content-Type: application/json');
echo json_encode($data);
?>