import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Home = () => {
  const [messageState, setMessageState] = useState('signup'); // Initial state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("this is data", data)
  
      const roleId  = data.roleId;
    
      const id= data.id
      // Redirect based on roleId
      if (roleId === 1) {
        navigate(`/successstudent?id=${id}`);
      } else if (roleId === 2) {
        navigate("/successteacher");
      } else if (roleId === 3) {
        navigate("/successadmin");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Login failed. Please try again.");
      alert('User Not Found')
      
    }
 
  };

  const handleSignupClick = () => {
    setMessageState('signup');
  };

  const handleLoginClick = () => {
    setMessageState('login');
  };

  const messageClass = messageState === 'signup' ? 'message signup' : 'message login';


  const [formDataa, setFormDataa] = useState({
    username: "",
    password: "",
    roleId: "1",
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    age: "",
    study_program_id: "",
  });

  const handleSignup = (e) => {
    setFormDataa({ ...formDataa, [e.target.name]: e.target.value });
  };
  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", formDataa);
      console.log("Data submitted successfully");
      alert("Thanks for Signing up. Please login to your account.");
     

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
    <div className="container">
      <div className={messageClass}>
        <div className="btn-wrapper">
          <button className="button" id="signup" onClick={handleSignupClick}>
            Sign Up
          </button>
          <button className="button" id="login" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </div>
      <div className="form form--signup">
        <div className="form--heading">Welcome! Sign Up</div>
        <form autocomplete="off" onSubmit={handleSubmitSignup}>
        <div>
             
              <input
                type="text"
                name="username"
                placeholder='Username'
                value={formDataa.username}
                onChange={handleSignup}
              />
            </div>
            <div>
              <input
                type="text"
                name="password"
                placeholder='Password'
                value={formDataa.password}
                onChange={handleSignup}
              />
            </div>
            {/* <select
              name="roleId"
              value={formDataa.roleId}
              onChange={handleSignup}
            >
              <option value="">Select role</option>
              <option value="1">Student</option>
              <option value="2">Teacher</option>
              <option value="3">Admin</option>
            </select> */}

            <div>
             
              <input
                type="text"
                name="firstname"
                placeholder='First Name'
                value={formDataa.firstname}
                onChange={handleSignup}
              />
            </div>
            <div>
              <input
                type="text"
                name="lastname"
                placeholder='Last Name'
                value={formDataa.lastname}
                onChange={handleSignup}
              />
            </div>
            <div>
      
              <input
                type="email"
                name="email"
                placeholder='Email Address'
                value={formDataa.email}
                onChange={handleSignup}
              />
            </div>

            <div>
    
              <input
                type="text"
                name="address"
                placeholder='Address'
                value={formDataa.address}
                onChange={handleSignup}
              />
            </div>
            <div>

              <input
                type="number"
                name="age"
                placeholder='Age'
                value={formDataa.age}
                onChange={handleSignup}
              />
            </div>
            <div>
              {formDataa.roleId == 1 ? (
                <select
                  name="study_program_id"
                  value={formDataa.study_program_id}
                  onChange={handleSignup}
                >
                   <option value="">Select Program</option>
    {programs.map(program => (
      <option key={program.study_program_id} value={program.study_program_id}>
        {program.program_name}
      </option>  ))}
                </select>
              ) : null}
            </div>
          <button className="button">Sign Up</button>
        </form>
      </div>
      <div className="form form--login">
        <div className="form--heading">Welcome back! </div>
        <form autocomplete="off" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
          <button className="button">Login</button>
        </form>
      </div>
    </div>
  );
};