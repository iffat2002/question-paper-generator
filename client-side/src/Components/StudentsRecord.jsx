import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentsRecord = () => {
  const [students, setStudents] = useState([]);

  

  // Fetch students data from the backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      setStudents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      // Remove deleted student from the list
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  
//   const handleUpdate = async (id) => {
//     try {
//       // Fetch the student data based on the ID
//       const response = await axios.get(`http://localhost:5000/students/${id}`);
//       const studentData = response.data;
  
//       // Implement your logic to open a modal or redirect to a form with the student data for updating
//       // For example, you can set the student data in a state variable and conditionally render a form
//       // When the form is submitted, send a PUT request to update the student record
  
//       // Set the student data in the form data state variable
   

  
//       // Open modal or redirect to update form
//     } catch (error) {
//       console.error('Error fetching student data for update:', error);
//     }
//   };
const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (id) => {
    setIsLoading(true);
    console.log(id)
    try {
      const response = await axios.post("http://localhost:5000/verify-student",{id});
      alert('Student verified successfully.');
    } catch (error) {
      setError('Failed to verify student. Please try again.');
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  return (
    <div>
      <h2>Admin Panel - Student Records</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.username}</td>
              <td>{student.email}</td>
              <td>
                <Link to={`/update/${student.id}`}><button>Update</button></Link>
 
                <button onClick={() => handleDelete(student.id)}>Delete</button>
{ student.verification == 0 ?  <button onClick={() => handleVerify(student.id)}>
                  Non-Verified
      </button> : <button onClick={() => handleVerify(student.id)}>
                  Verified
      </button> }
               
  
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  );
};

export default StudentsRecord;
