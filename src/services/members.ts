import api from '@/config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_MEMBER_API_URL;

const membersAPI = {
  async isMemberExist(userId: string) {
    return api.get(`${API_URL}/checkUsername?username=${userId}`);
  },

  async signUp(form: { [key: string]: string }) {
    const { checkPassword: string, ...otherInfo } = form;
    return api.post(`${API_URL}/signup`, otherInfo);

  },

  async login(form: { [key: string]: string }) {
    return api.post(`/api/login`, form);
  },

  async getMemberCount() {
    return (await api.get(`${API_URL}/count`)).data;
  },

  async getMemberList(page = 0, size = 10) {
    return (await api.get(`${API_URL}/list?page=${page}&size=${size}`)).data;
  },

  async updateMemberById(id, memberData) {
    const response = await api.patch(`${API_URL}/${id}`, memberData);
    return response.data;
  },

  async deleteMemberById(id) {
    return api.delete(`${API_URL}/${id}`);
  },

  async getMemberById(memberId: string) {
    return (await api.get(`${API_URL}/${memberId}`)).data;
  }
};

export default membersAPI;
