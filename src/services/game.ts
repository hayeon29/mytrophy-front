import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_GAME_API_URL;

const gameAPI = {
  async getGameDetail(appId: string) {
    return (await api.get(`${API_URL}/${appId}`)).data;
  },

  async getGamePlayerNumber(appId: string) {
    return (await api.get(`${API_URL}/request/players/${appId}`)).data;
  },
  async getGameSimilar(appId: string) {
    return (await api.get(`${API_URL}/category/${appId}`)).data;
  },
};
export default gameAPI;
