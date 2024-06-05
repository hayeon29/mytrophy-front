import api from '../config/AxiosConfig';

const API_URL = process.env.NEXT_PUBLIC_MEMBER_API_URL;

const membersAPI = {
  async isMemberExist(userId: string) {
    return api.get(`${API_URL}/checkUsername?username=${userId}`);
  },

  async signUp(form: { [key: string]: string }) {
    const { checkPassword: string, ...otherInfo } = form;
    return api.post(`${API_URL}/signup`, otherInfo);
  },
};

export default membersAPI;
