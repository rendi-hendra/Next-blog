import axios from "axios";

export const api = axios.create({
  baseURL: "https://nest-blog-production.up.railway.app/api",
  // baseURL: "http://localhost:8080/api",
});
