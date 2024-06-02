import api from '.';

const API_URL = '/api/members';

const membersAPI = {
  async isMemberExist(userId: string) {
    return (await api.get(`${API_URL}/checkUsername?username=${userId}`)).data;
  },

  async signUp(form: { [key: string]: string }) {
    const { checkPassword: string, ...otherInfo } = form;
    return (await api.post(`${API_URL}/signup`, { otherInfo })).data;
  },
};

export default membersAPI;
