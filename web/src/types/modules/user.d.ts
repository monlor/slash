type UserId = number;

type Role = "ADMIN" | "USER";

interface User {
  id: UserId;

  createdTs: TimeStamp;
  updatedTs: TimeStamp;
  rowStatus: RowStatus;

  email: string;
  nickname: string;
  role: Role;
}

interface UserCreate {
  email: string;
  nickname: string;
  password: string;
  role: Role;
}

interface UserPatch {
  id: UserId;

  rowStatus?: RowStatus;
  email?: string;
  nickname?: string;
  password?: string;
  role?: Role;
}

interface UserDelete {
  id: UserId;
}
