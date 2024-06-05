import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_GAME_API_URL;

const gamesAPI = {
  async getGameDetailsByRelease(page = 1,size = 10) {
    return (await api.get(`${API_URL}/release`, {
      params: {
        page,
        size
      }
    })).data;
  },
  async getGameDetailsByTop(page = 1,size = 10) {
      return (await api.get(`${API_URL}/top100`, {
        params: {
          page,
          size
        }
      })).data;
    }
};

export default gamesAPI;