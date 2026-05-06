import React, { useState } from "react";

const questions = [
  {
    question: "What runs before setTimeout callbacks?",
    options: ["Call Stack", "Promises (Microtasks)", "Heap", "Event Loop"],
    answer: 1,
    explanation: "Promises (microtasks) always run before macrotasks like setTimeout."
  },
  {
    question: "What does 'this' refer to in a regular method?",
    options: ["Window", "The function", "The object calling it", "Undefined"],
    answer: 2,
    explanation: "'this' refers to the object that called the method."
  },
  {
    question: "What is a closure?",
    options: [
      "A function with no return",
      "A function that remembers its outer scope",
      "A loop inside a function",
      "An async function"
    ],
    answer: 1,
    explanation: "Closures let functions access outer scope variables after execution."
  },
  {
    question: "Which keyword is NOT safely hoisted?",
    options: ["var", "function", "let", "function declaration"],
    answer: 2,
    explanation: "let/const are hoisted but stay in temporal dead zone."
  },
  {
    question: "What does bind() do?",
    options: [
      "Runs function immediately",
      "Creates new function with bound this",
      "Deletes context",
      "Pauses execution"
    ],
    answer: 1,
    explanation: "bind returns a new function with fixed 'this'."
  },
  {
    question:
      "console.log(1); setTimeout(()=>console.log(2),0); Promise.resolve().then(()=>console.log(3)); console.log(4);",
    options: ["1 2 3 4", "1 4 2 3", "1 4 3 2", "4 1 3 2"],
    answer: 2,
    explanation: "Sync first (1,4), microtasks (3), macrotasks (2)."
  },
  {
    question: "What is a pure function?",
    options: [
      "Uses global variables",
      "Same input always gives same output",
      "Async function",
      "Uses DOM"
    ],
    answer: 1,
    explanation: "Pure functions have no side effects."
  },
  {
    question: "What does Promise.all do?",
    options: [
      "Runs sequentially",
      "Returns fastest promise",
      "Waits for all promises",
      "Cancels promises"
    ],
    answer: 2,
    explanation: "Promise.all resolves when all promises finish."
  }
];

export default function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState(null);

  const q = questions[current];

  const handleAnswer = (i) => {
    if (showAnswer) return;

    setSelected(i);
    setShowAnswer(true);

    if (i === q.answer) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    setCurrent((c) => c + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
  };

  const progress = (current / questions.length) * 100;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #020617, #0f172a)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
      color: "white",
      padding: 20
    },
    card: {
      width: "100%",
      maxWidth: 600,
      background: "#0f172a",
      border: "1px solid #334155",
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
    },
    button: {
      width: "100%",
      padding: 12,
      marginTop: 8,
      borderRadius: 8,
      border: "1px solid #334155",
      background: "#1e293b",
      color: "white",
      cursor: "pointer",
      textAlign: "left"
    },
    correct: {
      background: "#16a34a",
      borderColor: "#22c55e"
    },
    wrong: {
      background: "#dc2626",
      borderColor: "#ef4444"
    },
    progressBar: {
      height: 10,
      background: "#1e293b",
      borderRadius: 10,
      overflow: "hidden",
      marginTop: 20
    },
    progressFill: {
      height: "100%",
      width: `${progress}%`,
      background: "#6366f1",
      transition: "width 0.3s"
    }
  };

  if (current >= questions.length) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Quiz Complete 🎉</h2>
          <p>
            Score: {score} / {questions.length}
          </p>
          <button onClick={restart} style={styles.button}>
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Question {current + 1}</h2>

        <p style={{ marginBottom: 15 }}>{q.question}</p>

        {q.options.map((opt, i) => {
          let style = { ...styles.button };

          if (showAnswer) {
            if (i === q.answer) style = { ...style, ...styles.correct };
            else if (i === selected) style = { ...style, ...styles.wrong };
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={style}
              disabled={showAnswer}
            >
              {opt}
            </button>
          );
        })}

        {showAnswer && (
          <div style={{ marginTop: 15 }}>
            <p style={{ fontWeight: "bold" }}>
              {selected === q.answer ? "Correct 🎉" : "Wrong ❌"}
            </p>
            <p style={{ fontSize: 14, opacity: 0.8 }}>{q.explanation}</p>

            <button onClick={next} style={styles.button}>
              Next
            </button>
          </div>
        )}

        <div style={styles.progressBar}>
          <div style={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}