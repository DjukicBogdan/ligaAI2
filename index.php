<?php
$fetch_data = file_get_contents("php://input");
$data = json_decode($fetch_data);
error_log(print_r($data, true));
if (!$data || !isset($data->matches)) {
  http_response_code(400);
  echo json_encode(array("message" => "Invalid data format."));
  exit();
}

$matches = $data->matches;

// Implement your logic to process the matches data here
// For demonstration purposes, let's just return the received matches

http_response_code(200);
echo json_encode($matches);
?>
