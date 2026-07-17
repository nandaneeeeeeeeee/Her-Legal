import { api } from "./client";

export const getStats = () => api("/dashboard/stats");

export const getActivity = () => api("/dashboard/activity");
