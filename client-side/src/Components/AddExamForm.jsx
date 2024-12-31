import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExamForm = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [getCourses, setGetcourses] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [courseId, setCourseId] = useState("");
  const [chapterId, setChapterId] = useState("");


  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchCourses();
    }
  }, [selectedProgram]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/studyprograms");
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching study programs:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/coursewithchapters/${selectedProgram}`
      );
      setGetcourses(response.data);
    } catch (error) {
      console.error("Error fetching courses with chapters:", error);
    }
  };

  const selectProgram = (event) => {
    setSelectedProgram(event.target.value);
  };

  const selectCourse = (event) => {
    const selectedCourseId = event.target.value;
    setCourseId(selectedCourseId);
    const selectedCourse = getCourses.find(
      (course) => course.course_id === parseInt(selectedCourseId)
    );
    if (selectedCourse) {
      setChapters(selectedCourse.chapters);
    }
  };

  const selectChapter = (event) => {
    setChapterId(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/exams", {
        exam_name: examName,
        exam_date: examDate,
        total_marks: totalMarks,
        course_id: courseId,
        chapter_id: chapterId,
      });
      console.log("New exam created:", res.data);

      const examid= res.data.id;
      console.log("exam id", examid)


      setExamName("");
      setExamDate("");
      setTotalMarks("");
      setCourseId("");
      setChapterId("");
      if (window.confirm("Add Questions to your exam")) {
        navigate(`/add-question?examId=${examid}&courseId=${courseId}&chapterId=${chapterId}`);
      }
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };


   


 

  return (
    <div>
      <h1>Create New Exam</h1>
      <form>
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="Exam Name"
          required
        />
        <select value={selectedProgram} onChange={selectProgram}>
          <option value="" disabled>Select Program</option>
          {programs.map((option) => (
            <option key={option.study_program_id} value={option.study_program_id}>
              {option.program_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          required
        />
        <input
          type="number"
          value={totalMarks}
          onChange={(e) => setTotalMarks(e.target.value)}
          placeholder="Total Marks"
          required
        />
        {getCourses.length > 0 && (
          <select value={courseId} onChange={selectCourse}>
            <option value="" disabled>Select Course</option>
            {getCourses.map((option) => (
              <option key={option.course_id} value={option.course_id}>
                {option.course_name}
              </option>
            ))}
          </select>
        )}
        {chapters.length > 0 && (
          <select value={chapterId} onChange={selectChapter}>
            <option value="" disabled>Select Chapter</option>
            {chapters.map((option) => (
              <option key={option.chapter_id} value={option.chapter_id}>
                {option.chapter_name}
              </option>
            ))}
          </select>
        )}
        <button type="button" onClick={handleSubmit}>Create Exam</button>
      </form>
     
    </div>
  );
};

export default AddExamForm;
