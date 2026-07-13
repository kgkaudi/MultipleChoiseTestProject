import { useEffect, useState } from "react";
import api from "../api/api";

export default function Questions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  return (
    <div>
      <h2>Questions</h2>
      {questions.map((q) => (
        <div key={q._id}>
          <h3>{q.question}</h3>
          {q.answers.map((a, i) => (
            <p key={i}>{a}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
