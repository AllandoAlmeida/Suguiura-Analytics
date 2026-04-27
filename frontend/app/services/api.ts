import axios from 'axios';

export const API_BASE_URL = "http://localhost:3009";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});