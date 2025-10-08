import axios from "axios";
import type { Response } from "../models/response";
import type { Environment } from "../models/environment";

export class EnvironmentsService {
  getEnvironments(projectId: string) {
    try {
      return axios
        .get<Response<Environment>>(
          `http://localhost:8080/api/v1/projects/${projectId}/environments`
        )
        .then((res) => res.data.data);
    } catch (error) {
      console.error("Failed to fetch environments:", error);
    }
  }
}
