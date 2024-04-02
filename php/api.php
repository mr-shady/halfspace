<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, post, get');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Access-Control-Allow-Credentials: true');
require_once 'FixHalfSpace.php';
function sanitizeString($string) {
    $string = trim($string);
    return $string;
}
// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the 'string' parameter is provided

    if (isset($_POST['string'])) {
        // Get the input string from the request
        $inputString = sanitizeString($_POST['string']);

        // Initialize an instance of the FixGrammar class with the input string
        $fixGrammar = new FixGrammar($inputString);

        // Get the processed string
        $processedString = $fixGrammar->get();

        // Return the processed string as the API response
        echo json_encode(array('string' => $processedString));
    } else {
        // If 'string' parameter is not provided, return an error message
        echo json_encode(array('error' => 'String parameter is missing'));
    }
} else {
    // If the request method is not POST, return an error message
    echo json_encode(array('error' => 'Only POST requests are allowed'));
}