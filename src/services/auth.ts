import api from '@/config/AxiosConfig';

const authAPI = {
  async reissue() {
    return api.post(`/api/reissue`);
  },
};

export default authAPI;
