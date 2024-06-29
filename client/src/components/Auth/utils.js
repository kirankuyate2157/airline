import axios from "axios";

export const signupUser = async (data) => {
    try {
        const res = await axios.post('/signup', data);
        return res.data;
    } catch (error) {
        return error;
    }
}