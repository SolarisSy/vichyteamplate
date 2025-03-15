import axios from "axios";

const customFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: {
        Accept: "application/json"
    }
})

export default customFetch;