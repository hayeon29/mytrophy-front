import api from '../config/AxiosConfig';

const MEMBER_API_URL = process.env.NEXT_PUBLIC_MEMBER_API_URL;
const ARTICLE_API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;
const GAME_API_URL = process.env.NEXT_PUBLIC_GAME_API_URL;

const adminAPI = {
  async getMemberCount() {
    return (await api.get(`${MEMBER_API_URL}/count`)).data;
  },
  async getArticleCount() {
    return (await api.get(`${ARTICLE_API_URL}/count`)).data;
  },
  async getGameCount() {
    return (await api.get(`${GAME_API_URL}/count`)).data;
  },
  async getMemberList() {
    return (await api.get(`${MEMBER_API_URL}/list`)).data;
  },
  async getArticleList(page = 0, size = 10) {
    return (await api.get(`${ARTICLE_API_URL}?page=${page}&size=${size}`)).data;
  },
  async getGameList(page = 1, size = 10) {
    return (await api.get(`${GAME_API_URL}?page=${page}&size=${size}`)).data;
  },
};

export default adminAPI;
