import React, { useState, useEffect } from 'react';
import type { App, CreateAppRequest, UpdateAppRequest, WingetSearchResult } from '../types';
import { wingetAPI } from '../utils/api';

interface AppFormProps {
  app?: App;
  onSubmit: (data: CreateAppRequest | UpdateAppRequest) => Promise<void>;
  onCancel: () => void;
}

const AppForm: React.FC<AppFormProps> = ({ app, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [wingetId, setWingetId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [args, setArgs] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<WingetSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (app) {
      setName(app.name || '');
      setWingetId(app.winget_id || '');
      setDownloadUrl(app.download_url || '');
      setArgs(app.args || '');
    }
  }, [app]);

  // Fetch winget suggestions when user types a name and wingetId is empty
  useEffect(() => {
    const q = name.trim();
    if (!q || wingetId.trim()) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    wingetAPI
      .search(q)
      .then((res) => {
        if (!cancelled) setSuggestions(res.slice(0, 5));
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [name, wingetId]);

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is allowed
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('App name is required');
      return;
    }

    if (!wingetId.trim() && !downloadUrl.trim()) {
      setError('Either Winget ID or Download URL is required');
      return;
    }

    if (downloadUrl && !validateUrl(downloadUrl)) {
      setError('Download URL must be a valid HTTPS URL');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        winget_id: wingetId.trim() || undefined,
        download_url: downloadUrl.trim() || undefined,
        args: args.trim() || undefined,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save app');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="label">
          App Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="e.g., Visual Studio Code"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="wingetId" className="label">
          Winget ID
        </label>
        <input
          id="wingetId"
          type="text"
          value={wingetId}
          onChange={(e) => setWingetId(e.target.value)}
          className="input"
          placeholder="e.g., Microsoft.VisualStudioCode"
          disabled={isLoading}
        />
        <div className="text-sm text-gray-500 mt-1">
          Optional. Use this for winget installation.
        </div>
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-2 border rounded p-2 bg-white shadow-sm">
            <div className="text-sm font-medium mb-1">Suggestions {isSearching && <span className="text-gray-400">(searching...)</span>}</div>
            <ul className="space-y-1">
              {suggestions.map((sug) => (
                <li key={sug.id} className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-mono">{sug.id}</div>
                    <div className="text-gray-600">{sug.name}{sug.publisher ? ` · ${sug.publisher}` : ''}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setWingetId(sug.id)}
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="downloadUrl" className="label">
          Download URL
        </label>
        <input
          id="downloadUrl"
          type="url"
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
          className="input"
          placeholder="https://example.com/app.exe"
          disabled={isLoading}
        />
        <div className="text-sm text-gray-500 mt-1">
          Optional. HTTPS URL for direct download. Used when Winget ID is not available.
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="args" className="label">
          Installation Arguments
        </label>
        <input
          id="args"
          type="text"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          className="input"
          placeholder="e.g., /S /VERYSILENT"
          disabled={isLoading}
        />
        <div className="text-sm text-gray-500 mt-1">
          Optional. Additional arguments for installation.
        </div>
      </div>

      {error && <div className="error-text mb-4">{error}</div>}

      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={isLoading}
        >
          {isLoading ? <div className="spinner"></div> : (app ? 'Update App' : 'Add App')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppForm;