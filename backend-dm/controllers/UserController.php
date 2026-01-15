<?php
// controllers/UserController.php

class UserController {
    private $db;

    public function __construct($pdo) {
        $this->db = $pdo;
    }

    // --- LOGIN ---
    public function login($email, $password) {
        $stmt = $this->db->prepare("SELECT id, full_name, role, password_hash FROM users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            return [
                "status" => "success", 
                "user" => [
                    "id" => $user['id'], 
                    "name" => $user['full_name'],
                    "role" => $user['role']
                ]
            ];
        }
        return ["status" => "error", "message" => "Invalid credentials", "code" => 401];
    }

    // --- READ ALL ---
    public function getAllUsers() {
        $stmt = $this->db->query("SELECT id, full_name, email, role, is_active FROM users");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- READ ONE ---
    public function getUserById($id) {
        $stmt = $this->db->prepare("SELECT id, full_name, email, role, is_active FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ? $user : ["status" => "error", "message" => "User not found"];
    }

    // --- CREATE ---
    public function createUser($data) {
        $hashed = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO users (full_name, email, role, password_hash, is_active) VALUES (?, ?, ?, ?, 1)");
        $stmt->execute([
            $data['full_name'], 
            $data['email'], 
            $data['role'] ?? 'staff', 
            $hashed
        ]);
        return ["status" => "success", "message" => "User added"];
    }

    // --- UPDATE (Improved to handle passwords) ---
    public function updateUser($data) {
        if (!isset($data['id'])) {
            return ["status" => "error", "message" => "User ID is required for updates"];
        }

        $params = [
            $data['full_name'] ?? '', 
            $data['email'] ?? '', 
            $data['role'] ?? 'staff', 
            $data['is_active'] ?? 1
        ];

        // If password is provided, we include it in the query
        if (!empty($data['password'])) {
            $sql = "UPDATE users SET full_name = ?, email = ?, role = ?, is_active = ?, password_hash = ? WHERE id = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
            $params[] = $data['id'];
        } else {
            $sql = "UPDATE users SET full_name = ?, email = ?, role = ?, is_active = ? WHERE id = ?";
            $params[] = $data['id'];
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return ["status" => "success", "message" => "User updated"];
    }

    // --- DELETE (Soft Delete) ---
    public function deleteUser($id) {
        if (!$id) return ["status" => "error", "message" => "ID required"];
        
        $stmt = $this->db->prepare("UPDATE users SET is_active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        return ["status" => "success", "message" => "User deactivated"];
    }
}