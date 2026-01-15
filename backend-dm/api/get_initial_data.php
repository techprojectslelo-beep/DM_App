<?php
// api/get_initial_data.php
require_once '../config/db.php';

// Headers to stop CORS issues
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

try {
    // 1. Fetch Brands
    $brands = $pdo->query("SELECT id, brand_name FROM brands WHERE is_active = 1")->fetchAll();

    // 2. Fetch Post Types
    $types = $pdo->query("SELECT id, type_name FROM post_types WHERE is_active = 1")->fetchAll();

    // 3. Fetch Staff Users
    $users = $pdo->query("SELECT id, full_name FROM users WHERE is_active = 1")->fetchAll();

    echo json_encode([
        "status" => "success",
        "brands" => $brands,
        "post_types" => $types,
        "users" => $users
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}