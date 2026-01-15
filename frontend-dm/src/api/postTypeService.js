import axiosClient from "./axiosClient";

const postTypeService = {
    // Used for Task creation dropdowns
    getActiveTypes: async () => {
        const response = await axiosClient.get('post_types.php');
        return response.data;
    },

    // Used for the Admin Settings page
    getAdminTypes: async () => {
        const response = await axiosClient.get('post_types.php?all=true');
        return response.data;
    },

    createType: async (name) => {
        const response = await axiosClient.post('post_types.php', { type_name: name });
        return response.data;
    },

    updateType: async (id, data) => {
        // data should include { type_name, is_active }
        const response = await axiosClient.put(`post_types.php?id=${id}`, data);
        return response.data;
    },

    softDeleteType: async (id) => {
        // This hits the DELETE method in PHP which updates is_active to 0
        const response = await axiosClient.delete(`post_types.php?id=${id}`);
        return response.data;
    }
};

export default postTypeService;