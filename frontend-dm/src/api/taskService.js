import axiosClient from "./axiosClient";

const taskService = {
    getTasksByMonth: async (month, year) => {
        const response = await axiosClient.get(`tasks.php?month=${month}&year=${year}`);
        return response.data;
    },

    getTasksByDate: async (date) => {
        const response = await axiosClient.get(`tasks.php?date=${date}`);
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await axiosClient.post('tasks.php', taskData);
        return response.data;
    },

    // NEW: Update task (handles content changes and status timestamps)
    updateTask: async (id, taskData) => {
        const response = await axiosClient.put(`tasks.php?id=${id}`, taskData);
        return response.data;
    },

    // NEW: Delete task
    deleteTask: async (id) => {
        const response = await axiosClient.delete(`tasks.php?id=${id}`);
        return response.data;
    }
};

export default taskService;