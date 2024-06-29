import axios from "axios";


export const currentUser = async () => {
    try {
        const response = await axios.get('/users/get-current-user');
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || 'Error registering user';
    }
};

export const logOutUser = async () => {
    try {
        const response = await axios.post('/users/logout');
        return response.data;
    } catch (error) {
        throw error.response.data.message || 'Error registering user';
    }
};