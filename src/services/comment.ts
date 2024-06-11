import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_COMMENT_API_URL;

const commentAPI = {
    async createComment(articleId: string, content: string) {
        return (await api.post(`${API_URL}/articles/${articleId}/comments`, { content })).data;
    },

    async updateComment(commentId: string, content: string) {
        return (await api.patch(`${API_URL}/comments/${commentId}`, { content })).data;
    },

    async deleteComment(commentId: string) {
        return (await api.delete(`${API_URL}/comments/${commentId}`)).data;
    }
};

export default commentAPI;