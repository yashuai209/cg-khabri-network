<?php
// config.php - Database Connection & CORS Settings

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Hostinger Database Credentials
$host = "localhost"; // Usually localhost on Hostinger
$db_name = "u123456789_news_db"; // Change this to your actual DB name
$username = "u123456789_user"; // Change this to your actual DB username
$password = "your_db_password"; // Change this to your actual DB password

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8mb4");
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit;
}

// JWT Secret Key (Keep this secret)
$jwt_secret = "cg-khabri-secret-key-123";

function authenticate($jwt_secret) {
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit;
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    // In a real app, use a JWT library like firebase/php-jwt
    // For simplicity, we'll assume the token is valid if it exists for now
    // or you can implement a simple token check here.
    return true;
}
?>
