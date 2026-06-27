import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { IUser, LoginPayload, RegisterPayload } from "@/types/user.types";

class AuthService {
  register = async (payload: RegisterPayload): Promise<ApiResponse<IUser>> => {
    const res = await api.post<ApiResponse<IUser>>("/user/register", payload);

    return res.data;
  };

  login = async (payload: LoginPayload): Promise<ApiResponse<IUser>> => {
    const res = await api.post<ApiResponse<IUser>>("/user/login", payload);

    return res.data;
  };

  google = async (payload: RegisterPayload): Promise<ApiResponse<IUser>> => {
    const res = await api.post<ApiResponse<IUser>>("/user/google", payload);

    return res.data;
  };

  logout = async (): Promise<ApiResponse<null>> => {
    const res = await api.get<ApiResponse<null>>("/user/logout");

    return res.data;
  };

  getMe = async (): Promise<ApiResponse<IUser>> => {
    const res = await api.get<ApiResponse<IUser>>("/user/me");

    return res.data;
  };

  refreshToken = async (refreshToken: string): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>("/user/refresh-token", {
      refreshToken,
    });

    return res.data;
  };

  forgotPassword = async ({email}: {email: string}): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>("/user/forgot-password", {
      email
    });

    return res.data;
  };

  resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>("/user/reset-password", {
      email,
      otp,
      newPassword,
    });

    return res.data;
  };

  updateProfile = async (formData: FormData): Promise<ApiResponse<IUser>> => {
    const res = await api.post<ApiResponse<IUser>>(
      "/user/update-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  };
}

export const authService = new AuthService();
