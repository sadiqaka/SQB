import React, { useState } from 'react';
import { QuestionType } from '../types';
import Card from './Card';

interface QuestionGeneratorProps {
  onGenerate: (text: string, type: QuestionType, count: number) => void;
  initialText: string;
  error: string | null;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ onGenerate, initialText, error }) => {
  const [text, setText] = useState(initialText);
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.MultipleChoice);
  const [questionCount, setQuestionCount] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate(text, questionType, questionCount);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="text-input" className="block text-lg font-medium text-gray-700 mb-2">
            النص التعليمي
          </label>
          <textarea
            id="text-input"
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white text-gray-800"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ألصق النص هنا..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="question-type" className="block text-lg font-medium text-gray-700 mb-2">
              نوع الأسئلة
            </label>
            <select
              id="question-type"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white text-gray-800"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
            >
              <option value={QuestionType.MultipleChoice}>اختيار من متعدد</option>
              <option value={QuestionType.TrueFalse}>صواب أو خطأ</option>
              <option value={QuestionType.FillInTheBlank}>أكمل الفراغ</option>
              <option value={QuestionType.Matching}>مطابقة</option>
              <option value={QuestionType.CauseAndEffect}>سبب ونتيجة</option>
            </select>
          </div>
          <div>
            <label htmlFor="question-count" className="block text-lg font-medium text-gray-700 mb-2">
              عدد الأسئلة (1-10)
            </label>
            <input
              id="question-count"
              type="number"
              min="1"
              max="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white text-gray-800"
              value={questionCount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val)) {
                  // When input is cleared, val is NaN. Default to 1.
                  setQuestionCount(1);
                } else {
                  // Clamp the value between 1 and 10
                  const clampedVal = Math.max(1, Math.min(10, val));
                  setQuestionCount(clampedVal);
                }
              }}
            />
          </div>
        </div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
        >
          أنشئ الأسئلة
        </button>
      </form>
    </Card>
  );
};

export default QuestionGenerator;