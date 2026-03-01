<?php
// api/posts.php - Fetch News Posts
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['slug'])) {
        // Fetch single post by slug
        $slug = $_GET['slug'];
        $stmt = $conn->prepare("SELECT * FROM posts WHERE slug = ?");
        $stmt->execute([$slug]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($post) {
            // Increment views
            $update = $conn->prepare("UPDATE posts SET views = views + 1 WHERE id = ?");
            $update->execute([$post['id']]);
            echo json_encode($post);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Post not found"]);
        }
    } else {
        // Fetch all posts with filters
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $featured = isset($_GET['featured']) ? $_GET['featured'] : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        $query = "SELECT * FROM posts";
        $conditions = [];
        $params = [];

        if ($category) {
            $conditions[] = "category = ?";
            $params[] = $category;
        }
        if ($featured) {
            $conditions[] = "is_featured = 1";
        }
        if ($search) {
            $conditions[] = "(title LIKE ? OR content LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        $query .= " ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($posts);
    }
}
if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $id = isset($data->id) ? $data->id : null;
    $type = isset($data->type) ? $data->type : null; // 'like', 'share', 'click'

    if ($id && in_array($type, ['like', 'share', 'click'])) {
        $column = $type . 's'; // likes, shares, clicks
        $stmt = $conn->prepare("UPDATE posts SET $column = $column + 1 WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Interaction recorded"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid request"]);
    }
}
?>
