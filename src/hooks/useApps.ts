import { useState, useEffect } from 'react';
import type { App, CreateAppRequest, UpdateAppRequest } from '../types';
import { appsAPI } from '../utils/api';

export const useApps = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedApps = await appsAPI.getApps();
      setApps(fetchedApps);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch apps');
    } finally {
      setIsLoading(false);
    }
  };

  const createApp = async (appData: CreateAppRequest): Promise<App> => {
    const newApp = await appsAPI.createApp(appData);
    setApps(prev => [...prev, newApp]);
    return newApp;
  };

  const updateApp = async (id: number, appData: UpdateAppRequest): Promise<App> => {
    const updatedApp = await appsAPI.updateApp(id, appData);
    setApps(prev => prev.map(app => app.id === id ? updatedApp : app));
    return updatedApp;
  };

  const deleteApp = async (id: number): Promise<void> => {
    await appsAPI.deleteApp(id);
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const generateScript = async (): Promise<string> => {
    const response = await appsAPI.generateScript();
    return response.data?.script || '';
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return {
    apps,
    isLoading,
    error,
    fetchApps,
    createApp,
    updateApp,
    deleteApp,
    generateScript,
  };
};