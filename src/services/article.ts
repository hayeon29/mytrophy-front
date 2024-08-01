import api from '@/config/AxiosConfig';

const API_URL = '/api/articles';

const articleAPI = {
  async getArticleList(
    page = 1,
    size = 10,
    memberId?: string,
    cntUp?: boolean
  ) {
    let url = `${API_URL}?page=${page}&size=${size}`;
    if (memberId) {
      url += `&memberId=${memberId}`;
    }
    if (cntUp) {
      url += `&cntUp=true`;
    }
    return (await api.get(url)).data;
  },

  async getArticlesByHeader(header: string, page = 1, size = 10) {
    return (
      await api.get(`${API_URL}/headers/${header}?page=${page}&size=${size}`)
    ).data;
  },

  async getArticleDetail(articleId: string) {
    return api.get(`${API_URL}/${articleId}`);
  },

  async like(articleId: string) {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token found in local storage.');
    }
    return api.post(
      `${API_URL}/${articleId}/like`,
      {},
      {
        headers: {
          access: accessToken,
        },
      }
    );
  },

  articleCreate: async ({
    header,
    name,
    content,
    appId,
    imagePath,
  }: {
    header: string;
    name: string;
    content: string;
    appId: string;
    imagePath?: string;
  }) => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token found in local storage.');
    }
    const response = await api.post(
      `${API_URL}`,
      { header, name, content, appId, imagePath },
      {
        headers: {
          'Content-Type': 'application/json',
          'access': accessToken,
        },
      }
    );
    return response.data;
  },

  async articleUpdate(
    articleId: string,
    header,
    name,
    content,
    appId,
    imagePath
  ) {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token found in local storage.');
    }
    const response = await api.patch(
      `${API_URL}/${articleId}`,
      { header, name, content, appId, imagePath },
      {
        headers: {
          'Content-Type': 'application/json',
          'access': accessToken,
        },
      }
    );
    return response.data;
  },

  async articleFileUpload(formData: FormData) {
    const response = await api.post<string[]>(`${API_URL}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async articleDelete(articleId: string) {
    return (await api.delete(`${API_URL}/${articleId}`)).data;
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

  async getLikedArticlesByMemberId(memberId: string, page = 1, size = 10) {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token found in local storage.');
    }

    const response = await api.get(
      `${API_URL}/liked/${memberId}?page=${page}&size=${size}`,
      {
        headers: {
          access: accessToken,
        },
      }
    );

    return response.data;
  },

  async getTopArticles(page = 0, size = 3, cntUp = true) {
    return api.get(`${API_URL}`, {
      params: { page, size, cntUp },
    });
  },

  async getArticlesByKeyword({
    target,
    keyword,
    page = 0,
    size = 10,
  }: {
    target: string;
    keyword: string;
    page?: number;
    size?: number;
  }) {
    return api.get(
      `${API_URL}/keyword-search?target=${target}&keyword=${keyword}&page=${page}&size=${size}`
    );
  },
};

export default articleAPI;
