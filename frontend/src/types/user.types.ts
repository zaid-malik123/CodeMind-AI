export interface IUser {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}


export interface RegisterPayload  {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

