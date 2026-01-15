<?php
require_once '../config/cors.php';
require_once '../config/db.php';
require_once '../controllers/TaskController.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    if (!isset($pdo)) {
        throw new Exception("Database connection failed.");
    }

    $controller = new TaskController($pdo); 
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            $date = $_GET['date'] ?? null;
            $month = $_GET['month'] ?? null;
            $year = $_GET['year'] ?? null;

            if ($month && $year) {
                // Fetch full month (Best for Schedule Page)
                $result = $controller->getTasksByMonth($month, $year);
            } elseif ($date) {
                // Fetch specific day (Backup for Preview Bar)
                $result = $controller->getTasksByDate($date);
            } else {
                // Optional: return error or all tasks
                http_response_code(400);
                $result = ["error" => "Provide date or month/year"];
            }
            echo json_encode($result);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data) {
                throw new Exception("Invalid JSON input");
            }
            $newId = $controller->createTask($data);
            echo json_encode([
                "success" => (bool)$newId, 
                "id" => $newId,
                "message" => $newId ? "Task created" : "Creation failed"
            ]);
            break;

        // ... inside the switch($method) block ...

case 'PUT':
    $id = $_GET['id'] ?? null;
    $data = json_decode(file_get_contents("php://input"), true);
    if ($id && $data) {
        $success = $controller->updateTask($id, $data);
        echo json_encode(["success" => $success]);
    }
    break;

case 'DELETE':
    $id = $_GET['id'] ?? null;
    if ($id) {
        $success = $controller->deleteTask($id);
        echo json_encode(["success" => $success]);
    }
    break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>