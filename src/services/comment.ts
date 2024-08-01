import LocalStorage from '@/constants/LocalStorage';
import { handleAxiosError } from '@/utils/handleAxiosError';
import api from '../config/AxiosConfig';

const API_URL = '/api';

const commentAPI = {
  async createComment({
    articleId,
    content,
    parentCommentId,
  }: {
    articleId: string;
    content: string;
    parentCommentId?: number;
  }) {
    const accessToken = LocalStorage.getItem('access');

    if (!accessToken) {
      handleAxiosError(new Error('No access token found in local storage.'));
    }

    const url = `${API_URL}/articles/${articleId}/comments${parentCommentId !== undefined ? `?parentCommentId=${parentCommentId}` : ``}`;

    return api.post(
      url,
      { content, parentCommentId },
      {
        headers: {
          access: accessToken,
        },
      }
    );
  },

  async updateComment(commentId: string, content: string) {
    const accessToken = LocalStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token found in local storage.');
    }
    return api.patch(
      `${API_URL}/comments/${commentId}`,
      { content },
      {
        headers: {
          access: accessToken,
        },
      }
    );
  },

  async deleteComment(commentId: string) {
    const accessToken = LocalStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token found in local storage.');
    }
    return api.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        access: accessToken,
      },
    });
  },

  async commentLike(commentId: string) {
    const accessToken = LocalStorage.getItem('access');

    if (!accessToken) {
      handleAxiosError(new Error('No access token found in local storage.'));
    }

    return api.post(
      `${API_URL}/comments/${commentId}/like`,
      {},
      {
        headers: {
          access: accessToken,
        },
      }
    );
  },
};

export default commentAPI;
