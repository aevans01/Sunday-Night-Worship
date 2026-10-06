import Axios from 'axios';
import { fetchAllPhotos } from './photosApi';
jest.mock('axios', () => ({ get: jest.fn() }));
test('gallery fetches all bounded photo pages in order', async () => {
    Axios.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] })
        .mockResolvedValueOnce({ data: [{ id: 3 }] });
    expect(await fetchAllPhotos()).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(Axios.get).toHaveBeenNthCalledWith(1, '/api/getPhotos', { params: { limit: 2, offset: 0 } });
    expect(Axios.get).toHaveBeenNthCalledWith(2, '/api/getPhotos', { params: { limit: 2, offset: 2 } });
});
