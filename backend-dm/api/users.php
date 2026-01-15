<?php
// api/users.php
require_once '../config/db.php';
require_once '../config/cors.php';
require_once '../controllers/UserController.php';

header('Content-Type: application/json'); // Added this for React safety

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$controller = new UserController($pdo);

// Grab the ID from the URL (?id=1)
$id = $_GET['id'] ?? null;

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                echo json_encode($controller->getUserById($id));
            } else {
                echo json_encode($controller->getAllUsers());
            }
            break;

        case 'POST':
            echo json_encode($controller->createUser($input));
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "User ID is required for update"]);
                break;
            }
            $input['id'] = $id; 
            echo json_encode($controller->updateUser($input));
            break;

        case 'DELETE':
            echo json_encode($controller->deleteUser($id));
            break;

        default:
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}