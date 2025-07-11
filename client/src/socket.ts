import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(API_BASE_URL); // your backend URL
export default socket;
