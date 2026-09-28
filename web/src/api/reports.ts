import { apiClient } from './client';
import { Report, ReportCreate } from '../types';

export const reportsApi = {
  createReport: async (report: ReportCreate): Promise<Report> => {
    const response = await apiClient.post<Report>('/reports', report);
    return response.data;
  }
};
