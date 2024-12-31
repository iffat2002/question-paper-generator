import React, { useState, useEffect } from "react";
import axios from "axios";

import { useLocation, useParams, useNavigate} from "react-router-dom";

const ExamPaper = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const navigate = useNavigate();
   const studentId = params.get("studentId");
  const { examId } = useParams();
  const [examData, setExamData] = useState([]);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
console.log(examId, "exam id")
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/exam/${examId}`
        );
        setExamData(response.data.exam);
        console.log("res", response.data.exam);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExamData();
    console.log("inside exampaper");
  }, [examId]);

  const handleAnswerChange = (questionId, option) => {
    setAnswers((prevState) => ({
      ...prevState,
      [questionId]: option,
    }));
    console.log(questionId, option);
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      for (const questionId in answers) {
        const responsePayload = {
          id: studentId,
          exam_id: parseInt(examId),
          question_id: parseInt(questionId),
          selected_option: answers[questionId],
        };
  
        await axios.post("http://localhost:5000/submit-response", responsePayload);
      }
  
      // Calculate grades after submitting responses
      await axios.post("http://localhost:5000/calculate-grades", {
        student_id: studentId,
        exam_id: parseInt(examId),
      });
  
      alert("submitted successfully");
     
      navigate(`/successstudent?id=${studentId}`)
    } catch (error) {
      alert("There was an error submitting your answers.");
    }
  }
  return (
    <div className="exam-container">
      <div className="exam-details">
        <h2>Exam Details</h2>
        <p>Exam Name: {examData.examName}</p>
        <p>Exam Date: {examData.examDate}</p>
        <p>Total Marks: {examData.totalMarks}</p>
      </div>
      <div className="questions-container">
      
        <h2>Questions</h2>
        <form onSubmit={handleSubmit}>
          {examData?.questions?.map((question, index) => (
            <div key={index} className="question">
              <p>
                Question {index + 1}: {question.questionText}
              </p>
              {/* <p>Complexity: {question.complexity}</p> */}
              <p>Weightage: {question.weightage}</p>
              {/* <p>Difficulty Level: {question.difficultyLevel}</p> */}
              <p>Options:</p>
              <ul className="options">
                {["A", "B", "C", "D"].map((option) => (
                  <li key={option} className="option">
                    <label className="option-label">
                      <input
                        type="radio"
                        name={`question_${question.questionId}`}
                        value={option}
                        checked={answers[question.questionId] === option}
                        onChange={() =>
                          handleAnswerChange(question.questionId, option)
                        }
                      />
                      <span className="answer-option">
                        {question[`option${option}`]}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button type="submit" className="submit-btn">
            Submit Answers
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ExamPaper;
