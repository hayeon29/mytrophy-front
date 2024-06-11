import api from '@/config/AxiosConfig';

const ARTICLE_API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;
const MEMBER_API_URL = process.env.NEXT_PUBLIC_MEMBER_API_URL;

const articleAPI = {
    async getArticleList(page = 0, size = 10) {
        return (await api.get(`${ARTICLE_API_URL}?page=${page}&size=${size}`)).data;
    },

    async getArticlesByHeader(header: string, page = 1, size = 10) {
        return (await api.get(`${ARTICLE_API_URL}/headers/${header}?page=${page}&size=${size}`)).data;
    },

    async getArticleDetail(articleId: string) {
        return (await api.get(`${ARTICLE_API_URL}/${articleId}`)).data;
    },

    async articleLike(articleId: string) {
        return (await api.post(`${ARTICLE_API_URL}/${articleId}/like`)).data;
    },

    async articleCreate(header: string, name: string, content: string, appId: number, imagePath: string[]) {
        return (await api.post(`${ARTICLE_API_URL}`, { header, name, content, appId, imagePath })).data;
    },

    async articleFileUpload(formData: FormData) {
        try {
            const response = await api.post<string[]>(`${ARTICLE_API_URL}/files`, formData, {
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
        return (await api.delete(`${ARTICLE_API_URL}/${articleId}`)).data;
    }

}

export default articleAPI;