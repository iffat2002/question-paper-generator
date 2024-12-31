import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const UpdateStudent = () => {
const { id } = useParams();
const [username,setName] = useState('');
const [email,setEmail] = useState('');

  useEffect(() => {
    axios
      .get("http://localhost:5000/students/" + id)
      .then(res=>{
            setName(res.data[0].username);
            setEmail(res.data[0].email);
      } )
      .catch((err) => console.log(err));
  }, [id]);
  const navigate = useNavigate();
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    axios.put(`http://localhost:5000/update/${id}` ,{username, email})
    .then(res=>{
       if(res.data.updated){
navigate('/studentrecords')
alert('Student Record Updated');
       }else{
        alert('not updated');
       }})
  }
  return <div>
    <h2>update student</h2>
    <form onSubmit={handleSubmit}>
    <div>
        <label htmlFor="">Name</label>
        <input type='text' value={username}  onChange={e=> setName(e.target.value)} />
    </div>
    <div>
        <label htmlFor="">Email</label>
        <input type='email' value={email} onChange={e=> setEmail(e.target.value)} /> 
    </div>
    <button>Update</button>
    </form>
 

  </div>;
};

export default UpdateStudent;
