
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from '../types';

let ai: GoogleGenAI;

export const setApiKey = (key: string) => {
    ai = new GoogleGenAI({ apiKey: key });
};

const getAiInstance = () => {
    if (!ai) {
        // Fallback for initial load or if key is not set yet.
        // The App component should prevent calls before the key is set.
        console.warn("Gemini AI client not initialized. Please set API key.");
        // A temporary key to avoid crashing, but calls will fail.
        ai = new GoogleGenAI({ apiKey: "invalid_key_placeholder" });
    }
    return ai;
}


const getQuestionTypeDescription = (type: QuestionType) => {
    switch (type) {
        case QuestionType.MultipleChoice:
            return 'سؤال اختيار من متعدد بأربعة خيارات، واحد منها فقط صحيح.';
        case QuestionType.TrueFalse:
            return 'سؤال صواب أو خطأ.';
        case QuestionType.FillInTheBlank:
            return 'سؤال أكمل الفراغ حيث يجب ملء كلمة أو عبارة قصيرة مفقودة.';
        case QuestionType.Matching:
            return 'سؤال مطابقة حيث يجب على الطالب مطابقة العناصر من قائمتين.';
        case QuestionType.CauseAndEffect:
            return 'سؤال سبب ونتيجة لاختبار فهم العلاقات السببية (بتنسيق اختيار من متعدد).';
        default:
            return 'سؤال عام.';
    }
}

export const generateQuestionsFromText = async (text: string, type: QuestionType, count: number): Promise<Question[]> => {
    
    const baseSchemaProperties = {
        id: { type: Type.STRING, description: 'معرف فريد للسؤال' },
        questionText: { type: Type.STRING, description: 'نص السؤال' },
        questionType: { type: Type.STRING, enum: [type], description: `نوع السؤال يجب أن يكون '${type}'` },
        explanation: { type: Type.STRING, description: 'شرح موجز للإجابة الصحيحة' }
    };
    const baseRequired = ['id', 'questionText', 'questionType', 'correctAnswer', 'explanation'];

    let questionSchema;

    switch (type) {
        case QuestionType.Matching:
            questionSchema = {
                type: Type.OBJECT,
                properties: {
                    ...baseSchemaProperties,
                    stems: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'قائمة العناصر المراد مطابقتها.' },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'قائمة الخيارات للمطابقة.' },
                    correctAnswer: { type: Type.OBJECT, description: 'كائن يربط كل عنصر من "stems" بالإجابة الصحيحة من "options".' }
                },
                required: [...baseRequired, 'stems', 'options']
            };
            break;
        case QuestionType.CauseAndEffect:
        case QuestionType.MultipleChoice:
            questionSchema = {
                type: Type.OBJECT,
                properties: {
                    ...baseSchemaProperties,
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'قائمة بأربعة خيارات.' },
                    correctAnswer: { type: Type.STRING, description: 'الإجابة الصحيحة كنص.' }
                },
                required: [...baseRequired, 'options']
            };
            break;
        case QuestionType.TrueFalse:
            questionSchema = {
                type: Type.OBJECT,
                properties: {
                    ...baseSchemaProperties,
                    correctAnswer: { type: Type.BOOLEAN, description: 'الإجابة الصحيحة (true للصواب, false للخطأ).' }
                },
                required: baseRequired
            };
            break;
        case QuestionType.FillInTheBlank:
             questionSchema = {
                type: Type.OBJECT,
                properties: {
                    ...baseSchemaProperties,
                    correctAnswer: { type: Type.STRING, description: 'الكلمة أو العبارة المفقودة الصحيحة.' }
                },
                required: baseRequired
            };
            break;
        default:
            throw new Error(`Unsupported question type: ${type}`);
    }
    
    const prompt = `استنادًا إلى النص التالي، قم بإنشاء ${count} سؤال/أسئلة من نوع "${getQuestionTypeDescription(type)}". تأكد من أن الأسئلة والإجابات باللغة العربية الفصحى ومناسبة لطلاب الصف الثاني عشر.

النص:
---
${text}
---
`;

    try {
        const aiInstance = getAiInstance();
        const response = await aiInstance.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: questionSchema,
                        },
                    },
                    required: ['questions']
                },
            },
        });
        
        const jsonResponseText = response.text.trim();
        const parsedResponse = JSON.parse(jsonResponseText);

        if (parsedResponse && parsedResponse.questions) {
            return parsedResponse.questions as Question[];
        } else {
            console.error("API response is missing 'questions' array:", parsedResponse);
            throw new Error("Invalid response structure from API");
        }
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error("Failed to generate questions from Gemini API.");
    }
};
