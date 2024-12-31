import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateCoursesData = ({ study_program_id, course }) => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Set initial values when the component mounts
  useEffect(() => {
    console.log("this is course", course)
    if (course) {
      setCourseName(course.course_name);
      setDescription(course.description);
      // Assuming the chapters array contains strings
      if (course.chapters && course.chapters.length > 0) {
        setSelectedChapter(course.chapters[0]);
        setChapterName(course.chapters[0]);
      }
    }
  }, [course]);
  console.log(study_program_id, "course id");
  const [updatedChapters, setUpdatedChapters] = useState([...course.chapters]);
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const requestData = {
      courseId: course.course_id,
      courseName,
      description,
      updatedChapters: updatedChapters, // Send the updated chapters array to the backend
    };
  
    axios.put(
      `http://localhost:5000/coursedataupdate/${study_program_id}`,
      requestData
    )
      .then((response) => {
        setSuccessMessage("Data updated successfully.");
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage("An error occurred while updating data.");
        setSuccessMessage("");
      });
  };
  
  const handleChapterChange = (index, newValue) => {
    const newChapters = [...updatedChapters];
    newChapters[index] = newValue;
    setUpdatedChapters(newChapters);
  };

  return (
    <div>
      <h2>Update Data</h2>
      <form onSubmit={handleSubmit}>
        <label>Course Name:</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>chapter name</label>
        {updatedChapters.map((chapter) => (
          <div key={chapter.chapter_id}>
            <label>Edit Chapter Name:</label>
            <input
              type="text"
              value={chapter.chapter_name}
              onChange={(e) => handleChapterChange(chapter.chapter_id, e.target.value)}
            />
          </div>
        ))}
        <button type="submit">Update Data</button>
      </form>
      {errorMessage && <div>Error: {errorMessage}</div>}
      {successMessage && <div>{successMessage}</div>}
    </div>
  );
};

export default UpdateCoursesData;
