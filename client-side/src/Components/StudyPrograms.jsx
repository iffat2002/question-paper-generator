import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

const StudyPrograms = () => {
    const [programs, setPrograms] = useState([]);
    // Fetch study_programs data from the backend
  const fetchPrograms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/studyprograms");
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const [text,settext]=useState(false);
  const handleClick = (e) =>{
    e.preventDefault();
    settext(true);
    console.log(text)
  }
  const[progName, setProgname] = useState('');
const nevigate=useNavigate();
const NewProgram = async(progName) =>{
  console.log(progName)

  try{
    await axios.post("http://localhost:5000/studyprograms", {progName});
    console.log('program inserted succesfully')
    alert("Program inserted succesfully");
    nevigate("/studyprograms")
  }catch (error) {
    console.error("Error submitting data:", error);
  }
}

  useEffect(() => {
    fetchPrograms();
  }, []);
  return (
    <div>
        <h2>Study Programs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Program Name</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program.study_program_id}>
              <td>{program.study_program_id}</td>
              <td>{program.program_name}</td>
              <td>
           <Link to={`/courses/${program.study_program_id}`}><button>View Program Courses</button></Link>
          

              </td>
            </tr>
            
          ))}
        </tbody>
      </table>
      {text ? <div> <textarea placeholder='Enter Program Name'  onChange={(e) => setProgname(e.target.value)}/><button onClick={() => NewProgram(progName)}>Submit</button></div> : <button onClick={handleClick}>Add New Program</button> }

    </div>
  )
}

export default StudyPrograms