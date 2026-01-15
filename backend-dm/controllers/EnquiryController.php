<?php
// EnquiryController.php

class EnquiryController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. Get List of all Enquiries (for the main table)
    public function getAllEnquiries() {
        $sql = "SELECT e.*, b.brand_name, s.service_name 
                FROM enquiries e
                LEFT JOIN brands b ON e.brand_id = b.id
                LEFT JOIN services s ON e.service_id = s.id
                ORDER BY e.created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // 2. Get Single Enquiry Detail with its Conversations
    public function getEnquiryDetail($id) {
        // Get Main Profile
        $sql = "SELECT e.*, b.brand_name, s.service_name 
                FROM enquiries e
                LEFT JOIN brands b ON e.brand_id = b.id
                LEFT JOIN services s ON e.service_id = s.id
                WHERE e.id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        $enquiry = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($enquiry) {
            // Fetch associated conversations
            $convSql = "SELECT * FROM conversations WHERE enquiry_id = ? ORDER BY interaction_date DESC";
            $convStmt = $this->conn->prepare($convSql);
            $convStmt->execute([$id]);
            $enquiry['conversations'] = $convStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return $enquiry;
    }

    // 3. Create New Enquiry
    public function createEnquiry($data) {
        $sql = "INSERT INTO enquiries (
                    enquirer_name, enq_email, enq_number, enquirer_company,
                    college_name, course_taken, passing_grade,
                    job_title, job_company_location, job_field,
                    brand_id, service_id, enquiry_status, budget_range, next_follow_up
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['enquirer_name'], $data['enq_email'], $data['enq_number'], $data['enquirer_company'],
            $data['college_name'], $data['course_taken'], $data['passing_grade'],
            $data['job_title'], $data['job_company_location'], $data['job_field'],
            $data['brand_id'], $data['service_id'], $data['enquiry_status'], 
            $data['budget_range'], $data['next_follow_up']
        ]);
        
        return $this->conn->lastInsertId();
    }

    // Add this inside the EnquiryController class
public function updateEnquiry($id, $data) {
    $sql = "UPDATE enquiries SET 
            enquirer_name = ?, 
            enq_email = ?, 
            enq_number = ?, 
            enquirer_company = ?, 
            college_name = ?, 
            course_taken = ?, 
            passing_grade = ?, 
            job_title = ?, 
            job_company_location = ?, 
            job_field = ?, 
            brand_id = ?, 
            service_id = ?, 
            enquiry_status = ?, 
            budget_range = ?, 
            next_follow_up = ?
            WHERE id = ?";
            
    $stmt = $this->conn->prepare($sql);
    return $stmt->execute([
        $data['enquirer_name'], $data['enq_email'], $data['enq_number'], $data['enquirer_company'],
        $data['college_name'], $data['course_taken'], $data['passing_grade'],
        $data['job_title'], $data['job_company_location'], $data['job_field'],
        $data['brand_id'], $data['service_id'], $data['enquiry_status'], 
        $data['budget_range'], $data['next_follow_up'],
        $id
    ]);
}

    // 4. Add Conversation Log
    public function addConversation($data) {
        $sql = "INSERT INTO conversations (enquiry_id, c_title, c_desc, interaction_date, logged_by) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['enquiry_id'], $data['c_title'], $data['c_desc'], 
            $data['interaction_date'], $data['logged_by']
        ]);
    }

public function updateConversation($enquiry_id, $c_id, $data) {
    $sql = "UPDATE conversations SET 
            c_title = ?, 
            c_desc = ?, 
            interaction_date = ?, 
            logged_by = ? 
            WHERE c_id = ? AND enquiry_id = ?";
    $stmt = $this->conn->prepare($sql);
    return $stmt->execute([
        $data['c_title'], 
        $data['c_desc'], 
        $data['interaction_date'], 
        $data['logged_by'], 
        $c_id,
        $enquiry_id
    ]);
}

public function deleteConversation($c_id) {
    $sql = "DELETE FROM conversations WHERE c_id = ?";
    $stmt = $this->conn->prepare($sql);
    return $stmt->execute([$c_id]);
}
}