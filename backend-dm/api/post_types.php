<?php
require_once '../config/cors.php';
require_once '../config/db.php';
require_once '../controllers/PostTypeController.php';

header("Content-Type: application/json");

$controller = new PostTypeController($pdo);
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            // If ?all=true is passed, get everything (for admin), else get only active (for dropdowns)
            if (isset($_GET['all'])) {
                echo json_encode($controller->getAllTypes());
            } else {
                echo json_encode($controller->getActiveTypes());
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            echo json_encode(["success" => $controller->createType($data['type_name'])]);
            break;

        case 'PUT':
            $id = $_GET['id'] ?? null;
            $data = json_decode(file_get_contents("php://input"), true);
            if ($id) {
                echo json_encode(["success" => $controller->updateType($id, $data['type_name'], $data['is_active'])]);
            }
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id) {
                echo json_encode(["success" => $controller->softDeleteType($id)]);
            }
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}