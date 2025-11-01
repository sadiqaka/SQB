
import React, { useState } from 'react';
import { Question, QuestionType } from '../types';
import Card from './Card';

interface QuestionBankProps {
  questions: Question[];
  onStartQuiz: () => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onSaveToBank: (questions: Question[]) => void;
}

// --- ICONS ---
const EditIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const SaveIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586L7.707 10.293zM3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 15a1 1 0 100 2h12a1 1 0 100-2H4z" />
    </svg>
);
// --- END ICONS ---


const QuestionBank: React.FC<QuestionBankProps> = ({ questions, onStartQuiz, onUpdateQuestion, onDeleteQuestion, onSaveToBank }) => {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVED'>('IDLE');


  const handleSaveClick = () => {
      onSaveToBank(questions);
      setSaveStatus('SAVED');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
  }

  // --- EDIT HANDLERS ---
  const handleEditStart = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditedQuestion({ ...question });
  };

  const handleEditCancel = () => {
    setEditingQuestionId(null);
    setEditedQuestion(null);
  };

  const handleEditSave = () => {
    if (editedQuestion) {
      onUpdateQuestion(editedQuestion);
      handleEditCancel();
    }
  };

  const handleFieldChange = (field: keyof Question, value: any) => {
    if (editedQuestion) {
      setEditedQuestion({ ...editedQuestion, [field]: value });
    }
  };
  
  const handleOptionTextChange = (index: number, text: string) => {
      if (editedQuestion && editedQuestion.options) {
        const newOptions = [...editedQuestion.options];
        const isCorrectAnswer = editedQuestion.correctAnswer === newOptions[index];
        newOptions[index] = text;
        setEditedQuestion({ 
            ...editedQuestion, 
            options: newOptions,
            correctAnswer: isCorrectAnswer ? text : editedQuestion.correctAnswer
        });
      }
    };
  // --- END EDIT HANDLERS ---

  // --- RENDER LOGIC ---
  const renderEditForm = (question: Question) => (
    <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50/50 space-y-4 animate-fade-in">
      <label className="font-semibold text-gray-700">نص السؤال:</label>
      <textarea
        value={editedQuestion?.questionText}
        onChange={(e) => handleFieldChange('questionText', e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        rows={3}
      />

      {(question.questionType === QuestionType.MultipleChoice || question.questionType === QuestionType.CauseAndEffect) && editedQuestion?.options && (
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">الخيارات:</label>
          {editedQuestion.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-answer-${question.id}`}
                checked={editedQuestion.correctAnswer === opt}
                onChange={() => handleFieldChange('correctAnswer', opt)}
                className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                aria-label={`Set ${opt} as correct answer`}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionTextChange(i, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                aria-label={`Edit option ${i+1}`}
              />
            </div>
          ))}
        </div>
      )}
      {question.questionType === QuestionType.TrueFalse && (
        <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
                <input type="radio" name={`correct-answer-${question.id}`} checked={editedQuestion?.correctAnswer === true} onChange={() => handleFieldChange('correctAnswer', true)} className="form-radio" />
                <span className="mr-2">صواب</span>
            </label>
            <label className="flex items-center cursor-pointer">
                <input type="radio" name={`correct-answer-${question.id}`} checked={editedQuestion?.correctAnswer === false} onChange={() => handleFieldChange('correctAnswer', false)} className="form-radio" />
                <span className="mr-2">خطأ</span>
            </label>
        </div>
      )}
      {question.questionType === QuestionType.FillInTheBlank && (
        <>
        <label className="font-semibold text-gray-700">الإجابة الصحيحة:</label>
         <input
            type="text"
            value={editedQuestion?.correctAnswer as string}
            onChange={(e) => handleFieldChange('correctAnswer', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
         />
        </>
      )}
      
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={handleEditCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
        <button onClick={handleEditSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">حفظ</button>
      </div>
    </div>
  );

  const renderQuestionDisplay = (q: Question, index: number) => (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
          <p className="font-semibold text-gray-700">{index + 1}. {q.questionText}</p>
          
          {q.questionType === QuestionType.Matching && q.stems ? (
             <ul className="mt-2 pr-5 list-disc list-inside text-gray-600 space-y-1">
                {q.stems.map((stem, i) => (
                    <li key={i}>
                        {stem} <span className="font-bold text-green-700"> &rarr; {typeof q.correctAnswer === 'object' ? q.correctAnswer[stem] : ''}</span>
                    </li>
                ))}
            </ul>
          ) : q.options ? (
            <ul className="mt-2 pr-5 list-disc list-inside text-gray-600 space-y-1">
              {q.options.map((opt, i) => (
                <li key={i} className={q.correctAnswer === opt ? 'font-bold' : ''}>{opt}</li>
              ))}
            </ul>
          ) : null}

          {q.questionType !== QuestionType.Matching && (
             <p className="mt-2 text-sm text-green-700 font-medium">الإجابة الصحيحة: {String(q.correctAnswer)}</p>
          )}
          
          <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" role="group">
            {q.questionType !== QuestionType.Matching && (
                <button onClick={() => handleEditStart(q)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-200 transition-colors" aria-label={`Edit question ${index + 1}`}>
                <EditIcon />
                </button>
            )}
            <button onClick={() => onDeleteQuestion(q.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors" aria-label={`Delete question ${index + 1}`}>
              <DeleteIcon />
            </button>
          </div>
      </div>
  );
  // --- END RENDER LOGIC ---

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-200 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">بنك الأسئلة</h2>
        <div className="flex-shrink-0">
            <button 
                onClick={handleSaveClick}
                disabled={questions.length === 0}
                className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 disabled:border-gray-300 disabled:text-gray-400 disabled:bg-transparent transition-colors"
            >
                {saveStatus === 'SAVED' ? (
                    <>
                        <span>تم الحفظ!</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </>
                ) : (
                    <>
                        <span>حفظ في البنك</span>
                        <SaveIcon />
                    </>
                )}
            </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">لم يتم إنشاء أي أسئلة بعد أو تم حذفها.</p>
      ) : (
        <div className="space-y-4 mb-6">
            {questions.map((q, index) => (
            <div key={q.id}>
                {editingQuestionId === q.id ? renderEditForm(q) : renderQuestionDisplay(q, index)}
            </div>
            ))}
        </div>
      )}
      
      <button
        onClick={onStartQuiz}
        disabled={questions.length === 0}
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
      >
        ابدأ الاختبار
      </button>
    </Card>
  );
};

export default QuestionBank;
