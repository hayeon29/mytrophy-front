import api from '../config/AxiosConfig';

const GAME_API = process.env.NEXT_PUBLIC_GAME_API_URL;
const ARTICLE_API = process.env.NEXT_PUBLIC_ARTICLE_API_URL;

const homeAPI = {
  async topGames(page = 1, size = 10) {
    return api.get(`${GAME_API}/top100`, {
      params: { page, size },
    });
  },

  async topArticles(page = 0, size = 3, sort = 'cntUp,desc') {
    return api.get(`${ARTICLE_API}`, {
      params: { page, size, sort },
    });
  },

  async getGameByAppId(appId: number) {
    return api.get(`${GAME_API}/${appId}`);
  },

  async submitReview(appId: number, reviewStatus: string) {
    const accessToken = localStorage.getItem('access');
    return api.post(
      `${GAME_API}/${appId}/reviews`,
      { reviewStatus },
      {
        headers: {
          access: accessToken,
        },
      }
    );
  },

  async getMyReview(appId: number) {
    const accessToken = localStorage.getItem('access');
    return api.get(`${GAME_API}/${appId}/myreview`, {
      headers: {
        access: accessToken,
      },
    });
  },

  async getMyRecommendedGames() {
    const accessToken = localStorage.getItem('access');
    return api.get(`${GAME_API}/reviews/myrecommended`, {
      headers: {
        access: accessToken,
      },
    });
  },
};

export default homeAPI;
