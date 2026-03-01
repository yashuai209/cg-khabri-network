<?php
// api/admin.php - Admin Login & Stats
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method == 'POST' && $action == 'login') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->username) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing credentials"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$data->username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // For initial setup, we check both hashed and plain text (if not hashed yet)
    $is_valid = false;
    if ($user) {
        if (password_verify($data->password, $user['password'])) {
            $is_valid = true;
        } else if ($data->password === $user['password']) {
            // Fallback for plain text passwords in DB
            $is_valid = true;
        }
    }

    if ($is_valid) {
        // In a real app, generate a real JWT
        $token = base64_encode(json_encode(["id" => $user['id'], "username" => $user['username'], "exp" => time() + 86400]));
        echo json_encode(["token" => $token]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid username or password"]);
    }
}

if ($method == 'GET' && $action == 'stats') {
    authenticate($jwt_secret);

    // Fetch all posts with comment counts
    $stmt = $conn->prepare("
        SELECT p.*, (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count 
        FROM posts p 
        ORDER BY p.created_at DESC
    ");
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch total stats
    $stmt = $conn->prepare("
        SELECT 
            SUM(views) as total_views, 
            SUM(likes) as total_likes, 
            SUM(shares) as total_shares, 
            SUM(clicks) as total_clicks,
            (SELECT COUNT(*) FROM comments) as total_comments
        FROM posts
    ");
    $stmt->execute();
    $totalStats = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["posts" => $posts, "totalStats" => $totalStats]);
}
?>
