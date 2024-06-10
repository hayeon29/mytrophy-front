import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;

const articlesAPI = {
  async getArticleCount() {
    return (await api.get(`${API_URL}/count`)).data;
  },
  async getArticleList(page = 0, size = 10) {
    return (await api.get(`${API_URL}?page=${page}&size=${size}`)).data;
  },
};

export default articlesAPI;
