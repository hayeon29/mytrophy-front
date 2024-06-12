import { Post } from '@/utils/axiosMethod';

const authAPI = {
  async reissue() {
    return Post(`/api/reissue`);
  },
};

export default authAPI;
