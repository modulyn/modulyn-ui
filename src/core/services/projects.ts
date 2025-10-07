import axios from "axios";
import type { Project } from "../models/project";
import type { Response } from "../models/response";

export class ProjectsService {
  getProjects() {
    // make api request to fetch projects
    try {
      return axios
        .get<Response<Project[]>>("http://localhost:8080/api/v1/projects")
        .then((res) => res.data.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }
}
