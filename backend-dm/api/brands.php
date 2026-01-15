<?php
// 1. Correct paths
require_once '../config/cors.php';
require_once '../config/db.php'; // This file creates the $pdo variable
require_once '../controllers/BrandController.php';

// CORS Headers
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Check if $pdo exists from the require_once above
    if (!isset($pdo)) {
        throw new Exception("Database connection variable (\$pdo) not found.");
    }

    // Pass the existing $pdo directly to the controller
    $controller = new BrandController($pdo); 
    
    $method = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $type = isset($_GET['type']) ? $_GET['type'] : 'brand';

    switch($method) {
        case 'GET':
            if ($id) {
                $result = $controller->getBrandDetail($id);
            } else {
                $result = $controller->getAllBrands();
            }
            echo json_encode($result);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if ($type === 'service') {
                $res = $controller->addService($data);
                echo json_encode(["success" => $res]);
            } elseif ($type === 'update' && $id) {
                $res = $controller->updateBrand($id, $data);
                echo json_encode(["success" => $res]);
            } else {
                $newId = $controller->createBrand($data);
                echo json_encode(["id" => $newId]);
            }
            break;

        case 'DELETE':
            if ($type === 'service' && $id) {
                $res = $controller->deleteService($id);
                echo json_encode(["success" => $res]);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Internal Server Error",
        "message" => $e->getMessage()
    ]);
}
?>