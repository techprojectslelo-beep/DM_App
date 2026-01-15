import axiosClient from "./axiosClient";

const brandService = {
    getAllBrands: async () => {
        try {
            const response = await axiosClient.get('brands.php');
            return response.data; 
        } catch (error) {
            console.error("Brand Service Error [getAllBrands]:", error);
            throw error;
        }
    },
    
    getBrandDetail: async (id) => {
        const response = await axiosClient.get(`brands.php?id=${id}`);
        return response.data;
    },
    
    createBrand: async (data) => {
        // Creates a brand (default case in your PHP POST switch)
        const response = await axiosClient.post('brands.php', data);
        return response.data;
    },

    updateBrand: async (id, data) => {
        // Matches: elseif ($type === 'update' && $id)
        return await axiosClient.post(`brands.php?id=${id}&type=update`, data);
    },

    addService: async (brandId, serviceData) => {
        // Matches: if ($type === 'service')
        // Only sends service_name and brand_id
        return await axiosClient.post(`brands.php?type=service`, { 
            service_name: serviceData.service_name, 
            brand_id: brandId 
        });
    },

    deleteService: async (serviceId) => {
        // Matches: case 'DELETE': if ($type === 'service' && $id)
        return await axiosClient.delete(`brands.php?id=${serviceId}&type=service`);
    }
};

export default brandService;