
import React, { useState, useEffect, useMemo } from 'react';
import { Question } from '../types';
import { getBankQuestions, removeQuestionFromBank } from '../services/storageService';
import Card from './Card';

interface SavedQuestionsProps {
    onStartQuiz: (questions: Question[]) => void;
    onBack: () => void;
}

const DeleteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);


const SavedQuestions: React.FC<SavedQuestionsProps> = ({ onStartQuiz, onBack }) => {
    const [bank, setBank] = useState<Question[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setBank(getBankQuestions());
    }, []);

    const handleDelete = (questionId: string) => {
        removeQuestionFromBank(questionId);
        setBank(prevBank => prevBank.filter(q => q.id !== questionId));
        setSelectedIds(prevSelected => {
            const newSelected = new Set(prevSelected);
            newSelected.delete(questionId);
            return newSelected;
        });
    };

    const handleSelect = (questionId: string) => {
        setSelectedIds(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(questionId)) {
                newSelected.delete(questionId);
            } else {
                newSelected.add(questionId);
            }
            return newSelected;
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.size === bank.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(bank.map(q => q.id)));
        }
    }

    const handleStartQuiz = () => {
        const selectedQuestions = bank.filter(q => selectedIds.has(q.id));
        if (selectedQuestions.length > 0) {
            onStartQuiz(selectedQuestions);
        }
    };

    const selectedCount = selectedIds.size;

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">بنك الأسئلة المحفوظ</h2>
                <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    &rarr; العودة للرئيسية
                </button>
            </div>

            {bank.length === 0 ? (
                <p className="text-center text-gray-500 py-12">بنك الأسئلة فارغ. قم بإنشاء بعض الأسئلة وحفظها للبدء!</p>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
                        <div>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    checked={selectedIds.size === bank.length && bank.length > 0}
                                    onChange={handleSelectAll}
                                />
                                <span className="mr-3 font-semibold text-gray-700">تحديد الكل</span>
                            </label>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-bold">{selectedCount}</span> / {bank.length} محدد
                        </div>
                    </div>
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 mb-6">
                        {bank.map((q, index) => (
                            <div key={q.id} className="flex items-start gap-3 p-3 border rounded-lg hover:border-indigo-300 transition-colors">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-5 w-5 text-indigo-600 rounded mt-1 flex-shrink-0"
                                    checked={selectedIds.has(q.id)}
                                    onChange={() => handleSelect(q.id)}
                                    aria-label={`Select question ${index + 1}`}
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{q.questionText}</p>
                                    <p className="text-sm text-green-700 mt-1">الإجابة: {String(q.correctAnswer)}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(q.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
                                    aria-label={`Delete question ${index + 1}`}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <button
                onClick={handleStartQuiz}
                disabled={selectedCount === 0}
                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
                {selectedCount > 0 ? `ابدأ الاختبار بـ ${selectedCount} سؤال/أسئلة` : 'حدد أسئلة لبدء الاختبار'}
            </button>
        </Card>
    );
};

export default SavedQuestions;
