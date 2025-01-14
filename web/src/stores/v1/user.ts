import { create } from "zustand";
import * as api from "../../helpers/api";

const convertResponseModelUser = (user: User): User => {
  return {
    ...user,
    createdTs: user.createdTs * 1000,
    updatedTs: user.updatedTs * 1000,
  };
};

interface UserState {
  userMapById: Record<UserId, User>;
  currentUserId?: UserId;
  fetchUserList: () => Promise<User[]>;
  fetchCurrentUser: () => Promise<User>;
  getOrFetchUserById: (id: UserId) => Promise<User>;
  getUserById: (id: UserId) => User;
  getCurrentUser: () => User;
  createUser: (userCreate: UserCreate) => Promise<User>;
  patchUser: (userPatch: UserPatch) => Promise<void>;
}

const useUserStore = create<UserState>()((set, get) => ({
  userMapById: {},
  fetchUserList: async () => {
    const { data: userList } = await api.getUserList();
    const userMap = get().userMapById;
    userList.forEach((user) => {
      userMap[user.id] = convertResponseModelUser(user);
    });
    set(userMap);
    return userList;
  },
  fetchCurrentUser: async () => {
    const { data } = await api.getMyselfUser();
    const user = convertResponseModelUser(data);
    const userMap = get().userMapById;
    userMap[user.id] = user;
    set({ userMapById: userMap, currentUserId: user.id });
    return user;
  },
  getOrFetchUserById: async (id: UserId) => {
    const userMap = get().userMapById;
    if (userMap[id]) {
      return userMap[id] as User;
    }

    const { data } = await api.getUserById(id);
    const user = convertResponseModelUser(data);
    userMap[id] = user;
    set(userMap);
    return user;
  },
  createUser: async (userCreate: UserCreate) => {
    const { data } = await api.createUser(userCreate);
    const user = convertResponseModelUser(data);
    const userMap = get().userMapById;
    userMap[user.id] = user;
    set(userMap);
    return user;
  },
  patchUser: async (userPatch: UserPatch) => {
    const { data } = await api.patchUser(userPatch);
    const user = convertResponseModelUser(data);
    const userMap = get().userMapById;
    userMap[user.id] = user;
    set(userMap);
  },
  getUserById: (id: UserId) => {
    const userMap = get().userMapById;
    return userMap[id] as User;
  },
  getCurrentUser: () => {
    const userMap = get().userMapById;
    const currentUserId = get().currentUserId;
    return userMap[currentUserId as UserId];
  },
}));

export default useUserStore;
