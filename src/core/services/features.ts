import axios from "axios";
import type { Feature } from "../models/feature";
import type { Response } from "../models/response";

export class FeaturesService {
  getFeaturesForProject(projectId: string) {
    try {
      return axios
        .get<Response<Feature>>(
          `http://localhost:8080/api/v1/projects/${projectId}/features`
        )
        .then((res) => res.data.data);
    } catch (error) {
      console.error("Failed to fetch environments:", error);
    }
  }
}
