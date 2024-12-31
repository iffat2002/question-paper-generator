import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ShowNotification from "./ShowNotification";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get("id");
  const [users, setUsers] = useState([]);
  const [studyprogram, setStudyprogram] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [chaptersAndcourses, setChaptersAndCourses] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [grades, setGrades] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/students");
        for (let i = 0; i <= response.data.length; i++) {
          if (response.data[i]?.id == id) {
            setUsers(response.data[i]);
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/grades/student/${id}`
        );
        setGrades(response.data);
        console.log("EXAM GRADES DETAILSSSSSSSSSSSSSSSSSS", response.data);
      } catch (error) {
        console.error("ERORRRRRRRRRRR:", error);
        setError(error);
      }
    };

    fetchGrades();
  }, [id]);
  useEffect(() => {
    const studyProgram = async () => {
      try {
        const response = await axios.get("http://localhost:5000/studyprograms");
        for (let i = 0; i <= response.data.length; i++) {
          if (response.data[i]?.study_program_id == users?.study_program_id) {
            setStudyprogram(response.data[i]);
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    studyProgram();
    // fetchCourses();
  }, [users]);
  console.log("userssss", users);
  console.log("study program: ", studyprogram);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/courseswithchaptersandexams?study_program_id=${studyprogram?.study_program_id}`
      )

      .then((response) => {
        setCourseData(response.data);
        console.log("this is course data complete with exams", response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses with chapters and exams:", error);
      });
  }, [studyprogram]);
  const getExamStatus = (examId) => {
    const grade = grades.find((g) => g.exam_id === examId);
    return grade
      ? grade.submit_status
        ? "Submitted"
        : "Not Submitted"
      : "Not Attempted";
  };

  const getExamResult = (examId) => {
    const grade = grades.find((g) => g.exam_id === examId);
    return grade ? grade.score : "N/A";
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date to a human-readable format
  };

  return (
    <div>
      <div className="bg-black p-2 text-white text-center">
        <h1>
          Welcome {users.firstname} {users.lastname}
        </h1>
        <ShowNotification />
      </div>
      <div className="sub-heading">
        <h1>your degree program is: {studyprogram?.program_name}</h1>
      </div>
      <h2>Available Program Courses</h2>

      <div className="course-container">
        {courseData.map((course) => (
          <div className="course-card" key={course.course_id}>
            <h2>{course.course_name}</h2>
            <p>{course.description}</p>
            <table>
              <thead>
                <tr>
                  <th>Chapter Name</th>
                  <th>Exam Name</th>
                  <th>Date</th>
                  <th>Total Marks</th>
                  <th>Status</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {course.chapters.map((chapter) => {
                  // Filter exams by publish status
                  const publishedExams = chapter.exams.filter(
                    (exam) => exam.publish === 1
                  );

                  // Render the chapter name and exams
                  return (
                    <>
                      {publishedExams.length > 0 ? (
                        publishedExams.map((exam) => {
                          const status = getExamStatus(exam.exam_id);

                          return (
                            <tr key={exam.exam_id}>
                              <td>{chapter.chapter_name}</td>
                              <td>
                                <ul>
                                  <li>
                                    {status === "Submitted" ? (
                                      exam.exam_name
                                    ) : (
                                      <a
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          navigate(
                                            `/exam/${exam.exam_id}?studentId=${id}`
                                          )
                                        }
                                      >
                                        {exam.exam_name}
                                      </a>
                                    )}
                                  </li>
                                </ul>
                              </td>
                              <td>
                                <ul>
                                  <li>{formatDate(exam.exam_date)}</li>
                                </ul>
                              </td>
                              <td>
                                <ul>
                                  <li>{exam.total_marks}</li>
                                </ul>
                              </td>
                              <td>
                                <ul>
                                  <li>{status}</li>
                                </ul>
                              </td>
                              <td>
                                <ul>
                                  <li>{getExamResult(exam.exam_id)}</li>
                                </ul>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        // Render a row indicating no published exams
                        <tr key={chapter.chapter_id}>
                          <td rowSpan={1}>{chapter.chapter_name}</td>
                          <td colSpan="5">-</td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.course_name}</td>
              <td>{course.description}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default SuccessPage;
