import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_GAME_API_URL;

const gamesAPI = {
  async getGameDetails(page = 1,size = 9) {
    return (await api.get(`${API_URL}`, {
      params: {
        page,
        size
      }
    })).data;
  }
};

export default gamesAPI;