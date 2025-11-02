
import React, { useState, useCallback, useEffect } from 'react';
import { Question, QuestionType, QuizResult } from './types';
import { generateQuestionsFromText, setApiKey } from './services/geminiService';
import { addQuestionsToBank } from './services/storageService';
import Header from './components/Header';
import QuestionGenerator from './components/QuestionGenerator';
import QuestionBank from './components/QuestionBank';
import QuizTaker from './components/QuizTaker';
import QuizResults from './components/QuizResults';
import SavedQuestions from './components/SavedQuestions';
import Spinner from './components/Spinner';
import ApiKeyScreen from './components/ApiKeyScreen';
import { sampleText } from './constants';

type AppState = 'IDLE' | 'GENERATING' | 'QUIZ_READY' | 'TAKING_QUIZ' | 'SHOWING_RESULTS' | 'VIEWING_BANK';

const App: React.FC = () => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyState(savedKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setApiKeyState(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleGenerateQuestions = useCallback(async (text: string, type: QuestionType, count: number) => {
    setAppState('GENERATING');
    setError(null);
    setQuestions([]);
    try {
      const generatedQuestions = await generateQuestionsFromText(text, type, count);
      setQuestions(generatedQuestions);
      setAppState('QUIZ_READY');
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الأسئلة. قد يكون مفتاح API غير صالح أو أن الخدمة تواجه مشكلة. يرجى المحاولة مرة أخرى.');
      console.error(err);
      setAppState('IDLE');
    }
  }, []);

  const handleStartQuiz = useCallback(() => {
    if (questions.length > 0) {
      setAppState('TAKING_QUIZ');
    }
  }, [questions]);
  
  const handleStartQuizFromBank = useCallback((questionsForQuiz: Question[]) => {
    setQuestions(questionsForQuiz);
    setAppState('TAKING_QUIZ');
  }, []);

  const handleQuizSubmit = useCallback((result: QuizResult) => {
    setQuizResult(result);
    setAppState('SHOWING_RESULTS');
  }, []);

  const handleReset = useCallback(() => {
    setAppState('IDLE');
    setQuestions([]);
    setQuizResult(null);
    setError(null);
  }, []);

  const handleStartOver = useCallback(() => {
    setAppState('QUIZ_READY');
    setQuizResult(null);
  }, []);

  const handleUpdateQuestion = useCallback((updatedQuestion: Question) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  }, []);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
  }, []);

  const handleSaveToBank = useCallback((questionsToSave: Question[]) => {
    addQuestionsToBank(questionsToSave);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'GENERATING':
        return <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-lg shadow-lg backdrop-blur-sm"><Spinner /><p className="mt-4 text-lg text-gray-700">جاري إنشاء الأسئلة...</p></div>;
      case 'QUIZ_READY':
        return <QuestionBank questions={questions} onStartQuiz={handleStartQuiz} onUpdateQuestion={handleUpdateQuestion} onDeleteQuestion={handleDeleteQuestion} onSaveToBank={handleSaveToBank} />;
      case 'TAKING_QUIZ':
        return <QuizTaker questions={questions} onSubmit={handleQuizSubmit} />;
      case 'SHOWING_RESULTS':
        return quizResult && <QuizResults result={quizResult} onTryAgain={handleStartOver} onNewQuiz={handleReset} />;
      case 'VIEWING_BANK':
        return <SavedQuestions onStartQuiz={handleStartQuizFromBank} onBack={() => setAppState('IDLE')} />;
      case 'IDLE':
      default:
        return <QuestionGenerator onGenerate={handleGenerateQuestions} initialText={sampleText} error={error} />;
    }
  };
  
  if (!apiKey) {
    return <ApiKeyScreen onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
       <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] -z-10"></div>
      <Header onViewBank={() => setAppState('VIEWING_BANK')} onGoHome={handleReset} />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {appState === 'IDLE' && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">أنشئ اختبارات تفاعلية بسهولة</h2>
              <p className="text-lg text-gray-600">ألصق نصًا تعليميًا، اختر نوع الأسئلة، ودع الذكاء الاصطناعي يقوم بالباقي!</p>
            </div>
          )}
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>تم التطوير بواسطة مهندس React خبير بواجهة برمجة تطبيقات Gemini</p>
      </footer>
    </div>
  );
};

export default App;
