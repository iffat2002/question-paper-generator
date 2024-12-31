import React, { useState } from 'react';
import axios from 'axios';

const UpdateQuestionForm = ({ questionId }) => {
    const [text, setText] = useState('');
    const [complexity, setComplexity] = useState('');
    const [weightage, setWeightage] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('');
    const [courseId, setCourseId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/update-questiondb/${questionId}`, {
                text,
                complexity,
                weightage,
                difficultyLevel,
                courseId
            });
            console.log('Question updated:', res.data);
            // Reset form fields
            setText('');
            setComplexity('');
            setWeightage('');
            setDifficultyLevel('');
            setCourseId('');
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Question text" required />
            <select value={complexity} onChange={(e) => setComplexity(e.target.value)} required>
                <option value="">Select Complexity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <input type="number" value={weightage} onChange={(e) => setWeightage(e.target.value)} placeholder="Weightage" required />
            <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} required>
                <option value="">Select Difficulty Level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <input type="number" value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="Course ID" required />
            <button type="submit">Update Question</button>
        </form>
    );
};

export default UpdateQuestionForm;
