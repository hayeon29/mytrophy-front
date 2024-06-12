import api from '@/config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;

const articleAPI = {
    async getArticleList(page = 0, size = 10) {
        return (await api.get(`${API_URL}?page=${page}&size=${size}`)).data;
    },

    async getArticlesByHeader(header: string, page = 1, size = 10) {
        return (await api.get(`${API_URL}/headers/${header}?page=${page}&size=${size}`)).data;
    },

    async getArticleDetail(articleId: string) {
        return (await api.get(`${API_URL}/${articleId}`)).data;
    },

    async articleLike(articleId: string) {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            throw new Error('No access token found in local storage.');
        }
        const response = await api.post(`${API_URL}/${articleId}/like`, {},
            {
                headers: {
                    'access': accessToken
                }
            }
        );
        return response.data;
    },

    articleCreate: async (header, name, content, appId, imagePath) => {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            throw new Error('No access token found in local storage.');
        }
        const response = await api.post(`${API_URL}`,
            { header, name, content, appId, imagePath },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'access': accessToken
                }
            }
        );
        return response.data;
    },

  async articleCreate(
    header: string,
    name: string,
    content: string,
    appId: number,
    imagePath: string[]
  ) {
    return (
      await api.post(`${API_URL}`, {
        header,
        name,
        content,
        appId,
        imagePath,
      })
    ).data;
  },

    async articleUpdate(articleId: string, header, name, content, appId, imagePath) {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            throw new Error('No access token found in local storage.');
        }
        const response = await api.patch(`${ARTICLE_API_URL}/${articleId}`,
            { header, name, content, appId, imagePath },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'access': accessToken
                }
            })
        return response.data;
    },

    async articleFileUpload(formData: FormData) {
        try {
            const response = await api.post<string[]>(`${API_URL}/files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
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
};

export default articleAPI;