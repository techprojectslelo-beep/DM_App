<?php
class TaskController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * CREATE: Save new task
     * Matches the 15 columns provided in your DB schema
     */
    public function createTask($data) {
        $sql = "INSERT INTO tasks (
            brand_id, 
            post_type_id, 
            post_title, 
            task_due_date, 
            description, 
            asset_link, 
            ready_by_id, 
            confirmed_by_id, 
            posted_by_id, 
            readied_at, 
            claimed_by_id, 
            confirmed_at, 
            posted_at, 
            warning_sent, 
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($sql);
        
        $res = $stmt->execute([
            $data['brand_id'],
            $data['post_type_id'],
            $data['post_title'],
            $data['task_due_date'],
            $data['description'] ?? null,
            $data['asset_link'] ?? null,
            $data['ready_by_id'] ?? null,
            $data['confirmed_by_id'] ?? null,
            $data['posted_by_id'] ?? null,
            $data['readied_at'] ?? null,
            $data['claimed_by_id'] ?? null,
            $data['confirmed_at'] ?? null,
            $data['posted_at'] ?? null,
            $data['warning_sent'] ?? 0,
            $data['created_at'] ?? date('Y-m-d H:i:s')
        ]);

        return $res ? $this->conn->lastInsertId() : false;
    }

/**
 * FETCH BY MONTH
 */
public function getTasksByMonth($month, $year) {
    // UPDATED: Changed u.name to u.full_name
    $sql = "SELECT t.*, b.brand_name, pt.type_name, u.full_name as ready_by_name 
            FROM tasks t
            LEFT JOIN brands b ON t.brand_id = b.id
            LEFT JOIN post_types pt ON t.post_type_id = pt.id
            LEFT JOIN users u ON t.ready_by_id = u.id
            WHERE MONTH(t.task_due_date) = ? AND YEAR(t.task_due_date) = ?
            ORDER BY t.task_due_date ASC, t.created_at ASC";
    
    $stmt = $this->conn->prepare($sql);
    $stmt->execute([$month, $year]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * FETCH BY DATE
 */
public function getTasksByDate($date) {
    // UPDATED: Changed u.name to u.full_name
    $sql = "SELECT t.*, b.brand_name, pt.type_name, u.full_name as ready_by_name 
            FROM tasks t
            LEFT JOIN brands b ON t.brand_id = b.id
            LEFT JOIN post_types pt ON t.post_type_id = pt.id
            LEFT JOIN users u ON t.ready_by_id = u.id
            WHERE t.task_due_date = ?
            ORDER BY t.created_at ASC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute([$date]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    /**
     * UPDATE: Update content or status timestamps
     */
    public function updateTask($id, $data) {
        $sql = "UPDATE tasks SET 
                    post_title = ?, 
                    description = ?, 
                    asset_link = ?, 
                    task_due_date = ?,
                    ready_by_id = ?,
                    confirmed_by_id = ?, 
                    posted_by_id = ?,
                    readied_at = ?, 
                    confirmed_at = ?, 
                    posted_at = ?,
                    warning_sent = ?
                WHERE id = ?";
        
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['post_title'],
            $data['description'] ?? null,
            $data['asset_link'] ?? null,
            $data['task_due_date'],
            $data['ready_by_id'] ?? null,
            $data['confirmed_by_id'] ?? null,
            $data['posted_by_id'] ?? null,
            $data['readied_at'] ?? null,
            $data['confirmed_at'] ?? null,
            $data['posted_at'] ?? null,
            $data['warning_sent'] ?? 0,
            $id
        ]);
    }

    /**
     * DELETE
     */
    public function deleteTask($id) {
        $sql = "DELETE FROM tasks WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id]);
    }
}
?>