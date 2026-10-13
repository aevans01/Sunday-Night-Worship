import Axios from 'axios';

// Load bounded photo batches so a gallery never exceeds the function response limit.
export async function fetchAllPhotos() {
    const photos = [];
    for (let offset = 0; ; offset += 2) {
        const { data } = await Axios.get('/api/getPhotos', { params: { limit: 2, offset } });
        if (!Array.isArray(data)) throw new Error('Invalid photo response');
        photos.push(...data);
        if (data.length < 2) return photos;
    }
}
