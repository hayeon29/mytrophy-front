import api from '@/config/AxiosConfig';
import LocalStorage from '@/constants/LocalStorage';
import { UserGameAchievementList, UserInfo } from '@/types/UserInfo';
import { Get } from '@/utils/axiosMethod';

const API_URL = '/api/members';

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

  async updateMemberProfilePic(fileData: FormData) {
    return api.post(`${API_URL}/files`, fileData);
  },

  async deleteMemberById(id) {
    return api.delete(`${API_URL}/${id}`);
  },

  async getMemberById(memberId: string) {
    return (await api.get(`${API_URL}/${memberId}`)).data;
  },

  async getUserInfo() {
    const token = LocalStorage.getItem('access');
    return Get<UserInfo>(`${API_URL}/get-userinfo`, {
      headers: { access: `${token}` },
    });
  },

  async getUserGame(id: string) {
    const token = LocalStorage.getItem('access');
    return Get(`${API_URL}/${id}/mygames`, {
      headers: { access: `${token}` },
    });
  },

  async getUserGameAchievement(id: string, appId: string) {
    return Get<UserGameAchievementList>(`${API_URL}/${id}/mygames/${appId}`);
  },

  async logout() {
    const token = LocalStorage.getItem('access');
    return api.post(`/logout`, {
      headers: { access: `${token}` },
    });
  },
};

export default membersAPI;
