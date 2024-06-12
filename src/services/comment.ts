import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_COMMENT_API_URL;

const commentAPI = {
    async createComment(articleId: string, content: string, parentCommentId: number | null = null) {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            throw new Error('No access token found in local storage.');
        }

        let url = `${API_URL}/articles/${articleId}/comments`;
        if (parentCommentId !== null) {
            url += `?parentCommentId=${parentCommentId}`;
        }

        const response = await api.post(
            url,
            { content, parentCommentId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'access': accessToken
                }
            }
        );

        return response.data;
    },

    async updateComment(commentId: string, content: string) {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            throw new Error('No access token found in local storage.');
        }
        const response = await api.patch(`${API_URL}/comments/${commentId}`,
            { content },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'access': accessToken
                }
            }
        );
        return response.data;
    },

    async deleteComment(commentId: string) {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            throw new Error('No access token found in local storage.');
        }
        const response = await api.delete(`${API_URL}/comments/${commentId}`,
            {
                headers: {
                    'access': accessToken
                }
            }
        );
        return response.data;
    },

    async commentLike(commentId: string) {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            throw new Error('No access token found in local storage.');
        }
        const response = await api.post(`${API_URL}/comments/${commentId}/like`, {},
            {
                headers: {
                    'access': accessToken
                }
            }
        );
        return response.data;
    },


};

export default commentAPI;