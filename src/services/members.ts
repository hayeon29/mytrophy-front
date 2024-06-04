import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_MEMBER_API_URL;

const membersAPI = {
  async isMemberExist(username: string) {
    // userId 대신 username 사용
    return (await api.get(`${API_URL}/checkUsername`, { params: { username } }))
      .data;
  },

  async signUp(form: { [key: string]: string }) {
    const { checkPassword: string, ...otherInfo } = form;
    return (await api.post(`${API_URL}/signup`, otherInfo)).data;
  },
};

export default membersAPI;
