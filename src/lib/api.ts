import axios from "axios";

export const api = axios.create({
  baseURL: "https://nest-blog-production.up.railway.app/api",
});
