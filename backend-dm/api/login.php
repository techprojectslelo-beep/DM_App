<?php
// api/login.php
require_once '../config/db.php';
require_once '../config/cors.php'; // Your custom CORS with logging
require_once '../controllers/UserController.php';

$input = json_decode(file_get_contents("php://input"), true);
$controller = new UserController($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    $result = $controller->login($email, $password);

    // If there is a 401 error code in the result, set it in the header
    if (isset($result['code'])) {
        http_response_code($result['code']);
    }

    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST allowed"]);
}