<?php
// controllers/UserController.php

class UserController {
    private $db;

    public function __construct($pdo) {
        $this->db = $pdo;
    }

    // --- PRIVATE HELPER FOR ADMIN CHECK ---
    private function isAdmin($role) {
        // Ensuring the role is a string, trimmed of spaces, and lowercased
        return strtolower(trim((string)$role)) === 'admin';
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

    // --- READ ALL (RESTRICTED) ---
    public function getAllUsers($requestingRole) {
        if (!$this->isAdmin($requestingRole)) {
            return [
                "status" => "error", 
                "message" => "Unauthorized: Directory access restricted to Admins", 
                "code" => 403,
                "debug_received_role" => $requestingRole
            ];
        }

        $stmt = $this->db->query("SELECT id, full_name, email, role, is_active FROM users");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- READ ONE (RESTRICTED) ---
    public function getUserById($id, $requestingRole) {
        if (!$this->isAdmin($requestingRole)) {
            return ["status" => "error", "message" => "Unauthorized", "code" => 403];
        }

        $stmt = $this->db->prepare("SELECT id, full_name, email, role, is_active FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ? $user : ["status" => "error", "message" => "User not found"];
    }

    // --- CREATE (RESTRICTED) ---
    public function createUser($data, $requestingRole) {
        if (!$this->isAdmin($requestingRole)) {
            return ["status" => "error", "message" => "Unauthorized", "code" => 403];
        }

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

    // --- UPDATE (RESTRICTED) ---
    public function updateUser($data, $requestingRole) {
        if (!$this->isAdmin($requestingRole)) {
            return ["status" => "error", "message" => "Unauthorized", "code" => 403];
        }

        if (!isset($data['id'])) {
            return ["status" => "error", "message" => "User ID is required"];
        }

        $params = [
            $data['full_name'] ?? '', 
            $data['email'] ?? '', 
            $data['role'] ?? 'staff', 
            $data['is_active'] ?? 1
        ];

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

    // --- DELETE (RESTRICTED) ---
    public function deleteUser($id, $requestingRole) {
        if (!$this->isAdmin($requestingRole)) {
            return ["status" => "error", "message" => "Unauthorized", "code" => 403];
        }

        $stmt = $this->db->prepare("UPDATE users SET is_active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        return ["status" => "success", "message" => "User deactivated"];
    }
}
?>