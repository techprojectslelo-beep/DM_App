<?php
// Allow React (localhost:3000) to access this API
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle pre-flight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$data = [
    "status" => "success",
    "message" => "PHP Backend is Live",
    "brands" => ["Nike", "Starbucks", "Apple", "Coca Cola"],
    "types" => ["Reel", "Post", "Email", "Info"]
];

echo json_encode($data);