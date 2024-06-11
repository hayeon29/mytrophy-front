import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;

const articleAPI = {
  async getArticleList(page = 0, size = 10) {
    return (await api.get(`${API_URL}?page=${page}&size=${size}`)).data;
  },

  async getArticlesByHeader(header: string, page = 1, size = 10) {
    return (
      await api.get(`${API_URL}/headers/${header}?page=${page}&size=${size}`)
    ).data;
  },

  async getArticleDetail(articleId: string) {
    return (await api.get(`${API_URL}/${articleId}`)).data;
  },

  async articleLike(articleId: string) {
    return (await api.post(`${API_URL}/${articleId}/like`)).data;
  },
  async getGameArticleList(appId: string, page: number | null) {
    const url = page
      ? `${API_URL}/appId/${appId}?page=${page}`
      : `${API_URL}/appId/${appId}`;

    return (await api.get(url)).data;
  },
  async getArticleCount() {
    return (await api.get(`${API_URL}/count`)).data;
  },

  async updateArticle(id, articleData) {
    const response = await api.patch(`${API_URL}/${id}`, articleData);
    return response.data;
  },

  async deleteArticle(id) {
    return api.delete(`${API_URL}/${id}`);
  },
};

export default articleAPI;
