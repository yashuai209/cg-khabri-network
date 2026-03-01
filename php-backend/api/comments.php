<?php
// api/comments.php - Handle Comments
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $post_id = isset($_GET['post_id']) ? $_GET['post_id'] : null;
    if (!$post_id) {
        echo json_encode([]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC");
    $stmt->execute([$post_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($comments);
}

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->post_id) || !isset($data->author_name) || !isset($data->content)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO comments (post_id, author_name, content) VALUES (?, ?, ?)");
    $stmt->execute([$data->post_id, $data->author_name, $data->content]);
    
    echo json_encode(["message" => "Comment added successfully", "id" => $conn->lastInsertId()]);
}
?>
