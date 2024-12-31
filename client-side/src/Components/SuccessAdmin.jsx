import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddQuestionForm from "./AddQuestionForm";
import AddExamForm from "./AddExamForm";
import ExamPaper from "./ExamPaper";

const SuccessAdmin = () => {
  const examid = 2;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/studentrecords");
  };
  const handlePrograms = () => {
    navigate("/studyprograms");
  };
  const handleExam = () => {
    navigate("/createexam");
  };
  const [formDataa, setFormData] = useState({
    username: "",
    password: "",
    roleId: "",
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    age: "",
    study_program_id: "",
    student_id: "",
  });
  //notifications
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  ////
  //submit function for notifications
  const SubmitNotification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/send-notification",
        {
          title,
          message,
         
        }
      );

      console.log(response.data);
      // Reset form fields after successful submission
      setTitle("");
      console.log(title);
      setMessage("");
     
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  ////////
  const handleChange = (e) => {
    setFormData({ ...formDataa, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log(formDataa.roleId);
    console.log(formDataa.study_program_id, "study_program id");
  }, [formDataa.roleId, formDataa.study_program_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", formDataa);
      console.log("Data submitted successfully");
      alert("Data Submitted successfully");
      // Optionally, you can reset the form fields here
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
// Fetch study programs from the API
const [programs, setPrograms] =useState([])
   
useEffect(() => {
  const fetchStudyPrograms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/studyprograms");
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching study programs:", error);
    }
  };

  fetchStudyPrograms();
}, []);
console.log("programs",programs)
  return (
    <div className="Admin-container">
      <div>
        <h1 id="page-title">Admin Panel</h1>
      </div>
      <div className="admin-page">
        <div className="user-create">
          <div className="form form--login">
            <div className="form--heading">Create User</div>
            <form autocomplete="off" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formDataa.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="password"
                  placeholder="Password"
                  value={formDataa.password}
                  onChange={handleChange}
                />
              </div>

              <h5>Choose Role</h5>
              <div className="radio-style">
                <div className="radio-btn">
                  <input
                    type="radio"
                    id="student"
                    name="roleId"
                    value="1"
                    checked={formDataa.roleId === "1"}
                    onChange={handleChange}
                    style={{ display: "inline-block", marginRight: "10px" }}
                  />
                  <label htmlFor="student">Student</label>
                </div>
              
              
                <div className="radio-btn">
                  <input
                    type="radio"
                    id="admin"
                    name="roleId"
                    value="3"
                    checked={formDataa.roleId === "3"}
                    onChange={handleChange}
                    style={{ display: "inline-block", marginRight: "10px" }}
                  />
                  <label htmlFor="admin">Admin</label>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formDataa.firstname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formDataa.lastname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formDataa.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formDataa.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formDataa.age}
                  onChange={handleChange}
                />
              </div>

              <div>
                {formDataa.roleId == 1 ? (
                  <select
                    name="study_program_id"
                    value={formDataa.study_program_id}
                    onChange={handleChange}
                  >
            
                   <option value="">Select Program</option>
    {programs.map(program => (
      <option key={program.study_program_id} value={program.study_program_id}>
        {program.program_name}
      </option>  ))}
                </select>
              ) : null}
                
              </div>
              <div>
                <input
                  type="text"
                  name="student_id"
                  placeholder="Student Id"
                  value={formDataa.student_id}
                  onChange={handleChange}
                />
              </div>
              {/* Add more fields as needed */}
              <button className="button">Create</button>
            </form>
          </div>
        </div>
        <div className="admin-records">
          <div className="admin-cards">
            <h3>Manage Student's Account</h3>
            <button className="button purple" onClick={handleClick}>
              Click Here to View Student Details
            </button>
          </div>
          <div className="admin-cards">
            <h3>
              <div>Study Programs and Courses</div>
            </h3>
            <button className="button yellow" onClick={handlePrograms}>
              Click Here to Manage Study Programs And Courses
            </button>
          </div>
          <div className="admin-cards">
            <h3>
              <div>Create New Exam</div>
            </h3>
            <button className="button yellow" onClick={handleExam}>
              Click Here to Creat New Exam
            </button>
          </div>
        </div>
        <div className="notification">
          <span>Send Notification Message</span>
          <form onSubmit={SubmitNotification}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Type Your Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
           
            <button className="button" type="submit">
              Send Notification
            </button>
          </form>
        </div>
       
      </div>
      <div>{/* <ExamPaper examId={examid} /> */}</div>
    </div>
  );
};

export default SuccessAdmin;
