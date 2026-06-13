export interface IUser {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}


export interface RegisterPayload  {
  name?: string | null;
  email: string | null;
  password?: string | null;
  imageUrl?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

