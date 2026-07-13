import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { createRepoPayload, IRepository, RepoStatus } from "@/types/repo.types";

class RepoService {
  createRepo = async (payload: createRepoPayload) => {
    const res = await api.post<ApiResponse<IRepository>>(
      "/repo/create",
      payload,
    );

    return res.data;
  };

  getRepo = async (page = 1, limit = 10, search:string = "") => {
    const res = await api.get("/repo/my-repos", {
      params: {
        page,
        limit,
        search,
      },
    });

    return res.data;
  };

  getRepoStatus = async (id: string) => {
    const res = await api.get<ApiResponse<RepoStatus>>(`/repo/status/${id}`);

    return res.data;
  };

  deleteRepo = async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/repo/delete/${id}`);
    return res.data;
  };
}

export default new RepoService();
