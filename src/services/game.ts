import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_GAME_API_URL;

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
};
export default gameAPI;
