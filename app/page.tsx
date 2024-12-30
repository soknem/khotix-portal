'use client';

import { useState } from 'react';
import axios from 'axios';

type ApiService = {
  baseEndpoint: string;
  getEndpoint: string;
  postEndpoint: string;
  putEndpoint: string;
  patchEndpoint: string;
  deleteEndpoint: string;
  postBody: string;
  putBody: string;
  patchBody: string;
  getResult: string;
  postResult: string;
  putResult: string;
  patchResult: string;
  deleteResult: string;
  method: string;
  file: File | null;
};

const ApiTestPage: React.FC = () => {
  const [service, setService] = useState<ApiService>({
    baseEndpoint: '',
    getEndpoint: '',
    postEndpoint: '',
    putEndpoint: '',
    patchEndpoint: '',
    deleteEndpoint: '',
    postBody: '',
    putBody: '',
    patchBody: '',
    getResult: '',
    postResult: '',
    putResult: '',
    patchResult: '',
    deleteResult: '',
    method: '',
    file: null,
  });

  const [useFile, setUseFile] = useState(false); // Toggle between JSON body and file upload
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setService((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setService((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleTest = async (method: string) => {
    const url = `${service.baseEndpoint}${service[`${method}Endpoint` as keyof ApiService]}`;
    let data: any = {};
    const headers: any = { 'Content-Type': 'application/json' };

    if (['post', 'put', 'patch'].includes(method)) {
      if (useFile && service.file) {
        const formData = new FormData();
        formData.append('file', service.file);
        data = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        try {
          data = JSON.parse(service[`${method}Body` as keyof ApiService] || '{}');
        } catch {
          setService((prev) => ({
            ...prev,
            [`${method}Result`]: 'Invalid JSON in request body',
          }));
          return;
        }
      }
    }

    try {
      let response: any;
      switch (method) {
        case 'get':
          response = await axios.get(url, { headers });
          break;
        case 'post':
          response = await axios.post(url, data, { headers });
          break;
        case 'put':
          response = await axios.put(url, data, { headers });
          break;
        case 'patch':
          response = await axios.patch(url, data, { headers });
          break;
        case 'delete':
          response = await axios.delete(url, { headers });
          break;
        default:
          return;
      }
      setService((prev) => ({
        ...prev,
        [`${method}Result`]: JSON.stringify(response.data, null, 2),
      }));
    } catch (error: any) {
      setService((prev) => ({
        ...prev,
        [`${method}Result`]: `Error: ${error.response?.data?.message || error.message}`,
      }));
    }
  };

  const handleLogin = () => {
    window.location.href = '/oauth2/authorization/nextjs';
    setMessage('Redirecting to login...');
  };

  const handleLogout = async () => {
    try {
      setMessage('Logging out...');

      // Send a POST request to the gateway logout endpoint
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if (response.ok) {
        // Redirect to the login page or homepage after successful logout
        window.location.href = '/login';
      } else {
        // Handle failed logout
        setMessage('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setMessage('An error occurred during logout. Please try again.');
    }
  };


  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative">
        <div className="absolute top-4 right-8 flex gap-1">
          <button onClick={handleLogin} className="py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
            Login
          </button>
          <button onClick={handleLogout} className="py-2 px-4 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white">
            Logout
          </button>
        </div>

        {message && (
            <div className="absolute top-16 right-4 bg-green-500 text-white p-2 rounded-lg">
              {message}
            </div>
        )}

        <div className="w-full xl:max-w-6xl bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Dynamic API Test</h1>

          <div className="bg-gray-100 p-4 rounded-lg">
            <label className="block text-sm font-medium text-black">Base Endpoint</label>
            <input
                type="text"
                value={service.baseEndpoint}
                onChange={(e) => handleChange(e, 'baseEndpoint')}
                className="mt-1 w-full p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 outline-none border-none"
                placeholder="Enter Base URL"
            />
          </div>

          {['get', 'post', 'put', 'patch', 'delete'].map((method) => (
              <div
                  key={method}
                  className={`p-4 rounded-lg shadow-sm space-y-4 ${
                      method === 'get'
                          ? 'bg-green-100'
                          : method === 'post'
                              ? 'bg-blue-100'
                              : method === 'put'
                                  ? 'bg-orange-100'
                                  : method === 'patch'
                                      ? 'bg-yellow-100'
                                      : 'bg-red-100'
                  }`}
              >
                <button
                    onClick={() => handleTest(method)}
                    className={`py-2 px-4 rounded-lg text-white min-w-[200px] transition duration-200 ease-in-out ${
                        method === 'get'
                            ? 'bg-green-500 hover:bg-green-600'
                            : method === 'post'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : method === 'put'
                                    ? 'bg-orange-500 hover:bg-orange-600'
                                    : method === 'patch'
                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                  {method.toUpperCase()} Test
                </button>

                <input
                    type="text"
                    value={service[`${method}Endpoint` as keyof ApiService]}
                    onChange={(e) => handleChange(e, `${method}Endpoint`)}
                    className="w-full p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 outline-none border-none"
                    placeholder={`Enter '${method.toUpperCase()}' endpoint`}
                />

                {['post', 'put', 'patch'].includes(method) && (
                    <div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            checked={useFile}
                            onChange={() => setUseFile(!useFile)}
                        />
                        <span className={"text-gray-800"}>Use File Upload</span>
                      </label>
                      {useFile ? (
                          <input
                              type="file"
                              onChange={handleFileChange}
                              className="w-full p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none border-none"
                          />
                      ) : (
                          <textarea
                              value={service[`${method}Body` as keyof ApiService]}
                              onChange={(e) => handleChange(e, `${method}Body`)}
                              className="w-full p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 outline-none border-none"
                              placeholder="Enter JSON body"
                              rows={4}
                          />
                      )}
                    </div>
                )}

                <pre
                    className="text-black bg-gray-100 p-4 rounded-lg overflow-auto"
                    style={{
                      minHeight: '150px',
                      maxHeight: '400px',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                    }}
                >
              {typeof service[`${method}Result` as keyof ApiService] === 'object'
                  ? JSON.stringify(service[`${method}Result` as keyof ApiService], null, 2)
                  : service[`${method}Result` as keyof ApiService]}
            </pre>
              </div>
          ))}
        </div>
      </div>
  );
};

export default ApiTestPage;
