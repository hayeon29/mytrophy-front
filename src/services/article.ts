import api from '@/config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;

const articleAPI = {
  async getArticleList(page = 1, size = 10, memberId?: string, cntUp?: boolean) {
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
    return (await api.get(`${API_URL}/${articleId}`)).data;
  },

  async articleLike(articleId: string) {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token found in local storage.');
    }
    const response = await api.post(
      `${API_URL}/${articleId}/like`,
      {},
      {
        headers: {
          access: accessToken,
        },
      }
    );
    return response.data;
  },

  articleCreate: async (header, name, content, appId, imagePath) => {
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
            'access': accessToken,
          },
        }
    );

    return response.data;
  },
};

export default articleAPI;
