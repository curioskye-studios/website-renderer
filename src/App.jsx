import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";

// IMPORT YOUR FILES (no edits needed)
import AdvancedJS from "./pages/advanced_js_quiz_app_react.jsx";
import InterviewPrep from "./pages/interview-prep.jsx";
import ReactQuiz from "./pages/ReactQuiz.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/advanced-js" element={<AdvancedJS />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/react-quiz" element={<ReactQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}