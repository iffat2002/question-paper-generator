import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import SuccessPage from "./Components/SuccessStudent";
import SuccessTeacher from "./Components/SuccessTeacher";
import SuccessAdmin from "./Components/SuccessAdmin";
import StudentsRecord from "./Components/StudentsRecord";
import UpdateStudent from "./Components/UpdateStudent";
import StudyPrograms from "./Components/StudyPrograms";
import ProgramCourses from "./Components/ProgramCourses";
import { Home } from "./Components/Home";
import AddQuestionForm from "./Components/AddQuestionForm";
import ExamPaper from "./Components/ExamPaper";
import AddExamForm from "./Components/AddExamForm";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* <Route path="/" element={<LoginForm />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/successstudent" element={<SuccessPage />} />
            <Route path="/successteacher" element={<SuccessTeacher />} />
            <Route path="/successadmin" element={<SuccessAdmin />} />
            <Route path="/studentrecords" element={<StudentsRecord />} />
            <Route path="/update/:id" element={<UpdateStudent />} />
            <Route path="/studyprograms" element={<StudyPrograms />} />
            <Route
              path="/courses/:study_program_id"
              element={<ProgramCourses />}
            />
            <Route path="/add-question" element={<AddQuestionForm />} />
            <Route path="/exam/:examId" element={<ExamPaper />} />
            <Route path="/createexam" element={<AddExamForm />} />
            
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
