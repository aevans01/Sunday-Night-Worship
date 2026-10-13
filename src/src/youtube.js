import axios from 'axios';
const KEY = 'AIzaSyBisAWM5P-L-nJ9zCsOicJWwG_fF_v-Rr8';

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
        part: 'snippet',
        maxResults: 10,
        safeSearch: 'strict',
        key: KEY
    }
})