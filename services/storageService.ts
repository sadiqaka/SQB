
import { Question } from '../types';

const STORAGE_KEY = 'smartQuestionsBank';

export const getBankQuestions = (): Question[] => {
    try {
        const savedQuestions = localStorage.getItem(STORAGE_KEY);
        return savedQuestions ? JSON.parse(savedQuestions) : [];
    } catch (error) {
        console.error("Error retrieving questions from local storage:", error);
        return [];
    }
};

export const addQuestionsToBank = (newQuestions: Question[]): void => {
    try {
        const existingQuestions = getBankQuestions();
        const existingIds = new Set(existingQuestions.map(q => q.id));
        const questionsToAdd = newQuestions.filter(q => !existingIds.has(q.id));
        
        const updatedQuestions = [...existingQuestions, ...questionsToAdd];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuestions));
    } catch (error) {
        console.error("Error saving questions to local storage:", error);
    }
};

export const removeQuestionFromBank = (questionId: string): void => {
    try {
        const existingQuestions = getBankQuestions();
        const updatedQuestions = existingQuestions.filter(q => q.id !== questionId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuestions));
    } catch (error) {
        console.error("Error removing question from local storage:", error);
    }
};

export const saveBankQuestions = (questions: Question[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (error) {
        console.error("Error overwriting questions in local storage:", error);
    }
};
