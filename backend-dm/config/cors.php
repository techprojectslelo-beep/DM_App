<?php
// api/cors.php

/**
 * 1. SECURE ERROR LOGGING
 * We log CORS-related initialization errors to a .log file, not a .php file.
 */
ini_set('log_errors', 1);
ini_set('error_log', dirname(__DIR__) . '/utils/logs/cors_errors.log');
error_reporting(E_ALL);

// 2. ALLOWED ORIGINS
$allowed_origins = [
    'http://localhost:3000', // React/Next.js default
];

if (php_sapi_name() !== 'cli') {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // 3. DYNAMIC ORIGIN CHECK
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $origin);
    }

    // 4. ESSENTIAL HEADERS
    header("Access-Control-Allow-Methods: GET, POST,PATCH, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-Role, X-Auth-Token, Time-Zone");
    header("Access-Control-Max-Age: 86400"); // Cache preflight for 24 hours

    /**
     * 5. HANDLE PREFLIGHT (OPTIONS)
     * Browsers send OPTIONS before POST/PUT/DELETE. 
     * We must exit immediately with 200 OK.
     */
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}