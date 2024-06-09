import api from '../config/AxiosConfig';

const ARTICLE_API_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL;

const articleAPI = {
    async getArticleList(page = 0, size = 10) {
        return (await api.get(`${ARTICLE_API_URL}?page=${page}&size=${size}`)).data;
    },

    async getArticlesByHeader(header: string, page = 1, size = 10, sort = 'cntUp,desc') {
        return (await api.get(`${ARTICLE_API_URL}/headers/${header}`)).data;
    },

    async getMemberById(memberId: number) {
        return (await api.get(`${ARTICLE_API_URL}/members/${memberId}`)).data;
    },

    async articleLike(articleId: number) {
        return (await api.post(`${ARTICLE_API_URL}/${articleId}/like`)).data;
    }
}

export default articleAPI;