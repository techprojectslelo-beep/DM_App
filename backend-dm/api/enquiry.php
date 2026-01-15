<?php
// 1. Correct paths
require_once '../config/cors.php';
require_once '../config/db.php'; // Provides the $pdo variable
require_once '../controllers/EnquiryController.php';

// CORS Headers
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    if (!isset($pdo)) {
        throw new Exception("Database connection variable (\$pdo) not found.");
    }

    $controller = new EnquiryController($pdo); 
    
    $method = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $type = isset($_GET['type']) ? $_GET['type'] : 'enquiry';

    switch($method) {
        case 'GET':
            if ($id) {
                // Gets lead profile + conversation history
                $result = $controller->getEnquiryDetail($id);
            } else {
                // Gets list for the main clients table
                $result = $controller->getAllEnquiries();
            }
            echo json_encode($result);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            
            if ($type === 'conversation') {
                // Log a new interaction note
                $res = $controller->addConversation($data);
                echo json_encode(["success" => $res]);
            } elseif ($type === 'update_conversation' && $id) {
                // Update a specific log entry ($id is c_id)
                $res = $controller->updateConversation($id, $data);
                echo json_encode(["success" => $res]);
            } elseif ($type === 'update' && $id) {
                // Update lead details/status ($id is enquiry id)
                $res = $controller->updateEnquiry($id, $data);
                echo json_encode(["success" => $res]);
            } else {
                // Register a new client/enquiry
                $newId = $controller->createEnquiry($data);
                echo json_encode(["id" => $newId]);
            }
            break;

        case 'DELETE':
            if ($type === 'conversation' && $id) {
                // Delete a specific interaction log ($id is c_id)
                $res = $controller->deleteConversation($id);
                echo json_encode(["success" => $res]);
            } elseif ($type === 'enquiry' && $id) {
                // Delete the whole enquirer profile
                $res = $controller->deleteEnquiry($id);
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