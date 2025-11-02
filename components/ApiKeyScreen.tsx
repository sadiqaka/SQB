
import React, { useState } from 'react';
import Card from './Card';

interface ApiKeyScreenProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 10) { // Basic validation
      onSubmit(apiKey.trim());
    } else {
      setError('يرجى إدخال مفتاح API صالح.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
       <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] -z-10"></div>
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
             <h1 className="text-3xl font-bold text-gray-800">بنك الأسئلة الذكي</h1>
             <p className="text-gray-600 mt-2">مرحبًا بك! للبدء، يرجى إدخال مفتاح Google Gemini API الخاص بك.</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="api-key-input" className="block text-lg font-medium text-gray-700 mb-2">
                مفتاح Gemini API
              </label>
              <input
                id="api-key-input"
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white text-gray-800"
                value={apiKey}
                onChange={(e) => {
                    setApiKey(e.target.value)
                    setError('')
                }}
                placeholder="أدخل مفتاحك هنا"
              />
            </div>

            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            
            <p className="text-xs text-gray-500 mb-4">
                سيتم حفظ مفتاحك بشكل آمن في متصفحك فقط ولن يتم إرساله إلى أي مكان آخر. 
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                >
                     احصل على مفتاح من Google AI Studio
                </a>.
            </p>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
            >
              حفظ وبدء الاستخدام
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ApiKeyScreen;
