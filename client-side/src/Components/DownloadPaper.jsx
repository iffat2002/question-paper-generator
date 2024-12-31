// import React from 'react'
// import { useParams } from 'react-router-dom';
// import ExamPaper from './ExamPaper';
// import { useState } from 'react';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// const DownloadPaper = () => {
//     const { examId } = useParams();
//   const [loading, setloading]= useState(false);
//   console.log("exam id download paper", examId)
//   return (
//     <div>
//     <PDFDownloadLink
//                 document={<ExamPaper examId={examId}/>}
//                 fileName='exam_paper'
//                 onClick={() => setloading(true)} // Set loading to true when clicked
//             >
//                 {({loading}) => (
//                     loading ? <button>Loading document...</button> : <button>Download</button>
//                 )}
//             </PDFDownloadLink>
//         {/* <ExamPaper examId={examId}/> */}
//         </div>
//   )
// }

// export default DownloadPaper
