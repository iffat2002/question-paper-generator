const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Import Socket.IO and create an HTTP server
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "myfyp2002",
  database: "question-paper-generator",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.post("/login", (req, res) => {
  console.log("Received login request from frontend");
  const { username, password } = req.body;

  db.query(
    "SELECT id, roleId  , firstname, lastname  FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error("Error retrieving user:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: "Invalid username or password" });

        return;
      }

      // Assuming username and password match directly
      // const roleId = results[0].roleId;
      const { id, roleId, firstname, lastname } = results[0];
      res
        .status(200)
        .json({ message: "Login successful", id, roleId, firstname, lastname });
      console.log("these are", results, id, roleId, firstname, lastname);
    }
  );
});
/// Sign up for all users under admin control
app.post("/signup", (req, res) => {
  const {
    username,
    password,
    roleId,
    firstname,
    lastname,
    email,
    address,
    age,
    study_program_id,
    student_id,
  } = req.body;
  const query =
    "INSERT INTO users ( username, password,  roleId,firstname, lastname, email,address  ,age, study_program_id,student_id ) VALUES (? ,?, ?, ?, ?, ?, ?,?,?,?)";
  db.query(
    query,
    [
      username,
      password,
      roleId,
      firstname,
      lastname,
      email,
      address,
      age,
      study_program_id,
      student_id,
    ],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Error inserting data" });
      } else {
        console.log("Data inserted successfully");
        res.status(200).json({ message: "Data inserted successfully" });
      }
    }
  );
});
//Retrive student data from users where roleId ===1
app.get("/students", async (req, res) => {
  try {
    // Assuming roleId is passed as a query parameter
    const roleId = req.query.roleId || 1; // Default to roleId === 1 if not provided

    // Query database to retrieve students with roleId === 1
    db.query(
      "SELECT * FROM users WHERE roleId = ?",
      [roleId],
      (error, results) => {
        if (error) {
          console.error("Error fetching students:", error);
          res.status(500).json({ error: "Failed to fetch students" });
        } else {
          res.json(results);
        }
      }
    );
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  } finally {
    console.log("these are students record");
  }
});
//delete student record
// Delete student record
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ error: "Failed to delete student" });
    } else {
      console.log("Student deleted successfully");
      res.status(200).json({ message: "Student deleted successfully" });
    }
  });
});

app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM users WHERE id = ?";

  db.query(sql, [id], (error, results) => {
    if (error) return res.json("error");
    return res.json(results);
  });
});

//Update student record
app.put("/update/:id", (req, res) => {
  const query = "UPDATE users SET `username`= ?, `email` = ? WHERE id = ?";
  const id = req.params.id;
  db.query(query, [req.body.username, req.body.email, id], (error, results) => {
    if (error) return res.json("errrrrror");
    return res.json({ updated: true });
  });
});
//Student Verification
app.post("/verify-student", (req, res) => {
  const id = req.body.id;

  // Update verification column for the specified user
  //  const sql = 'UPDATE users SET `verification` = 1 WHERE id = ?';

  db.query(
    "UPDATE users SET `verification` = 1 WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error verifying student: " + err.message);
        res
          .status(500)
          .json({ error: "An error occurred while verifying student." });
        return;
      }

      res.json({ message: "Student verified successfully." });
    }
  );
});

//get all study_programs
app.get("/studyprograms", async (req, res) => {
  try {
    // Assuming roleId is passed as a query parameter

    // Query database to retrieve students with roleId === 1
    db.query("SELECT * FROM study_programs", (error, results) => {
      if (error) {
        console.error("Error fetching study programs", error);
        res.status(500).json({ error: "Failed to fetch study programs" });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error("Error fetching study programs:", error);
    res.status(500).json({ error: "Failed to fetch study programs" });
  }
});

app.get("/courses/:study_program_id", (req, res) => {
  const { study_program_id } = req.params;
  const sql = "SELECT * FROM courses WHERE study_program_id = ?";

  db.query(sql, [study_program_id], (error, results) => {
    if (error) return res.json("error");
    return res.json(results);
  });
});

//add new Study programs
app.post("/studyprograms", (req, res) => {
  const program_name = req.body.progName;
  const query = "INSERT INTO study_programs (program_name) VALUES (?)";
  db.query(query, [program_name], (err, results) => {
    if (err) return res.json("error inserting new program");
    return res.json(results);
  });
});

app.post("/send-notification", (req, res) => {
  const { title, message } = req.body;

  const notificationInsertQuery =
    "INSERT INTO notifications (title, message,  created_at) VALUES ( ?, ?, ?)";

  db.beginTransaction(function (err) {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error beginning transaction" });
    }

    // Insert notification
    db.query(
      notificationInsertQuery,
      [title, message, new Date()],
      (error, notificationResults) => {
        if (error) {
          console.error("Error inserting notification:", error);
          return db.rollback(() => {
            res.status(500).json({ message: "Error inserting notification" });
          });
        }

        db.commit((commitErr) => {
          if (commitErr) {
            console.error("Error committing transaction:", commitErr);
            return res
              .status(500)
              .json({ message: "Error committing transaction" });
          }

          res.status(200).json({ message: "Notification sent successfully" });
        });
      }
    );
  });
});

//get notifications
app.get("/notifications", (req, res) => {
  // Query to fetch notifications
  const query = `
    SELECT id, title, message, created_at
    FROM notifications
    ORDER BY created_at DESC
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Error fetching notifications" });
    }

    res.status(200).json({ notifications: results });
  });
});

/////////////////////QUESTION PAPER/////////////////////////////////////////////////////////////

// POST a new question
app.post("/add-question", (req, res) => {
  const {
    text,
    complexity,
    weightage,
    difficultyLevel,
    courseId,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    chapter_id,
    examId,
  } = req.body;

  // Assuming you have established a MySQL connection and have a pool object available
  db.query(
    "INSERT INTO questions (question_text, complexity, weightage, difficulty_level, course_id, option_a, option_b, option_c, option_d, correct_option, chapter_id, exam_id) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
    [
      text,
      complexity,
      weightage,
      difficultyLevel,
      courseId,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      chapter_id,
      examId,
    ],
    (error, results) => {
      if (error) {
        console.error("Error adding question:", error);
        return res.status(500).json({ message: "Error adding question" });
      }
      console.log("New question added:", results.insertId);
      console.log("chapter id is", results);
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  );
});

//  create a new exam record
app.post("/exams", async (req, res) => {
  const { exam_name, exam_date, total_marks, course_id, chapter_id } = req.body;

  db.query(
    "INSERT INTO exam (exam_name, exam_date, total_marks, course_id, chapter_id) VALUES (?,?, ?, ?, ?)",
    [exam_name, exam_date, total_marks, course_id, chapter_id],
    (error, results) => {
      if (error) {
        console.error("Error adding question:", error);
        return res.status(500).json({ message: "Error adding question" });
      }
      console.log("New question added:", results.insertId);
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  );
});

//get exam paper ready
app.get("/exam/:examId", (req, res) => {
  const examId = req.params.examId;

  // Step 1: Fetch the exam details
  db.query(
    `SELECT * FROM exam WHERE exam_id = ?`,
    [examId],
    (error, examResults) => {
      if (error) {
        console.error("Error fetching exam:", error);
        return res.status(500).json({ message: "Error fetching exam" });
      }

      if (examResults.length === 0) {
        console.log(`No exam found with examId: ${examId}`);
        return res.status(404).json({ message: "Exam not found" });
      }

      const examData = examResults[0];

      // Step 2: Fetch related questions based on difficulty_level
      db.query(
        `SELECT * FROM questions WHERE course_id = ? AND chapter_id = ? AND difficulty_level = ?`,
        [examData.course_id, examData.chapter_id, examData.complexity],
        (questionError, questionResults) => {
          if (questionError) {
            console.error("Error fetching questions:", questionError);
            return res
              .status(500)
              .json({ message: "Error fetching questions" });
          }

          // Log the fetched questions for debugging
          console.log("Fetched questions:", questionResults);

          // Step 3: Sort questions by weightage in ascending order
          questionResults.sort((a, b) => a.weightage - b.weightage);

          // Accumulate questions until total weightage equals totalMarks
          let totalWeightage = 0;
          const selectedQuestions = [];

          for (const question of questionResults) {
            if (totalWeightage + question.weightage <= examData.total_marks) {
              selectedQuestions.push(question);
              totalWeightage += question.weightage;
            }
            if (totalWeightage >= examData.total_marks) break;
          }

          // Check if we met the required totalMarks
          if (totalWeightage < examData.total_marks) {
            return res
              .status(400)
              .json({
                message:
                  "ERR: total weightage is lower than total Marks. Please add more questions or adjust total Marks.",
              });
          }
          if (totalWeightage > examData.total_marks) {
            return res
              .status(400)
              .json({
                message:
                  "ERR: weightage is higher than total marks. Adjust total marks in the exam.",
              });
          }

          // Step 4: Format the response
          const formattedData = {
            exam: {
              examId: examData.exam_id,
              examName: examData.exam_name,
              examDate: examData.exam_date,
              publish: examData.publish,
              complexity: examData.complexity,
              totalMarks: examData.total_marks,
              courseId: examData.course_id,
              chapterId: examData.chapter_id,
              questions: selectedQuestions.map((row) => ({
                questionId: row.question_id,
                questionText: row.question_text,
                complexity: row.complexity,
                weightage: row.weightage,
                difficultyLevel: row.difficulty_level,
                optionA: row.option_a,
                optionB: row.option_b,
                optionC: row.option_c,
                optionD: row.option_d,
                correctOption: row.correct_option,
              })),
            },
          };

          // Step 5: Send the response
          res.status(200).json(formattedData);
        }
      );
    }
  );
});
// Get exam paper ready
// Get exam details
// Get exam data along with associated questions
app.get("/examedit/:examId", (req, res) => {
  const examId = req.params.examId;

  // Step 1: Fetch the exam details
  db.query(
    `SELECT * FROM exam WHERE exam_id = ?`,
    [examId],
    (error, examResults) => {
      if (error) {
        console.error("Error fetching exam:", error);
        return res.status(500).json({ message: "Error fetching exam" });
      }

      if (examResults.length === 0) {
        console.log(`No exam found with examId: ${examId}`);
        return res.status(404).json({ message: "Exam not found" });
      }

      const examData = examResults[0];

      // Step 2: Fetch related questions based on exam_id
      db.query(
        `SELECT * FROM questions WHERE exam_id = ?`,
        [examData.exam_id],
        (questionError, questionResults) => {
          if (questionError) {
            console.error("Error fetching questions:", questionError);
            return res.status(500).json({ message: "Error fetching questions" });
          }

          // Log the fetched questions for debugging
          console.log("Fetched questions:", questionResults);

          // Step 3: Format the response
          const formattedData = {
            exam: {
              examId: examData.exam_id,
              examName: examData.exam_name,
              examDate: examData.exam_date,
              publish: examData.publish,
              complexity: examData.complexity,
              totalMarks: examData.total_marks,
              courseId: examData.course_id,
              chapterId: examData.chapter_id,
              questions: questionResults.map((row) => ({
                questionId: row.question_id,
                questionText: row.question_text,
                complexity: row.complexity,
                weightage: row.weightage,
                difficultyLevel: row.difficulty_level,
                optionA: row.option_a,
                optionB: row.option_b,
                optionC: row.option_c,
                optionD: row.option_d,
                correctOption: row.correct_option,
              })),
            },
          };

          // Step 4: Send the response
          res.status(200).json(formattedData);
        }
      );
    }
  );
});


// Endpoint to fetch exams for a given chapter and course
app.get("/exams", (req, res) => {
  const { chapter_id, course_id } = req.query;

  // Assuming you have a table named 'exams' in your database
  db.query(
    "SELECT * FROM exam WHERE chapter_id = ? AND course_id = ?",
    [chapter_id, course_id],
    (error, results) => {
      if (error) {
        console.error("Error fetching exams:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching exams." });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

////////combine chapters and///////////
app.get("/courseswithchaptersandexams", (req, res) => {
  const studyProgramId = req.query.study_program_id;
  // Query to retrieve all courses along with their associated chapters and exams
  const query = `
    SELECT c.course_id, c.course_name, c.description, ch.chapter_id, ch.chapter_name, e.exam_id, e.exam_name, e.exam_date, e.total_marks, e.publish, e.complexity
    FROM courses c
    LEFT JOIN chapters ch ON c.course_id = ch.course_id
    LEFT JOIN exam e ON ch.chapter_id = e.chapter_id AND c.course_id = e.course_id
    WHERE
        c.study_program_id = ?
  `;

  db.query(query, [studyProgramId], (error, results) => {
    if (error) {
      console.error("Error fetching courses with chapters and exams:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      // Organize the results into a structured format
      const coursesWithChaptersAndExams = {};
      results.forEach((row) => {
        if (!coursesWithChaptersAndExams[row.course_id]) {
          coursesWithChaptersAndExams[row.course_id] = {
            course_id: row.course_id,
            course_name: row.course_name,
            description: row.description,
            chapters: [],
          };
        }
        if (row.chapter_id) {
          const chapter = {
            chapter_id: row.chapter_id,
            chapter_name: row.chapter_name,
            exams: [],
          };
          if (row.exam_id) {
            chapter.exams.push({
              exam_id: row.exam_id,
              exam_name: row.exam_name,
              exam_date: row.exam_date,
              total_marks: row.total_marks,
              complexity: row.complexity,
              publish: row.publish,
            });
          }
          coursesWithChaptersAndExams[row.course_id].chapters.push(chapter);
        }
      });
      // Convert the coursesWithChaptersAndExams object into an array
      const coursesArray = Object.values(coursesWithChaptersAndExams);
      res.status(200).json(coursesArray);
    }
  });
});

app.post("/submit-response", async (req, res) => {
  const { id, exam_id, question_id, selected_option } = req.body;

  try {
    const correctOptionQuery = `
      SELECT correct_option FROM questions WHERE question_id = ?
    `;
    const [correctOptionResult] = await db
      .promise()
      .query(correctOptionQuery, [question_id]);
    const correct_option = correctOptionResult[0].correct_option;
    const is_correct = selected_option === correct_option ? 1 : 0;

    const responseQuery = `
      INSERT INTO student_responses (id, exam_id, question_id, selected_option, is_correct, response_date)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const responseValues = [
      id,
      exam_id,
      question_id,
      selected_option,
      is_correct,
    ];

    await db.promise().query(responseQuery, responseValues);
    res.send("Response recorded successfully");
    console.log("Response recorded successfully");
  } catch (err) {
    console.error("Error recording response:", err);
    res.status(500).send("Error recording response");
  }
});

// app.get("/coursewithchapters/:study_program_id", (req, res) => {
//   const studyProgramId = req.params.study_program_id;
//   // Query to retrieve all courses along with their associated chapters
//   const query = `
//     SELECT c.course_id, c.course_name, c.description, ch.chapter_id, ch.chapter_name
//     FROM courses c
//     LEFT JOIN chapters ch ON c.course_id = ch.course_id
//     WHERE c.study_program_id = ?
//   `;

//   db.query(query, [studyProgramId], (error, results) => {
//     if (error) {
//       console.error("Error fetching courses with chapters:", error);
//       res.status(500).json({ error: "An error occurred while fetching data." });
//     } else {
//       // Organize the results into a structured format
//       const coursesWithChapters = {};
//       results.forEach((row) => {
//         if (!coursesWithChapters[row.course_id]) {
//           coursesWithChapters[row.course_id] = {
//             course_id: row.course_id,
//             course_name: row.course_name,
//             description: row.description,
//             chapters: [],
//           };
//         }
//         // Push chapter name into the chapters array
//         coursesWithChapters[row.course_id].chapters.push(row.chapter_name);
//       });

//       // Convert the coursesWithChapters object into an array
//       const coursesArray = Object.values(coursesWithChapters);
//       res.status(200).json(coursesArray);
//     }
//   });
// });

app.get("/coursewithchapters/:study_program_id", (req, res) => {
  const studyProgramId = req.params.study_program_id;
  // Query to retrieve all courses along with their associated chapters
  const query = `
    SELECT c.course_id, c.course_name, c.description, ch.chapter_id, ch.chapter_name
    FROM courses c
    LEFT JOIN chapters ch ON c.course_id = ch.course_id
    WHERE c.study_program_id = ?
  `;

  db.query(query, [studyProgramId], (error, results) => {
    if (error) {
      console.error("Error fetching courses with chapters:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      // Organize the results into a structured format
      const coursesWithChapters = {};
      results.forEach((row) => {
        if (!coursesWithChapters[row.course_id]) {
          coursesWithChapters[row.course_id] = {
            course_id: row.course_id,
            course_name: row.course_name,
            description: row.description,
            chapters: [],
          };
        }
        // Push chapter_id and chapter_name into the chapters array
        if (row.chapter_id) {
          coursesWithChapters[row.course_id].chapters.push({
            chapter_id: row.chapter_id,
            chapter_name: row.chapter_name,
          });
        }
      });

      // Convert the coursesWithChapters object into an array
      const coursesArray = Object.values(coursesWithChapters);
      res.status(200).json(coursesArray);
    }
  });
});

app.post("/courses", (req, res) => {
  const { course_name, description, study_program_id } = req.body;

  // Validate the request body
  if (!course_name || !description || !study_program_id) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    INSERT INTO courses (course_name, description, study_program_id)
    VALUES (?, ?, ?)
  `;

  db.query(
    query,
    [course_name, description, study_program_id],
    (error, results) => {
      if (error) {
        console.error("Error inserting new course:", error);
        return res
          .status(500)
          .json({ error: "An error occurred while inserting new course." });
      }

      // Optionally, you can return the ID of the newly created course
      const courseId = results.insertId;
      res
        .status(200)
        .json({ message: "New course added successfully.", courseId });
    }
  );
});

// DELETE route to delete a course and its associated chapters
app.delete("/courses/:course_id", (req, res) => {
  const courseId = req.params.course_id;

  // Begin a transaction
  db.beginTransaction((error) => {
    if (error) {
      console.error("Error beginning transaction:", error);
      res
        .status(500)
        .json({ error: "An error occurred while starting transaction." });
      return;
    }

    // Delete the associated chapters first
    const deleteChaptersQuery = `
      DELETE FROM chapters
      WHERE course_id = ?
    `;
    db.query(deleteChaptersQuery, [courseId], (error, chapterResult) => {
      if (error) {
        db.rollback(() => {
          console.error("Error deleting chapters:", error);
          res
            .status(500)
            .json({ error: "An error occurred while deleting chapters." });
        });
        return;
      }

      // Then delete the course
      const deleteCourseQuery = `
        DELETE FROM courses
        WHERE course_id = ?
      `;
      db.query(deleteCourseQuery, [courseId], (error, courseResult) => {
        if (error) {
          db.rollback(() => {
            console.error("Error deleting course:", error);
            res
              .status(500)
              .json({ error: "An error occurred while deleting course." });
          });
          return;
        }

        // Commit the transaction if all queries were successful
        db.commit((error) => {
          if (error) {
            db.rollback(() => {
              console.error("Error committing transaction:", error);
              res
                .status(500)
                .json({
                  error: "An error occurred while committing transaction.",
                });
            });
          } else {
            res
              .status(200)
              .json({
                success: true,
                message: "Course and associated chapters deleted successfully.",
              });
          }
        });
      });
    });
  });
});

app.put("/coursedataupdate/:study_program_id", (req, res) => {
  const studyProgramId = req.params.study_program_id;
  const { courseId, courseName, description, updatedChapters } = req.body;

  // Begin a transaction
  db.beginTransaction((error) => {
    if (error) {
      console.error("Error beginning transaction:", error);
      res
        .status(500)
        .json({ error: "An error occurred while starting transaction." });
      return;
    }

    // Update course data
    const updateCourseQuery = `
      UPDATE courses
      SET course_name = ?, description = ?
      WHERE course_id = ? AND study_program_id = ?
    `;
    db.query(
      updateCourseQuery,
      [courseName, description, courseId, studyProgramId],
      (error, courseResult) => {
        if (error) {
          db.rollback(() => {
            console.error("Error updating course:", error);
            res
              .status(500)
              .json({ error: "An error occurred while updating course." });
          });
          return;
        }

        // Update chapter data

        const updateChapterQueries = updatedChapters.map(
          (chapterName, index) => {
            return `
            UPDATE chapters
            SET chapter_name = ?
            WHERE chapter_id = ? AND course_id = ?
          `;
          }
        );

        // Execute all chapter update queries in parallel
        Promise.all(
          updateChapterQueries.map((query, index) => {
            return new Promise((resolve, reject) => {
              db.query(
                query,
                [updatedChapters[index], index + 1, courseId],
                (error, chapterResult) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(chapterResult);
                  }
                }
              );
            });
          })
        )
          .then(() => {
            // Commit the transaction if all queries were successful
            db.commit((error) => {
              if (error) {
                db.rollback(() => {
                  console.error("Error committing transaction:", error);
                  res
                    .status(500)
                    .json({
                      error: "An error occurred while committing transaction.",
                    });
                });
              } else {
                res
                  .status(200)
                  .json({
                    success: true,
                    message: "Data updated successfully.",
                  });
              }
            });
          })
          .catch((error) => {
            db.rollback(() => {
              console.error("Error updating chapters:", error);
              res
                .status(500)
                .json({ error: "An error occurred while updating chapters." });
            });
          });
      }
    );
  });
});

app.post("/chapters", (req, res) => {
  const { chapter_name, course_id } = req.body;

  const query = `
    INSERT INTO chapters (chapter_name, course_id)
    VALUES (?, ?)
  `;

  db.query(query, [chapter_name, course_id], (error, results) => {
    if (error) {
      console.error("Error inserting new chapter:", error);
      res
        .status(500)
        .json({ error: "An error occurred while inserting new chapter." });
    } else {
      res.status(200).json({ message: "New chapter added successfully." });
    }
  });
});

app.post("/calculate-grades", async (req, res) => {
  const { student_id, exam_id } = req.body;

  try {
    // Fetch total marks for the exam
    const totalMarksQuery = `
      SELECT total_marks FROM exam WHERE exam_id = ?
    `;
    const [examResult] = await db.promise().query(totalMarksQuery, [exam_id]);
    const totalMarks = examResult[0].total_marks;

    // Fetch the sum of weightage for correct answers
    const correctWeightageQuery = `
      SELECT SUM(q.weightage) AS total_weightage
      FROM student_responses sr
      JOIN questions q ON sr.question_id = q.question_id
      WHERE sr.id = ? AND sr.exam_id = ? AND sr.is_correct = 1
    `;
    const [correctWeightageResult] = await db
      .promise()
      .query(correctWeightageQuery, [student_id, exam_id]);
    const totalWeightage = correctWeightageResult[0].total_weightage || 0;

    // Calculate the score as a percentage of total marks
    //const score = (totalWeightage / totalMarks) * 100;
    const score = totalWeightage;
    // Insert score into grades table and update submit_status
    const insertGradeQuery = `
      INSERT INTO grades (id, exam_id, score, grade_date, submit_status)
      VALUES (?, ?, ?, NOW(), 1)
      ON DUPLICATE KEY UPDATE score = VALUES(score), grade_date = NOW(), submit_status = 1
    `;
    await db.promise().query(insertGradeQuery, [student_id, exam_id, score]);

    res
      .status(201)
      .json({ message: "Grade calculated and stored successfully", score });
  } catch (error) {
    console.error("Error calculating grade:", error);
    res.status(500).json({ message: "Error calculating grade" });
  }
});

//fetch student grades
app.get("/grades/student/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const query = `
      SELECT g.*, e.exam_name, e.total_marks 
      FROM grades g
      JOIN exam e ON g.exam_id = e.exam_id
      WHERE g.id = ?
    `;

    const [results] = await db.promise().query(query, [studentId]);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ message: "Error fetching grades" });
  }
});

// PUT update a question by ID
app.put("/update-questiondb/:id", (req, res) => {
  const id = req.params.id;
  const { text, complexity, weightage, difficultyLevel, courseId } = req.body;
  const index = questions.findIndex((q) => q.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Question not found" });
  }
  questions[index] = {
    id,
    text,
    complexity,
    weightage,
    difficultyLevel,
    courseId,
  };
  res.json(questions[index]);
});

// Delete a question by ID
// const { id } = req.params;
//   const query = "DELETE FROM users WHERE id = ?";
//   db.query(query, [id], (error, results) => {
//     if (error) {
//       console.error("Error deleting student:", error);
//       res.status(500).json({ error: "Failed to delete student" });
//     } else {
//       console.log("Student deleted successfully");
//       res.status(200).json({ message: "Student deleted successfully" });
//     }
//   });

// Delete question record
app.delete("/delete-question/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM questions WHERE question_id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Failed to delete question" });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Question not found" });
      } else {
        console.log("Question deleted successfully");
        res.status(200).json({ message: "Question deleted successfully" });
      }
    }
  });
});

// Update total marks for an exam
app.put("/update-total-marks/:examId", (req, res) => {
  const { examId } = req.params;
  const { totalMarks } = req.body;

  // Ensure the totalMarks is provided
  if (!totalMarks || isNaN(totalMarks)) {
    return res.status(400).json({ error: "Invalid total marks provided" });
  }

  const query = "UPDATE exam SET total_marks = ? WHERE exam_id = ?";

  db.query(query, [totalMarks, examId], (error, results) => {
    if (error) {
      console.error("Error updating total marks:", error);
      res.status(500).json({ error: "Failed to update total marks" });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Exam not found" });
      } else {
        console.log("Total marks updated successfully");
        res.status(200).json({ message: "Total marks updated successfully" });
      }
    }
  });
});

app.put("/update-exam/:examId", (req, res) => {
  const { examId } = req.params;
  const { publish, complexity, totalMarks } = req.body;

  // Validate inputs
  if (typeof publish !== "number" || !complexity || !totalMarks) {
    return res.status(400).json({ message: "Invalid input" });
  }

  // Fetch questions based on difficulty level and exam ID
  db.query(
    "SELECT * FROM questions WHERE difficulty_level = ? AND exam_id = ?",
    [complexity, examId],
    (error, questions) => {
      if (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Log the fetched questions for debugging
      console.log("Fetched questions:", questions);

      // Sort questions by weightage in ascending order
      questions.sort((a, b) => a.weightage - b.weightage);

      // Accumulate questions until total weightage equals totalMarks
      let totalWeightage = 0;
      const selectedQuestions = [];

      for (const question of questions) {
        if (totalWeightage + question.weightage <= totalMarks) {
          selectedQuestions.push(question);
          totalWeightage += question.weightage;
        }
        if (totalWeightage >= totalMarks) break;
      }

      // Check if we met the required totalMarks
      if (totalWeightage < totalMarks) {
        return res
          .status(400)
          .json({
            message:
              "ERR: total weightage is highter/lower than total Marks. please add more questions in the data or change total Marks.",
          });
      }
      if (totalWeightage > totalMarks) {
        return res
          .status(400)
          .json({
            message:
              "weightage is higher than total marks. change total marks from edit exam",
          });
      }
      // Update exam status
      db.query(
        "UPDATE exam SET publish = ?, complexity = ? WHERE exam_id = ?",
        [publish, complexity, examId],
        (error, results) => {
          if (error) {
            console.error("Error updating exam:", error);
            return res.status(500).json({ message: "Internal Server Error" });
          }
          res
            .status(200)
            .json({ message: "Exam updated successfully", selectedQuestions });
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
