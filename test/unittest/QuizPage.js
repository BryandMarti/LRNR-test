// Function to send user's answer, correct answer, and question to the backend for validation
export const fetchAnswerCheck = async (userAnswer, correctAnswer, question) => {
  // Sending a POST request to the backend with user's answer data
  const response = await fetch('https://lrnr-quiz-backend.vercel.app/api/check-answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Converting the answer data to JSON before sending it to the server
    body: JSON.stringify({ userAnswer, correctAnswer, question }),
  });

  // If the response is not successful, throw an error
  if (!response.ok) {
    throw new Error('Failed to check answer');
  }

  // Return the JSON response from the server
  return response.json();
};

// Function to check the user's answer by calling the fetchAnswerCheck function
export const checkAnswer = async (userAnswer, correctAnswer, question) => {
  try {
    // Attempt to fetch the answer check result
    return await fetchAnswerCheck(userAnswer, correctAnswer, question);
  } catch (error) {
    // Log the error if fetching fails and return null
    console.error('Error checking answer:', error);
    return null;
  }
};

// Function to handle the submission of an answer and update the score and feedback
export const handleAnswerSubmit = (result, currentScore) => {
  let newScore = currentScore;
  let feedback = '';

  // If the result from the server is valid, update score and feedback based on correctness
  if (result) {
    if (result.isCorrect) {
      newScore += 1;
      feedback = `Correct! ${result.explanation}`;
    } else {
      feedback = `Incorrect. ${result.explanation}`;
    }
  } else {
    // If result is null, inform the user that there was an error
    feedback = 'Error checking answer. Please try again.';
  }

  // Return the updated score, feedback, and a flag to show the next button
  return { newScore, feedback, showNextButton: true };
};

// Function to determine the index of the next question in the quiz
export const getNextQuestionIndex = (quiz, currentQuestionIndex) => {
  // If there are more questions left, return the next question index
  if (currentQuestionIndex < quiz.questions.length - 1) {
    return { newIndex: currentQuestionIndex + 1, showNextButton: false };
  } else {
    // If the quiz is completed, return the final score and completion flag
    return { quizCompleted: true, finalScore: currentQuestionIndex + 1 };
  }
};

// Function to reset the quiz state to the initial values
export const resetQuizState = () => {
  return {
    currentQuestionIndex: 0, // Reset current question index to the first question
    userAnswer: '',           // Clear any existing user answer
    score: 0,                 // Reset score to 0
    feedback: '',             // Clear any feedback
    showNextButton: false,    // Hide the next button initially
    quizCompleted: false,     // Mark the quiz as not completed
  };
};
