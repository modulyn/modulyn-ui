import axios from "axios";
import type { Project } from "../models/project";
import type { Response } from "../models/response";
import type { CreateResponse } from "../models/create-response";

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

  createProject(name: string) {
    try {
      return axios
        .post<CreateResponse>("http://localhost:8080/api/v1/projects", {
          name: name,
        })
        .then((res) => res.data.data);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  }
}
