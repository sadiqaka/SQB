import React, { useState, useMemo } from 'react';
import { Question, UserAnswer, QuizResult, QuestionType } from '../types';
import Card from './Card';

interface QuizTakerProps {
  questions: Question[];
  onSubmit: (result: QuizResult) => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ questions, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | { [key: string]: string } | null>(null);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  const handleAnswerSelect = (answer: string | boolean, stem?: string) => {
    if (currentQuestion.questionType === QuestionType.Matching && stem) {
      const currentAnswers = (selectedAnswer || {}) as { [key: string]: string };
      const newAnswers = { ...currentAnswers, [stem]: answer as string };
      setSelectedAnswer(newAnswers);
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, { questionId: currentQuestion.id, answer: selectedAnswer }];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of quiz, calculate result
      let correctCount = 0;
      newAnswers.forEach(userAns => {
        const question = questions.find(q => q.id === userAns.questionId);
        if (!question) return;

        if (question.questionType === QuestionType.Matching) {
          if (typeof userAns.answer === 'object' && typeof question.correctAnswer === 'object' && question.stems) {
            const userAnsObj = userAns.answer as { [key: string]: string };
            const correctAnsObj = question.correctAnswer as { [key: string]: string };
            // Ensure all stems are present in both objects before comparing
            const allStemsMatch = question.stems.every(stem => userAnsObj[stem] === correctAnsObj[stem]);
            if (allStemsMatch && Object.keys(userAnsObj).length === question.stems.length) {
              correctCount++;
            }
          }
        } else {
           if (String(question.correctAnswer).toLowerCase() === String(userAns.answer).toLowerCase()) {
              correctCount++;
           }
        }
      });
      
      const result: QuizResult = {
        score: (correctCount / questions.length) * 100,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        answers: newAnswers,
        questions: questions
      };
      onSubmit(result);
    }
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const renderOptions = () => {
    switch (currentQuestion.questionType) {
      case QuestionType.CauseAndEffect:
      case QuestionType.MultipleChoice:
        return currentQuestion.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full text-start p-3 my-2 border rounded-lg transition-colors ${selectedAnswer === option ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white hover:bg-indigo-50'}`}
          >
            {option}
          </button>
        ));
      case QuestionType.TrueFalse:
        return (
          <>
            <button
              onClick={() => handleAnswerSelect(true)}
              className={`w-full p-3 my-2 border rounded-lg transition-colors ${selectedAnswer === true ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white hover:bg-indigo-50'}`}
            >
              صواب
            </button>
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`w-full p-3 my-2 border rounded-lg transition-colors ${selectedAnswer === false ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white hover:bg-indigo-50'}`}
            >
              خطأ
            </button>
          </>
        );
      case QuestionType.FillInTheBlank:
        return (
          <input
            type="text"
            onChange={(e) => handleAnswerSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="اكتب إجابتك هنا"
          />
        );
      case QuestionType.Matching:
        return currentQuestion.stems?.map((stem, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center justify-between my-2 p-3 border rounded-lg bg-gray-50/50">
                <label htmlFor={`match-${index}`} className="font-semibold text-gray-700 mb-2 sm:mb-0 sm:mr-4">{stem}</label>
                <select
                    id={`match-${index}`}
                    onChange={(e) => handleAnswerSelect(e.target.value, stem)}
                    value={(selectedAnswer as { [key: string]: string })?.[stem] || ''}
                    className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="" disabled>اختر...</option>
                    {currentQuestion.options?.map((option, optIndex) => (
                        <option key={optIndex} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        ));
      default:
        return null;
    }
  };

  let isNextDisabled = selectedAnswer === null;
  if (currentQuestion.questionType === QuestionType.Matching) {
    const stemsCount = currentQuestion.stems?.length || 0;
    const answeredCount = selectedAnswer ? Object.keys(selectedAnswer).length : 0;
    isNextDisabled = stemsCount === 0 || stemsCount !== answeredCount;
  } else if (currentQuestion.questionType === QuestionType.FillInTheBlank) {
    isNextDisabled = !selectedAnswer;
  }

  return (
    <Card>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
          <span>التقدم</span>
          <span>{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">{currentQuestion.questionText}</h2>
      
      <div className="space-y-2 mb-8">
        {renderOptions()}
      </div>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {currentQuestionIndex < questions.length - 1 ? 'التالي' : 'إنهاء الاختبار'}
      </button>
    </Card>
  );
};

export default QuizTaker;