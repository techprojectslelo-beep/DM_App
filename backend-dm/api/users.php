<?php
// api/users.php
require_once '../config/db.php';
require_once '../config/cors.php';
require_once '../controllers/UserController.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true) ?? [];

/**
 * 1. ROBUST ROLE DETECTION
 * Some servers use HTTP_X_USER_ROLE, others use X_USER_ROLE.
 * We also trim and lowercase it to ensure 'Admin' or ' admin ' doesn't fail.
 */
$allHeaders = array_change_key_case(getallheaders(), CASE_LOWER);
$rawRole = $allHeaders['x-user-role'] ?? $_SERVER['HTTP_X_USER_ROLE'] ?? 'staff';
$requestingRole = strtolower(trim($rawRole));

$controller = new UserController($pdo);
$id = $_GET['id'] ?? null;

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $controller->getUserById($id, $requestingRole);
            } else {
                $result = $controller->getAllUsers($requestingRole);
            }
            
            // If the controller returns an error, set the HTTP code accordingly
            if (isset($result['status']) && $result['status'] === 'error') {
                http_response_code($result['code'] ?? 403);
                // We add the received role to the response so you can see it in React
                $result['debug_received_as'] = $requestingRole;
            }
            
            echo json_encode($result); 
            break;

        case 'POST':
            echo json_encode($controller->createUser($input, $requestingRole));
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "User ID required"]);
                break;
            }
            $input['id'] = $id; 
            echo json_encode($controller->updateUser($input, $requestingRole));
            break;

        case 'DELETE':
            echo json_encode($controller->deleteUser($id, $requestingRole));
            break;

        default:
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => $e->getMessage(),
        "trace" => $isLocal ? $e->getTraceAsString() : null // Only show trace on localhost
    ]);
}
?>