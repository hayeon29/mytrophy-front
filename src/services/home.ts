import api from '../config/AxiosConfig';

const URL = process.env.NEXT_PUBLIC_BACK_URL;

const homeAPI = {
  async topGames(page = 1, size = 10) {
    return api.get(`${URL}/api/games/top100`, {
      params: { page, size },
    });
  },

  async topArticles(page = 1, size = 3, sort = 'cntUp,desc') {
    return api.get(`${URL}/api/articles`, {
      params: { page, size, sort },
    });
  },
};

export default homeAPI;
