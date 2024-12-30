'use client'

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setService((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleTest = async (method: string) => {
    const url = `${service.baseEndpoint}${service[`${method}Endpoint` as keyof ApiService]}`;
    const headers = { 'Content-Type': 'application/json' };
    let body = {};

    if (method === 'post') body = JSON.parse(service.postBody || '{}');
    if (method === 'put') body = JSON.parse(service.putBody || '{}');
    if (method === 'patch') body = JSON.parse(service.patchBody || '{}');

    try {
      let response: any;
      switch (method) {
        case 'get':
          response = await axios.get(url, { headers });
          setService((prev) => ({ ...prev, getResult: JSON.stringify(response?.data, null, 2) }));
          break;
        case 'post':
          response = await axios.post(url, body, { headers });
          setService((prev) => ({ ...prev, postResult: JSON.stringify(response?.data, null, 2) }));
          break;
        case 'put':
          response = await axios.put(url, body, { headers });
          setService((prev) => ({ ...prev, putResult: JSON.stringify(response?.data, null, 2) }));
          break;
        case 'patch':
          response = await axios.patch(url, body, { headers });
          setService((prev) => ({ ...prev, patchResult: JSON.stringify(response?.data, null, 2) }));
          break;
        case 'delete':
          response = await axios.delete(url, { headers });
          setService((prev) => ({ ...prev, deleteResult: JSON.stringify(response?.data, null, 2) }));
          break;
        default:
          break;
      }
    } catch (error: any) {
      setService((prev) => ({
        ...prev,
        [method + 'Result']: `Error: ${error.response?.data?.message || error.message}`
      }));
    }
  };

  const handleLogin = async () => {
    const url = `${service.baseEndpoint}/login`;
    const body = JSON.parse(service.postBody || '{}');
    try {
      const response = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
      setService((prev) => ({ ...prev, postResult: JSON.stringify(response?.data, null, 2) }));
    } catch (error: any) {
      setService((prev) => ({
        ...prev,
        postResult: `Error: ${error.response?.data?.message || error.message}`
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative">
      {/* Login Button - Positioned Top Right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogin}
          className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
        >
          Login
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">API Test</h1>

        {/* Base Endpoint Section */}
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

        {/* HTTP Methods Section */}
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
            {/* Method Button */}
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

            {/* Method Endpoint Input */}
            <input
              type="text"
              value={service[`${method}Endpoint` as keyof ApiService]}
              onChange={(e) => handleChange(e, `${method}Endpoint`)}
              className="w-full p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 outline-none border-none"
              placeholder={`Enter '${method.toUpperCase()}' endpoint`}
            />

            {/* Body Input for POST, PUT, PATCH */}
            {['post', 'put', 'patch'].includes(method) && (
              <textarea
                value={service[`${method}Body` as keyof ApiService]}
                onChange={(e) => handleChange(e, `${method}Body`)}
                className="w-full p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 outline-none border-none"
                placeholder="Enter request body (JSON)"
                rows={4}
              />
            )}

            {/* Response Result */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <label className="block text-sm font-medium text-black">Response</label>
              <pre
                className="text-black bg-gray-100 p-4 rounded-lg overflow-hidden"
                style={{
                  maxHeight: '200px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {service[`${method}Result` as keyof ApiService]}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTestPage;
