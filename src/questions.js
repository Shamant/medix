import React, { useState, useEffect } from 'react';
import quizBank from './quizbank';
import { collection, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config/firebase';
import { Navigate } from 'react-router-dom';
import './questionnaire.css';

function QuizComponent() {
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0); // Automatically start with the first issue
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userDisorders, setUserDisorders] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
  }, [selectedIssueIndex]);

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

  const calculateSeverity = (totalScore) => {
    if (totalScore <= 3) return 'mild';
    if (totalScore <= 7) return 'moderate';
    return 'severe';
  };

  const calculateQuizScore = async () => {
    let totalScore = 0;
    const currentIssue = quizBank[selectedIssueIndex];

    if (currentIssue) {
      currentIssue.questions.forEach((question) => {
        const userAnswer = answers[question.id];
        const answerIndex = question.options.indexOf(userAnswer);

        if (answerIndex === 0) {
          totalScore += 1;
        }
      });
    }

    const severity = calculateSeverity(totalScore);

    if (totalScore > 0) {
      try {
        const name = localStorage.getItem('username');

        if (!name) {
          console.error('Username not found in localStorage');
          return;
        }

        const q = query(collection(db, 'users'), where('name', '==', name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const responseData = userDoc.data().response;
          const responseObject = responseData ? JSON.parse(responseData) : {};

          responseObject[currentIssue.issue] = severity;

          const updatedResponse = JSON.stringify(responseObject);
          await updateDoc(userDoc.ref, {
            response: updatedResponse,
          });

          console.log(`Disorder ${currentIssue.issue} with severity ${severity} added/updated in user's response.`);
          setUserDisorders((prevDisorders) => ({
            ...prevDisorders,
            [currentIssue.issue]: severity,
          }));
        } else {
          console.log('No user found with the name:', name);
        }
      } catch (error) {
        console.error('Error fetching or updating user data:', error);
      }
    }

    setQuizCompleted(true);
  };

  const handleFinishQuiz = () => {
    calculateQuizScore();

    if (selectedIssueIndex < quizBank.length - 1) {
      setSelectedIssueIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log('All quizzes are completed.');
      Navigate('/dashboard');
    }
  };

  const currentIssue = quizBank[selectedIssueIndex];

  return (
    <div className="questionnaire-container">
      <h2 className="page-heading">Questionnaire</h2>
    <div className="questionnaire-box">
      {currentIssue && (
        <div className="questionnaire-content">
          <h2 className="questionnaire-title">{currentIssue.issue}</h2>
          <p className="questionnaire-question">
            {currentIssue.questions[currentQuestionIndex].text}
          </p>
          {currentIssue.questions[currentQuestionIndex].options.map((option, index) => (
            <div key={option} className="questionnaire-option">
              <input
                type="radio"
                id={`${option}-${index}`}
                name="answer"
                value={option}
                checked={answers[currentQuestionIndex + 1] === option}
                onChange={handleAnswerSelect}
              />
              <label htmlFor={`${option}-${index}`} className="questionnaire-label">
                {option}
              </label>
            </div>
          ))}
          <div className="questionnaire-buttons">
            <button
              className="questionnaire-btn"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              className="questionnaire-btn"
              onClick={handleNext}
              disabled={currentQuestionIndex === currentIssue.questions.length - 1}
            >
              Next
            </button>
            {currentQuestionIndex === currentIssue.questions.length - 1 && (
              <button className="questionnaire-btn" onClick={handleFinishQuiz}>
                Finish test
              </button>
            )}
          </div>
        </div>
      )}
      {quizCompleted && selectedIssueIndex === quizBank.length - 1 && (
        <div className="questionnaire-result">
          {Object.keys(userDisorders).length > 0 ? (
            <p className="result-text">You have: {JSON.stringify(userDisorders)}</p>
          ) : (
            <p className="result-text">You do not have any disorders.</p>
          )}
        </div>
      )}
    </div>
  </div>
  );
}

export default QuizComponent;
