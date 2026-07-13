import { useEffect, useState } from "react";
import api from "../api/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  if (!questions.length) return <p>Loading...</p>;

  const q = questions[index];

  const handleAnswer = (i) => {
    if (i === q.correctIndex) setScore(score + 1);
    if (index + 1 < questions.length) setIndex(index + 1);
    else finishQuiz();
  };

  const finishQuiz = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    console.log(user._id);
    console.log(score);
    await api.put(`/users/${user._id}/score`, { lastScore: score });
    alert(`Quiz finished! Score: ${score}`);
  };

  return (
    <div className="quiz-container">
      <h2>{q.question}</h2>
      {q.answers.map((a, i) => (
        <button key={i} onClick={() => handleAnswer(i)}>
          {a}
        </button>
      ))}
    </div>
  );
}
