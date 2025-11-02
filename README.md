# بنك الأسئلة الذكي (Smart Questions Bank)

An advanced educational platform designed for Grade 12 students and teachers in the Arabic-speaking world. This application leverages the power of the Google Gemini API to automatically generate a variety of interactive quiz questions from any educational text.

**[➡️ View Live Demo](https://<Your-GitHub-Username>.github.io/<your-repository-name>/)** *(Replace this with your actual GitHub Pages link after deployment)*

---

## ✨ Key Features

- **AI-Powered Question Generation**: Paste any educational text and instantly generate high-quality questions.
- **Multiple Question Types**: Supports multiple-choice, true/false, fill-in-the-blank, matching, and cause-and-effect questions.
- **Editable Questions**: Review and edit generated questions to perfectly match your curriculum before starting a quiz.
- **Interactive Quiz Mode**: Take quizzes in a clean, user-friendly interface with progress tracking.
- **Instant Results & Review**: Get immediate feedback with a detailed score report, visual chart, and a question-by-question review with explanations.
- **Persistent Question Bank**: Save your favorite questions to a personal "bank" using the browser's local storage to build a custom quiz library.
- **Responsive Design**: Fully functional and beautifully designed for desktops, tablets, and mobile devices.
- **Full Arabic Language Support**: The UI, generated content, and overall experience are tailored for Arabic-speaking users.

## 💻 Technologies Used

- **Frontend**: React 19, TypeScript
- **AI Model**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS (via CDN for rapid, build-less development)
- **Charts**: Recharts (for the results pie chart)
- **Storage**: Browser Local Storage (for the persistent question bank)
- **Architecture**: This is a zero-build, static single-page application (SPA). It runs entirely in the browser without needing a bundler like Vite or Webpack.

---

## 🚀 Getting Started

This project is set up to run without any build process.

### Prerequisites

- A modern web browser (like Chrome, Firefox, or Edge).
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running Locally

1.  **Clone or Download the Repository**:
    ```bash
    git clone https://github.com/<Your-GitHub-Username>/<your-repository-name>.git
    ```
2.  **Set Up the API Key**:
    Open the file `services/geminiService.ts`. You need to replace the placeholder for the API key.
    
    Find this line:
    ```typescript
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    ```
    And replace it with your actual key:
    ```typescript
    const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY_HERE" });
    ```
    *Note: This method is for local testing only. Exposing your API key in a public repository is not secure.*

3.  **Serve the Files**:
    You cannot open `index.html` directly due to browser security policies (CORS). You need to serve it using a simple local server. If you have Python installed, you can run one of these commands from the project's root directory:
    
    For Python 3:
    ```bash
    python -m http.server
    ```
    Then, open your browser and navigate to `http://localhost:8000`.

---

## 🌐 Deployment

This application is perfectly suited for static site hosting services. For a free and easy setup, you can use **GitHub Pages**.

I have provided a detailed, step-by-step guide on how to deploy this application to your GitHub account in our conversation.

## 🌱 Future Development & Next Steps

This application provides a strong foundation, but there are many exciting features that could be added to transform it into a full-fledged educational platform.

-   **Backend & Database Integration**:
    -   Transition from `localStorage` to a proper backend (e.g., Firebase, Supabase, or a custom Node.js/Express API) with a database (e.g., Firestore, PostgreSQL).
    -   This would enable true user accounts and allow question banks to be synced across devices.

-   **User Authentication**:
    -   Implement a login/signup system for teachers and students.
    -   Teachers could manage their question banks privately, while students could have accounts to track their quiz history.

-   **Enhanced Collaboration**:
    -   Allow teachers to create "classes" and assign quizzes to students.
    -   Enable sharing of question banks between teachers.

-   **Advanced Content Input**:
    -   Implement file uploads to generate questions directly from `.pdf`, `.docx`, or `.txt` files, removing the need to copy-paste.
    -   Add the ability to generate questions from a web page URL.

-   **More Question Types**:
    -   **Short Answer**: Allow free-form text answers and use the Gemini API to evaluate the correctness of the student's response.
    -   **Sequencing**: Ask students to arrange items in the correct order.
    -   **Image-Based Questions**: Allow images in the source material to generate questions about them.

-   **Analytics & Performance Tracking**:
    -   Create a dashboard for students to view their quiz history and performance trends over time.
    -   Provide analytics for teachers to see class-wide performance and identify topics where students are struggling.

-   **Internationalization (i18n)**:
    -   Refactor the codebase to support multiple languages, allowing the platform to be used globally.
