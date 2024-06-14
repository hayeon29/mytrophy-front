import api from '../config/AxiosConfig';

const API_URL = '/api/games';

const gameAPI = {
  async getGameDetail(appId: string) {
    return (await api.get(`${API_URL}/${appId}`)).data;
  },

  async getGamePlayerNumber(appId: string) {
    return (await api.get(`${API_URL}/request/players/${appId}`)).data;
  },

  async getGameCount() {
    return (await api.get(`${API_URL}/count`)).data;
  },

  async getGameList(page = 1, size = 10) {
    return (await api.get(`${API_URL}?page=${page}&size=${size}`)).data;
  },

  async updateGameById(id, gameData) {
    const response = await api.patch(`${API_URL}/${id}`, gameData);
    return response.data;
  },

  async deleteGameById(id) {
    return api.delete(`${API_URL}/${id}`);
  },

  async getGameSimilar(appId: string) {
    return (await api.get(`${API_URL}/category/${appId}`)).data;
  },

  async readTopSteamGameData() {
    return (await api.get(`${API_URL}/request/game/top`)).data;
  },

  async readSteamGameData() {
    return (await api.get(`${API_URL}/request/game/detail`)).data;
  },

  async saveDetailSteamGameData() {
    return (await api.get(`${API_URL}/request/game/detail`)).data;
  },

  async readSteamGameDataOne(id) {
    return (await api.get(`${API_URL}/request/game/${id}`)).data;
  },

  async getGameDetailsByRelease(page = 1, size = 10) {
    return (
      await api.get(`${API_URL}/release`, {
        params: {
          page,
          size,
        },
      })
    ).data;
  },

  async getGameDetailsByTop(page = 1, size = 10) {
    return (
      await api.get(`${API_URL}/top100`, {
        params: {
          page,
          size,
        },
      })
    ).data;
  },

  async getGameDetailsByPositive(page = 1, size = 10) {
    return (
      await api.get(`${API_URL}/positive`, {
        params: {
          page,
          size,
        },
      })
    ).data;
  },

  async getFilteredGames(filterData) {
    return (await api.post(`${API_URL}/search`, filterData)).data;
  },

  async getTotalItems() {
    return (await api.get(`${API_URL}/count`)).data;
  },

  async searchGameByName(page = 10, size = 1, keyword: string = '') {
    return (
      await api.post(`${API_URL}/search?page=${page}&size=${size}`, { keyword })
    ).data;
  },

  async getMyRecommendedGames() {
    const accessToken = localStorage.getItem('access');
    return api.get(`${API_URL}/reviews/my-recommended`, {
      headers: {
        access: accessToken,
      },
    });
  },

  async getRecommendedGames(page: number = 0, size: number = 10) {
    const accessToken = localStorage.getItem('access');
    return api.get(`${API_URL}/recommendations`, {
      headers: {
        access: accessToken,
      },
      params: { page, size },
    });
  },
};
export default gameAPI;
