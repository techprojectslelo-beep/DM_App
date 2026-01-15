import axiosClient from "./axiosClient"; // Same folder import

const enquiryService = {
    // 1. Get all enquiries (Main Table)
    getAllEnquiries: async () => {
        try {
            const response = await axiosClient.get('enquiry.php');
            return response.data;
        } catch (error) {
            console.error("Enquiry Service Error [getAllEnquiries]:", error);
            throw error;
        }
    },

    // 2. Get specific enquirer details + nested conversations
    getEnquiryDetail: async (id) => {
        const response = await axiosClient.get(`enquiry.php?id=${id}`);
        return response.data;
    },

    // 3. Register a new enquirer
    createEnquiry: async (data) => {
        const response = await axiosClient.post('enquiry.php', data);
        return response.data;
    },

    // 4. Update existing enquirer profile
    updateEnquiry: async (id, data) => {
        const response = await axiosClient.post(`enquiry.php?id=${id}&type=update`, data);
        return response.data;
    },

    // 5. Delete enquirer and all their records
    deleteEnquiry: async (id) => {
        const response = await axiosClient.delete(`enquiry.php?id=${id}&type=enquiry`);
        return response.data;
    },

    // --- CONVERSATION LOGS ---

    // 6. Log a new interaction note
    addConversation: async (data) => {
        // Expected data: { enquiry_id, c_title, c_desc, interaction_date, logged_by }
        const response = await axiosClient.post(`enquiry.php?type=conversation`, data);
        return response.data;
    },

    // 7. Edit a specific conversation (id = c_id)
    updateConversation: async (c_id, data) => {
        const response = await axiosClient.post(`enquiry.php?id=${c_id}&type=update_conversation`, data);
        return response.data;
    },

    // 8. Delete a specific log entry (id = c_id)
    deleteConversation: async (c_id) => {
        const response = await axiosClient.delete(`enquiry.php?id=${c_id}&type=conversation`);
        return response.data;
    }
};

export default enquiryService;