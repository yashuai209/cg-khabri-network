<?php
// api/manage_posts.php - CRUD Operations
require_once 'config.php';

authenticate($jwt_secret);

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $title = $_POST['title'];
    $content = $_POST['content'];
    $category = $_POST['category'];
    $is_featured = $_POST['is_featured'] == 'true' ? 1 : 0;
    $tags = $_POST['tags'];
    $seo_title = $_POST['seo_title'];
    $seo_description = $_POST['seo_description'];
    $sponsor_name = $_POST['sponsor_name'];
    $sponsor_link = $_POST['sponsor_link'];
    $external_link = $_POST['external_link'];
    
    if ($id) {
        // Update existing post
        $query = "UPDATE posts SET title = ?, content = ?, category = ?, is_featured = ?, tags = ?, seo_title = ?, seo_description = ?, sponsor_name = ?, sponsor_link = ?, external_link = ?";
        $params = [$title, $content, $category, $is_featured, $tags, $seo_title, $seo_description, $sponsor_name, $sponsor_link, $external_link];

        if (isset($_FILES['image'])) {
            $target_dir = "../uploads/";
            $file_name = time() . "_" . basename($_FILES["image"]["name"]);
            $target_file = $target_dir . $file_name;
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                $query .= ", image_url = ?";
                $params[] = "/uploads/" . $file_name;
            }
        }

        if (isset($_FILES['sponsor_image'])) {
            $target_dir = "../uploads/";
            $file_name = "sponsor_" . time() . "_" . basename($_FILES["sponsor_image"]["name"]);
            $target_file = $target_dir . $file_name;
            if (move_uploaded_file($_FILES["sponsor_image"]["tmp_name"], $target_file)) {
                $query .= ", sponsor_image = ?";
                $params[] = "/uploads/" . $file_name;
            }
        }

        $query .= " WHERE id = ?";
        $params[] = $id;

        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        echo json_encode(["message" => "Post updated successfully"]);
    } else {
        // Create new post
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title))) . '-' . time();
        
        $image_url = "";
        if (isset($_FILES['image'])) {
            $target_dir = "../uploads/";
            $file_name = time() . "_" . basename($_FILES["image"]["name"]);
            $target_file = $target_dir . $file_name;
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                $image_url = "/uploads/" . $file_name;
            }
        }

        $sponsor_image = "";
        if (isset($_FILES['sponsor_image'])) {
            $target_dir = "../uploads/";
            $file_name = "sponsor_" . time() . "_" . basename($_FILES["sponsor_image"]["name"]);
            $target_file = $target_dir . $file_name;
            move_uploaded_file($_FILES["sponsor_image"]["tmp_name"], $target_file);
            $sponsor_image = "/uploads/" . $file_name;
        }

        $stmt = $conn->prepare("INSERT INTO posts (title, slug, content, image_url, category, is_featured, tags, seo_title, seo_description, sponsor_name, sponsor_link, sponsor_image, external_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $slug, $content, $image_url, $category, $is_featured, $tags, $seo_title, $seo_description, $sponsor_name, $sponsor_link, $sponsor_image, $external_link]);
        
        echo json_encode(["message" => "Post created successfully", "id" => $conn->lastInsertId()]);
    }
}

if ($method == 'DELETE') {
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(["message" => "Post deleted successfully"]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Post not found"]);
    }
}

// Note: Update (PUT) is similar to POST but with UPDATE query.
// PHP doesn't handle multipart/form-data natively for PUT, so we often use POST with an ID.
?>
