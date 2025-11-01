
import React from 'react';
import { QuizResult, QuestionType } from '../types';
import Card from './Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface QuizResultsProps {
  result: QuizResult;
  onTryAgain: () => void;
  onNewQuiz: () => void;
}

const formatAnswer = (answer: any, questionType: QuestionType) => {
    if (answer === null || answer === undefined) {
        return <span className="text-gray-500">لم تتم الإجابة</span>;
    }
    if (questionType === QuestionType.TrueFalse) {
        return answer ? 'صواب' : 'خطأ';
    }
    if (questionType === QuestionType.Matching && typeof answer === 'object' && !Array.isArray(answer)) {
        return (
            <ul className="list-none p-0 m-0 space-y-1">
                {Object.entries(answer).map(([key, value]) => (
                    <li key={key}>
                        <span className="font-semibold">{key}:</span> {String(value)}
                    </li>
                ))}
            </ul>
        );
    }
    return String(answer);
};


const QuizResults: React.FC<QuizResultsProps> = ({ result, onTryAgain, onNewQuiz }) => {
  const { score, correctAnswers, totalQuestions } = result;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const data = [
    { name: 'إجابات صحيحة', value: correctAnswers },
    { name: 'إجابات خاطئة', value: incorrectAnswers },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-500' : 'text-red-600';

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">نتيجة الاختبار</h2>
        <p className="text-lg text-gray-600 mb-2">
          لقد أجبت بشكل صحيح على {correctAnswers} من أصل {totalQuestions} أسئلة.
        </p>
        <p className="text-5xl font-extrabold my-6">
          <span className={scoreColor}>{score.toFixed(0)}%</span>
        </p>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} أسئلة`} />
            <Legend formatter={(value) => <span className="text-gray-700">{value}</span>}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
        {/* --- Review Section --- */}
        <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">مراجعة الأسئلة</h3>
            <div className="space-y-6">
                {result.questions.map((question, index) => {
                    const userAnswer = result.answers.find(a => a.questionId === question.id);
                    
                    let isCorrect = false;
                    if (userAnswer) {
                        if (question.questionType === QuestionType.Matching) {
                             const userAnsObj = (userAnswer.answer || {}) as { [key: string]: string };
                             const correctAnsObj = question.correctAnswer as { [key: string]: string };
                             isCorrect = question.stems?.every(stem => userAnsObj[stem] === correctAnsObj[stem]) ?? false;
                        } else {
                            isCorrect = String(question.correctAnswer).toLowerCase() === String(userAnswer.answer).toLowerCase();
                        }
                    }

                    const resultBgColor = isCorrect ? 'bg-green-50' : 'bg-red-50';
                    const resultBorderColor = isCorrect ? 'border-green-500' : 'border-red-500';

                    return (
                        <div key={question.id} className={`p-4 border-r-4 rounded ${resultBgColor} ${resultBorderColor}`}>
                            <p className="font-semibold text-gray-800 mb-3">{index + 1}. {question.questionText}</p>
                            
                            <div className="text-sm space-y-2">
                                <div className="flex items-start">
                                    <span className="font-bold w-24 flex-shrink-0">إجابتك:</span>
                                    <span className="text-gray-700">{formatAnswer(userAnswer?.answer, question.questionType)}</span>
                                </div>
                                {!isCorrect && (
                                     <div className="flex items-start">
                                        <span className="font-bold w-24 flex-shrink-0">الإجابة الصحيحة:</span>
                                        <span className="text-green-800 font-semibold">{formatAnswer(question.correctAnswer, question.questionType)}</span>
                                    </div>
                                )}
                            </div>

                            {question.explanation && (
                                <div className="mt-3 pt-3 border-t border-gray-200/80">
                                    <p className="font-semibold text-indigo-800 text-sm">الشرح:</p>
                                    <p className="text-gray-700 text-sm">{question.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>


      <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onTryAgain}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition"
        >
          إعادة الاختبار
        </button>
        <button
          onClick={onNewQuiz}
          className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition"
        >
          إنشاء اختبار جديد
        </button>
      </div>
    </Card>
  );
};

export default QuizResults;
