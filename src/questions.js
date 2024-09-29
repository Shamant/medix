import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import quizBank from './quizbank';

function QuizComponent() {

  const [selectedIssue, setSelectedIssue] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userDisorders, setUserDisorders] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleIssueChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedIssue(selectedValue);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setUserDisorders([]);
    setQuizCompleted(false);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleAnswerSelect = (event) => {
    const selectedAnswer = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex + 1]: selectedAnswer,
    }));
  };

  const calculateQuizScore = async () => {
    let totalScore = 0;

    quizBank.forEach((issue) => {
      if (issue.issue === selectedIssue) {
        issue.questions.forEach((question) => {
          const userAnswer = answers[question.id];
          const answerIndex = question.options.indexOf(userAnswer);
          totalScore += answerIndex;
        });
      }
    });

    if (parseInt(totalScore) > 18) {
      const newDisorder = selectedIssue;
      console.log(totalScore);
    } else {
      console.log('You do not have any disorders.');
    }

    setQuizCompleted(true);
  };

  const currentIssue = quizBank.find((issue) => issue.issue === selectedIssue);

  return (
    <div style={{ height: '100vh', backgroundColor: '#333', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ padding: '20px', width: '100%', maxWidth: '700px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#444' }}>
        <select value={selectedIssue} onChange={handleIssueChange} style={{ marginBottom: '20px', padding: '10px', width: '100%', fontSize: '16px' }}>
          <option value="">Select Disorder</option>
          {quizBank.map((issue) => (
            <option key={issue.issue} value={issue.issue}>
              {issue.issue}
            </option>
          ))}
        </select>
        {selectedIssue && (
          <div>
            <p>{currentIssue.questions[currentQuestionIndex].text}</p>
            {currentIssue.questions[currentQuestionIndex].options.map((option, index) => (
              <div key={option} style={{ margin: '10px 0' }}>
                <input
                  type="radio"
                  id={`${option}-${index}`}
                  name="answer"
                  value={option}
                  checked={answers[currentQuestionIndex + 1] === option}
                  onChange={handleAnswerSelect}
                />
                <label htmlFor={`${option}-${index}`} style={{ marginLeft: '10px' }}>{option}</label>
              </div>
            ))}
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} style={{ padding: '10px', margin: '10px' }}>
              Previous
            </button>
            <button onClick={handleNext} disabled={currentQuestionIndex === currentIssue.questions.length - 1} style={{ padding: '10px', margin: '10px' }}>
              Next
            </button>
            {currentQuestionIndex === currentIssue.questions.length - 1 && (
              <button onClick={calculateQuizScore} style={{ padding: '10px', margin: '10px' }}>
                <Link to='/dashboard' style={{ color: 'white', textDecoration: 'none' }}>Finish test</Link>
              </button>
            )}
          </div>
        )}
        {quizCompleted && (
          <div>
            {userDisorders.length > 0 ? (
              <p>You have: {userDisorders.join(', ')}</p>
            ) : (
              <p>You do not have any disorders.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
