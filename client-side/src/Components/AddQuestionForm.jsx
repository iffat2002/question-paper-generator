import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";

const AddQuestionForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const courseId = params.get("courseId");
  const chapter_id = params.get("chapterId");
  //const examId = params.get("examId");
  const examId = parseInt(params.get("examId"), 10);
  const [text, setText] = useState("");
  const [complexity, setComplexity] = useState("");
  const [weightage, setWeightage] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("");

  const [examData, setExamData] = useState([]);
  const [totalMarks, setTotalMarks] = useState("");
  const [error, setError] = useState(null);

  const fetchExamData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/examedit/${examId}`);
      console.log("Fetched exam data:", response.data);
      setExamData(response.data.exam);
      //setTotalMarks(response.data.exam.totalMarks);

    
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/add-question", {
        text,
        complexity,
        weightage,
        difficultyLevel,
        courseId,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctOption,
        chapter_id,
        examId,
      });
      console.log("New question added:", res.data);

      // Reset form fields
      setText("");
      setComplexity("");
      setWeightage("");
      setDifficultyLevel("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectOption("");

  
      // Fetch exam data again
      fetchExamData();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-question/${questionId}`);
      fetchExamData();
      console.log(`Question ${questionId} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting question ${questionId}:`, error);
    }
  };

  const handleTotalMarksChange = (e) => {
    setTotalMarks(e.target.value);
  };

  const handleUpdateTotalMarks = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/update-total-marks/${examId}`,
        { totalMarks }
      );
      console.log("Total marks updated:", response.data);
      alert("Total marks updated successfully");
      closeEditMarksModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating total marks:", error);
    }
  };


  const [isEditMarksModalOpen, setEditMarksModalOpen] = useState(false);
  const openEditMarksModal = () => {
    setEditMarksModalOpen(true);
  };
  const closeEditMarksModal = () => {
    setEditMarksModalOpen(false);
  };
  return (
    <div>
      <h1>Add Question</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Question text"
          required
        />
        <select
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
          required
        >
          <option value="">Select Complexity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="number"
          value={weightage}
          onChange={(e) => setWeightage(e.target.value)}
          placeholder="Weightage"
          required
        />
        <select
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
          required
        >
          <option value="">Select Difficulty Level</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Input fields for options */}
        <input
          type="text"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          placeholder="Option A"
          required
        />
        <input
          type="text"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          placeholder="Option B"
          required
        />
        <input
          type="text"
          value={optionC}
          onChange={(e) => setOptionC(e.target.value)}
          placeholder="Option C"
          required
        />
        <input
          type="text"
          value={optionD}
          onChange={(e) => setOptionD(e.target.value)}
          placeholder="Option D"
          required
        />
        <select
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          required
        >
          <option value="">Select Correct Option</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
        <button type="submit" >Add Question</button>
        <button onClick={()=>{setText("");
  setComplexity("");
  setWeightage("");
  setDifficultyLevel("");
  setOptionA("");
  setOptionB("");
  setOptionC("");
  setOptionD("");
  setCorrectOption("");}}>reset</button>
      </form>
      {examData && (
        <div className="exam-container">
          <div className="exam-details">
            <h2>Exam Details</h2>
            <p>Exam Name: {examData.examName}</p>
            <p>Exam Date: {examData.examDate}</p>
            <p>Total Marks: {examData.totalMarks}</p>
            <button onClick={openEditMarksModal}>Edit Exam Total Marks</button>
          </div>
          <Modal
            show={isEditMarksModalOpen}
            onHide={closeEditMarksModal}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Marks</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleUpdateTotalMarks}>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={handleTotalMarksChange}
                  placeholder="Enter new total marks"
                  required
                />
                <button type="submit">Update Total Marks</button>
              </form>
            </Modal.Body>
          </Modal>

          <div className="questions-container">
            <h2>Questions</h2>

            {examData?.questions?.map((question, index) => (
              <div key={index} className="question">
                <p>
                  Question {index + 1}: {question.questionText}
                </p>
                {/* <p>Complexity: {question.complexity}</p> */}
                <p>Weightage: {question.weightage}</p>
                {/* <p>Difficulty Level: {question.difficultyLevel}</p> */}
                <p>Options:</p>
                <ul style={{ listStyleType: "lower-alpha" }}>
                  {["A", "B", "C", "D"].map((option) => (
                    <li key={option}>{question[`option${option}`]}</li>
                  ))}
                </ul>
                <span>correct option: {question.correctOption}</span>
                <button
                  onClick={() => handleDeleteQuestion(question.questionId)}
                >
                  Delete Question
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestionForm;
