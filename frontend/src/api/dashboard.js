import { api } from "./client";

export const getStats = () => api("/api/v1/dashboard/stats");

export const getActivity = () => api("/api/v1/dashboard/activity");
