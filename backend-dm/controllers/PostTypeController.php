<?php
class PostTypeController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get only active types for the Task Form dropdowns
    public function getActiveTypes() {
        $sql = "SELECT id, type_name FROM post_types WHERE is_active = 1 ORDER BY type_name ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get ALL types (including soft-deleted) for the Admin Management page
    public function getAllTypes() {
        $sql = "SELECT * FROM post_types ORDER BY type_name ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createType($name) {
        $sql = "INSERT INTO post_types (type_name, is_active) VALUES (?, 1)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$name]);
    }

    public function updateType($id, $name, $is_active) {
        $sql = "UPDATE post_types SET type_name = ?, is_active = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$name, $is_active, $id]);
    }

    // Soft Delete: Just flip the is_active switch
    public function softDeleteType($id) {
        $sql = "UPDATE post_types SET is_active = 0 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id]);
    }
}