import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApps } from '../hooks/useApps';
import Modal from '../components/Modal';
import AppForm from '../components/AppForm';
import type { App } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { apps, isLoading, error, createApp, updateApp, deleteApp, generateScript } = useApps();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [script, setScript] = useState('');
  const [scriptLoading, setScriptLoading] = useState(false);

  // Popular winget apps list (curated)
  const popularApps: { id: string; name: string }[] = [
    // Editors & IDEs
    { id: 'Microsoft.VisualStudioCode', name: 'Visual Studio Code' },
    { id: 'VSCodium.VSCodium', name: 'VSCodium' },
    { id: 'JetBrains.Toolbox', name: 'JetBrains Toolbox' },
    { id: 'KDE.Kate', name: 'Kate' },
    { id: 'Notepad++.Notepad++', name: 'Notepad++' },

    // Browsers
    { id: 'Google.Chrome', name: 'Google Chrome' },
    { id: 'Mozilla.Firefox', name: 'Mozilla Firefox' },
    { id: 'Microsoft.Edge', name: 'Microsoft Edge' },

    // Developer tooling
    { id: 'Git.Git', name: 'Git' },
    { id: 'GitHub.cli', name: 'GitHub CLI' },
    { id: 'JanDeDobbeleer.OhMyPosh', name: 'Oh My Posh' },
    { id: 'Microsoft.PowerShell', name: 'PowerShell 7' },
    { id: 'GnuWin32.Make', name: 'GNU Make' },
    { id: 'GnuPG.Gpg4win', name: 'Gpg4win' },

    // Package managers & runtimes
    { id: 'ScoopInstaller.Scoop', name: 'Scoop' },
    { id: 'Chocolatey.Chocolatey', name: 'Chocolatey' },
    { id: 'OpenJS.NodeJS.LTS', name: 'Node.js LTS' },
    { id: 'Python.Python.3.12', name: 'Python 3.12' },
    { id: 'GoLang.Go', name: 'Go' },
    { id: 'Rustlang.Rustup', name: 'Rust (rustup)' },
    { id: 'Oracle.JDK.21', name: 'Java JDK 21' },

    // Containers & cloud
    { id: 'Docker.DockerDesktop', name: 'Docker Desktop' },
    { id: 'Kubernetes.kubectl', name: 'kubectl' },
    { id: 'Helm.Helm', name: 'Helm' },
    { id: 'Hashicorp.Terraform', name: 'Terraform' },
    { id: 'Microsoft.AzureCLI', name: 'Azure CLI' },
    { id: 'Amazon.AWSToolsforPowerShell', name: 'AWS Tools for PowerShell' },
    { id: 'Google.CloudSDK', name: 'Google Cloud SDK' },

    // Databases & tools
    { id: 'PostgreSQL.PostgreSQL', name: 'PostgreSQL' },
    { id: 'MongoDB.Compass.Full', name: 'MongoDB Compass' },
    { id: 'DBeaver.DBeaver', name: 'DBeaver' },
    { id: 'HeidiSQL.HeidiSQL', name: 'HeidiSQL' },

    // APIs & testing
    { id: 'Postman.Postman', name: 'Postman' },
    { id: 'Insomnia.Insomnia', name: 'Insomnia' },

    // Utilities
    { id: '7zip.7zip', name: '7-Zip' },
    { id: 'VideoLAN.VLC', name: 'VLC Media Player' },
    { id: 'Microsoft.PowerToys', name: 'PowerToys' },
    { id: 'WinSCP.WinSCP', name: 'WinSCP' },
    { id: 'PuTTY.PuTTY', name: 'PuTTY' },
    { id: 'Microsoft.Sysinternals', name: 'Sysinternals Suite' },
  ];

  const handleAddApp = async (data: any) => {
    await createApp(data);
    setIsAddModalOpen(false);
  };

  const handleEditApp = async (data: any) => {
    if (editingApp) {
      await updateApp(editingApp.id, data);
      setIsEditModalOpen(false);
      setEditingApp(null);
    }
  };

  const handleDeleteApp = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      await deleteApp(id);
    }
  };

  const handleGenerateScript = async () => {
    setScriptLoading(true);
    try {
      const generatedScript = await generateScript();
      setScript(generatedScript);
      setIsScriptModalOpen(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate script');
    } finally {
      setScriptLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    alert('Script copied to clipboard!');
  };

  const downloadScript = () => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup-script.ps1';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      {/* Main Content (sidebar removed) */}
  <div className="main-content no-sidebar">
        {/* Header */}
        <div className="header">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {user?.email}</span>
            <button onClick={logout} className="btn btn-ghost">
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <div className="container">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Applications</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleGenerateScript}
                  className="btn btn-secondary"
                  disabled={apps.length === 0 || scriptLoading}
                >
                  {scriptLoading ? <div className="spinner"></div> : '📄 Generate Script'}
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary"
                >
                  ➕ Add App
                </button>
              </div>
            </div>

            {/* Apps List */}
            {isLoading ? (
              <div className="flex justify-center items-center loading-center">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : apps.length === 0 ? (
              <div className="card text-center">
                <h3 className="text-lg font-semibold mb-4">No apps added yet</h3>
                <p className="text-gray-500 mb-6">
                  Start by adding your first application to create installation scripts.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary"
                >
                  ➕ Add Your First App
                </button>
              </div>
            ) : (
              <div className="apps-grid">
                {apps.map((app) => (
                  <div key={app.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{app.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingApp(app);
                            setIsEditModalOpen(true);
                          }}
                          className="btn btn-ghost text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteApp(app.id)}
                          className="btn btn-ghost text-sm text-red-500"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="text-sm space-y-2">
                      {app.winget_id && (
                        <div>
                          <span className="font-medium">Winget ID:</span> {app.winget_id}
                        </div>
                      )}
                      {app.download_url && (
                        <div>
                          <span className="font-medium">Download URL:</span>{' '}
                          <a
                            href={app.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {app.download_url.length > 50
                              ? app.download_url.substring(0, 50) + '...'
                              : app.download_url}
                          </a>
                        </div>
                      )}
                      {app.args && (
                        <div>
                          <span className="font-medium">Arguments:</span> {app.args}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Popular Apps Section */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-3">Popular Apps</h2>
              <p className="text-gray-500 mb-3">Quick add your favorites with one click.</p>
              <div className="apps-grid popular-apps-grid">
                {popularApps.map((p) => (
                  <div key={p.id} className="card flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.id}</div>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={async () => {
                        await handleAddApp({ name: p.name, winget_id: p.id });
                      }}
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add App Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New App"
      >
        <AppForm
          onSubmit={handleAddApp}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit App Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingApp(null);
        }}
        title="Edit App"
      >
        <AppForm
          app={editingApp || undefined}
          onSubmit={handleEditApp}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingApp(null);
          }}
        />
      </Modal>

      {/* Script Modal */}
      <Modal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        title="Generated PowerShell Script"
      >
        <div className="mb-4">
          <textarea
            value={script}
            readOnly
            className="input script-textarea"
            rows={15}
            placeholder="Generated PowerShell script will appear here"
            title="Generated PowerShell Script"
          />
        </div>
        <div className="flex gap-4">
          <button onClick={copyToClipboard} className="btn btn-secondary">
            📋 Copy to Clipboard
          </button>
          <button onClick={downloadScript} className="btn btn-primary">
            💾 Download Script
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;