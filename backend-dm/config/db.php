<?php
// config/db.php
$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['HTTP_HOST'] === 'localhost');

if ($isLocal) {
    $host = "localhost";
    $user = "root"; 
    $pass = ""; 
    $db   = "digital_marketing"; 
} else {
    // HOSTINGER SETTINGS
    $host = "localhost"; 
    $user = "u_your_user"; 
    $pass = "your_pass"; 
    $db   = "db_your_name"; 
}

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    // THE ONLY CONNECTION (PDO)
    $pdo = new PDO($dsn, $user, $pass, $options);

} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}