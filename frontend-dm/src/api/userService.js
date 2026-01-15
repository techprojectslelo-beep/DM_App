// src/services/userService.js
import axiosClient from "../api/axiosClient";

const userService = {
    /**
     * Fetches all users.
     * The X-User-Role header is automatically handled by our axiosClient interceptor.
     */
    getAllUsers: async () => {
        try {
            const response = await axiosClient.get('users.php');
            
            // Handle the specific error structure from your UserController.php
            if (response.data && response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Service Error [getAllUsers]:", error);
            throw error;
        }
    },

    /**
     * Fetches a single user by ID
     */
    getUserById: async (id) => {
        const response = await axiosClient.get(`users.php?id=${id}`);
        return response.data;
    },

    /**
     * Create a new staff member
     */
    createUser: async (userData) => {
        const response = await axiosClient.post('users.php', userData);
        return response.data;
    },

    /**
     * Update existing user
     */
    updateUser: async (id, userData) => {
        const response = await axiosClient.put(`users.php?id=${id}`, userData);
        return response.data;
    },

    /**
     * Deactivate a user
     */
    deleteUser: async (id) => {
        const response = await axiosClient.delete(`users.php?id=${id}`);
        return response.data;
    }
};

export default userService;