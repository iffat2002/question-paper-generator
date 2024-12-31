// ExamStatusToggle.js
import React, { useState } from "react";
import axios from "axios";

const ExamStatusToggle = ({
  examId,
  currentTotalMarks,
  currentPublish,
  currentComplexity,
}) => {
  const [publish, setPublish] = useState(currentPublish);
  const [complexity, setComplexity] = useState(currentComplexity);
  const [totalMarks, setTotalMarks] = useState(currentTotalMarks);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  console.log("publish", publish);
  console.log("examId", examId);

  console.log("complexity", complexity);
  const handleUpdateExam = async (e) => {
    e.preventDefault();
    const parsedTotalMarks = parseInt(totalMarks, 10);
    console.log("totalmarks", parsedTotalMarks);
    // Check if parsing was successful
    if (isNaN(parsedTotalMarks)) {
      alert("Please enter a valid number for total marks.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/update-exam/${examId}`,
        {
          publish,
          complexity,
          totalMarks: parsedTotalMarks,
        }
      );
      setSelectedQuestions(response.data.selectedQuestions || []);
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating exam:", error);
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleUpdateExam}>
      <select
        value={complexity}
        onChange={(e) => setComplexity(e.target.value)}
        required
      >
        <option value="">Select Complexity</option>
        <option value="easy">easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button
        type="button"
        onClick={() => {
          setPublish(publish === 0 ? 1 : 0);
          alert(publish === 0 ? "Exam Published" : "Exam Unpublished");
        }}
      >
        {publish === 0 ? "Publish" : "Unpublish"}
      </button>

      <button type="submit">Update Exam</button>

      {selectedQuestions.length > 0 && (
        <div>
          <h3>Selected Questions:</h3>
          <ul>
            {selectedQuestions.map((question) => (
              <li key={question.question_id}>
                {question.question_text} (Weightage: {question.weightage})
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default ExamStatusToggle;
