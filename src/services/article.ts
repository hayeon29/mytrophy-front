import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;

const articleAPI = {
  async getGameArticleList(appId: string, page: string | null) {
    const url = page
      ? `${API_URL}/appId/${appId}?page=${page}`
      : `${API_URL}/appId/${appId}`;

    return (await api.get(url)).data;
  },
};

export default articleAPI;
