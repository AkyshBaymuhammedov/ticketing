import axios from "axios";

const buildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server
        return axios.create({
            baseURL: 'http://www.ticketing-app-prod-akysh.xyz/',
            headers: req.headers
        })
    }
    // We must be on the browser
    return axios.create({
        baseURL: '/'
    });
};

export default buildClient;