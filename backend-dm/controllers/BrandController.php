<?php
class BrandController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // List all brands for the table
    public function getAllBrands() {
        $sql = "SELECT id, brand_name, is_active FROM brands ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get brand + all related services
    public function getBrandDetail($id) {
        $sql = "SELECT id, brand_name, is_active FROM brands WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        $brand = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($brand) {
            $sqlServices = "SELECT id, service_name, is_active FROM services WHERE brand_id = ?";
            $stmtS = $this->conn->prepare($sqlServices);
            $stmtS->execute([$id]);
            $brand['services'] = $stmtS->fetchAll(PDO::FETCH_ASSOC);
        }
        return $brand;
    }

    // Create a brand and return the ID (Crucial for the React redirect)
    public function createBrand($data) {
        $sql = "INSERT INTO brands (brand_name, is_active) VALUES (?, 1)";
        $stmt = $this->conn->prepare($sql);
        if($stmt->execute([$data['brand_name']])) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update existing brand
    public function updateBrand($id, $data) {
        $sql = "UPDATE brands SET brand_name = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$data['brand_name'], $id]);
    }

    // Add service to a brand
    public function addService($data) {
        $sql = "INSERT INTO services (brand_id, service_name, is_active) VALUES (?, ?, 1)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['brand_id'], 
            $data['service_name']
        ]);
    }

    // Delete a service
    public function deleteService($id) {
        $sql = "DELETE FROM services WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id]);
    }
}
?>