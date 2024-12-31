import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateCoursesData from "./UpdateCoursesData";
import ExamStatusToggle from "./ExamStatusToggle";
import { useNavigate } from "react-router-dom";

const ProgramCourses = () => {
  
  const navigate = useNavigate();
  const { study_program_id } = useParams();

  const [courses, setCourses] = useState([]);
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [isAddChapterModalOpen, setAddChapterModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updatedata, setupdatedata] = useState([]);

  const openAddCourseModal = () => {
    setAddCourseModalOpen(true);
  };

  const closeAddCourseModal = () => {
    setAddCourseModalOpen(false);
  };

  const openAddChapterModal = () => {
    setAddChapterModalOpen(true);
  };

  const closeAddChapterModal = () => {
    setAddChapterModalOpen(false);
  };

  const openAddUpdateModal = (course) => {
    setUpdate(true);
    setupdatedata(course);
  };

  const closeAddUpdateModal = () => {
    setUpdate(false);
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/courseswithchaptersandexams?study_program_id=${study_program_id}`
      );

      setCourses(response.data);
      console.log("Fetched courses with chapters and exams:", response.data);
    } catch (error) {
      console.error("Error fetching courses with chapters and exams:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [study_program_id]);

  const addCourse = (formData) => {
    axios
      .post("http://localhost:5000/courses", formData)
      .then((response) => {
        console.log("Course added successfully:", response.data);
        alert("Course added successfully");
        closeAddCourseModal();
        fetchCourses(); // Refresh the courses list after adding a course
      })
      .catch((error) => {
        console.error("Error adding course:", error);
      });
  };

  const addChapter = (formData) => {
    axios
      .post("http://localhost:5000/chapters", formData)
      .then((response) => {
        console.log("Chapter added successfully:", response.data);
        closeAddChapterModal();
        alert("Chapters added successfully");
        fetchCourses(); // Refresh the courses list after adding a chapter
      })
      .catch((error) => {
        console.error("Error adding chapter:", error);
      });
  };

  const handleDelete = (course) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/courses/${course.course_id}`)
        .then((response) => {
          setCourses(courses.filter((c) => c.course_id !== course.course_id));
        })
        .catch((error) => {
          console.error("Error deleting course:", error);
        });
    }
  };

  const CourseForm = ({ onSubmit }) => {
    const [course_name, setCourseName] = useState("");
    const [description, setDescription] = useState("");
    // const [study_program_id, setStudyProgramId] = useState(study_program_id);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ course_name, description, study_program_id });
      setCourseName("");
      setDescription("");

      console.log(study_program_id, "sdhkjsdh");
    };
    
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Name"
          value={course_name}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Course</button>
      </form>
    );
  };
  const ChapterForm = ({ onSubmit }) => {
    const [chapter_name, setChapterName] = useState("");
    const [course_id, setCourseId] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ chapter_name, course_id });
      setChapterName("");
      setCourseId("");
      console.log(course_id, "course id");
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Chapter Name"
          value={chapter_name}
          onChange={(e) => setChapterName(e.target.value)}
        />

        <option value="">Select Course</option>
        <select value={course_id} onChange={(e) => setCourseId(e.target.value)}>
          <option value="" disabled>
            Select Chapter
          </option>
          {courses.map((course) => (
            <option
              key={course.course_id}
              onClick={() => setCourseId(course.course_id)}
              value={course.course_id}
            >
              {course.course_name}
            </option>
          ))}
        </select>

        <button type="submit">Add Chapter</button>
      </form>
    );
  };
  return (
    <div>
      <h2>Program Courses</h2>
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Description</th>
            <th>Chapters</th>
            <th>Exams</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td >{course.course_name}</td>
              <td style={{maxWidth:"220px"}}>{course.description}</td>
              <td>
                <ol>
                  {course.chapters.map((chapter) => (
                    <li key={chapter.chapter_id}>{chapter.chapter_name}</li>
                  ))}
                </ol>
              </td>
              <td>
                <ul>
                  {course.chapters.map((chapter) =>
                    chapter.exams.length > 0 ? (
                      <li key={chapter.chapter_id}>
                        {chapter.exams
                          .map((exam) => (
                         
                            <span
                            className="radio-btn"
                              key={exam.exam_id} 
                          
                            >
                              <p
                                onClick={() =>
                                  navigate(
                                    `/add-question?examId=${exam.exam_id}&courseId=${course.course_id}&chapterId=${chapter.chapter_id}`
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                              >
                                {exam.exam_name}
                              </p>
                              <ExamStatusToggle
                                examId={exam.exam_id}
                                currentPublish={exam.publish}
                                currentComplexity={exam.complexity}
                                currentTotalMarks={exam.total_marks}
                              />
                              
                            </span>
                          ))
                          .reduce((prev, curr) => [prev, ", ", curr])}
                      </li>
                    ) : null
                  )}
                </ul>
              </td>
              <td>
                <button onClick={() => openAddUpdateModal(course)}>Edit</button>{" "}
                <button onClick={() => handleDelete(course)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={openAddCourseModal}>Add Course</button>
      <button onClick={openAddChapterModal}>Add Chapter</button>

      <Modal show={update} onHide={closeAddUpdateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateCoursesData
            study_program_id={study_program_id}
            course={updatedata}
          />
        </Modal.Body>
      </Modal>

      <Modal show={isAddCourseModalOpen} onHide={closeAddCourseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CourseForm onSubmit={addCourse} />
        </Modal.Body>
      </Modal>

      <Modal show={isAddChapterModalOpen} onHide={closeAddChapterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Chapter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChapterForm onSubmit={addChapter} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProgramCourses;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Modal from "react-bootstrap/Modal";
// import "bootstrap/dist/css/bootstrap.min.css";
// import UpdateCoursesData from "./UpdateCoursesData";

// const ProgramCourses = () => {
//   const { study_program_id } = useParams();

//   const [courses, setCourses] = useState([]);
//   const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
//   const [isAddChapterModalOpen, setAddChapterModalOpen] = useState(false);
//   const openAddCourseModal = () => {
//     setAddCourseModalOpen(true);
//   };

//   const closeAddCourseModal = () => {
//     setAddCourseModalOpen(false);
//   };

//   const openAddChapterModal = () => {
//     setAddChapterModalOpen(true);
//   };

//   const closeAddChapterModal = () => {
//     setAddChapterModalOpen(false);
//   };
//   const [update, setUpdate] = useState(false);
//   const [updatedata, setupdatedata] = useState([]);
//   const openAddUpdateModal = (course) => {
//     setUpdate(true);
//     setupdatedata(course);
//   };
//   console.log(updatedata, "update dataa");
//   const closeAddUpdateModal = () => {
//     setUpdate(false);
//   };

//   const fetchCourses = async () => {
//     console.log("study_program_id:", study_program_id); // Log the value
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/coursewithchapters/" + study_program_id
//       );

//       setCourses(response.data);
//       console.log("this is course data complete with chapters", response.data);
//     } catch (error) {
//       console.error("Error fetching courses with chapters and exams:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, [study_program_id]);

//   const addCourse = (formData) => {
//     axios
//       .post("http://localhost:5000/courses", formData)
//       .then((response) => {
//         console.log("Course added successfully:", response.data);
//         alert("Course added successfully");
//         closeAddCourseModal();
//       })
//       .catch((error) => {
//         console.error("Error adding course:", error);
//       });
//   };

//   const addChapter = (formData) => {
//     axios
//       .post("http://localhost:5000/chapters", formData)
//       .then((response) => {
//         console.log("Chapter added successfully:", response.data);
//         closeAddChapterModal();
//         alert("Chapters added successfully");
//       })
//       .catch((error) => {
//         console.error("Error adding chapter:", error);
//       });
//   };
//   const ChapterForm = ({ onSubmit }) => {
//     const [chapter_name, setChapterName] = useState("");
//     const [course_id, setCourseId] = useState("");

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSubmit({ chapter_name, course_id });
//       setChapterName("");
//       setCourseId("");
//       console.log(course_id, "course id");
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Chapter Name"
//           value={chapter_name}
//           onChange={(e) => setChapterName(e.target.value)}
//         />

//         <option value="">Select Course</option>
//         <select value={course_id} onChange={(e) => setCourseId(e.target.value)}>
//         <option value="" disabled>Select Chapter</option>
//           {courses.map((course) => (
//             <option
//               key={course.course_id}
//               onClick={() => setCourseId(course.course_id)}
//               value={course.course_id}
//             >
//               {course.course_name}
//             </option>
//           ))}
//         </select>

//         <button type="submit">Add Chapter</button>
//       </form>
//     );
//   };

//   const tableStyle = {
//     width: "100%",
//     borderCollapse: "collapse",
//     margin: "20px 0",
//     fontSize: "1em",
//     textAlign: "left",
//   };

//   const thTdStyle = {
//     padding: "12px 15px",
//     border: "1px solid #ddd",
//   };

//   const thStyle = {
//     backgroundColor: "#f2f2f2",
//   };

//   const trEvenStyle = {
//     backgroundColor: "#f9f9f9",
//   };

//   const h2Style = {
//     color: "#333",
//     marginBottom: "10px",
//   };

//   const olStyle = {
//     paddingLeft: "20px",
//   };

//   const liStyle = {
//     margin: "5px 0",
//   };

//   const CourseForm = ({ onSubmit }) => {
//     const [course_name, setCourseName] = useState("");
//     const [description, setDescription] = useState("");
//     // const [study_program_id, setStudyProgramId] = useState(study_program_id);

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSubmit({ course_name, description, study_program_id });
//       setCourseName("");
//       setDescription("");

//       console.log(study_program_id, "sdhkjsdh");
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Course Name"
//           value={course_name}
//           onChange={(e) => setCourseName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <button type="submit">Add Course</button>
//       </form>
//     );
//   };

//   const handleDelete = (course) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this course?"
//     );
//     if (confirmDelete) {
//       axios
//         .delete(`http://localhost:5000/courses/${course.course_id}`)
//         .then((response) => {
//           // Filter out the deleted course from the courses array
//           const updatedCourses = courses.filter(
//             (c) => c.course_id !== course.course_id
//           );
//           setCourses(updatedCourses);
//         })
//         .catch((error) => {
//           console.error("Error deleting course:", error);
//           // Handle error
//         });
//     }
//   };

//   return (
//     <div>
//       <h2 style={h2Style}>Program Courses</h2>
//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             <th style={{ ...thTdStyle, ...thStyle }}>Course Name</th>
//             <th style={{ ...thTdStyle, ...thStyle }}>Description</th>
//             <th style={{ ...thTdStyle, ...thStyle }}>Chapters</th>
//             <th style={{ ...thTdStyle, ...thStyle }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {courses.map((course, index) => (
//             <tr key={index} style={index % 2 === 0 ? trEvenStyle : null}>
//               <td style={thTdStyle}>{course.course_name}</td>
//               <td style={thTdStyle}>{course.description}</td>
//               <td style={thTdStyle}>
//                 {" "}
//                 <ol>
//                   {course.chapters.map((chapter) => (
//                     <li key={chapter.chapter_id} style={liStyle}>
//                       {chapter.chapter_name}
//                     </li>
//                   ))}
//                 </ol>
//               </td>
//               <td style={thTdStyle}>
//                 <button onClick={() => openAddUpdateModal(course)}>Edit</button>{" "}
//                 <button onClick={() => handleDelete(course)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button onClick={openAddCourseModal}>Add Course</button>
//       <button onClick={openAddChapterModal}>Add Chapter</button>
//       <Modal show={update} onHide={closeAddUpdateModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Update Data</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <UpdateCoursesData
//             study_program_id={study_program_id}
//             course={updatedata}
//           />
//         </Modal.Body>
//       </Modal>
//       <Modal show={isAddCourseModalOpen} onHide={closeAddCourseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Course</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <CourseForm onSubmit={addCourse} />
//         </Modal.Body>
//       </Modal>

//       <Modal show={isAddChapterModalOpen} onHide={closeAddChapterModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Chapter</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <ChapterForm onSubmit={addChapter} />
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default ProgramCourses;
