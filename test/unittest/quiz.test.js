import { fetchAnswerCheck, checkAnswer, handleAnswerSubmit, getNextQuestionIndex, resetQuizState } from './QuizPage';

// Mock the global fetch function for testing
global.fetch = jest.fn();

describe('Quiz Functionality Tests', () => {
  // Clear the fetch mock before each test to ensure clean state
  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetchAnswerCheck should handle successful and failed API calls', async () => {
    // Test successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ isCorrect: true, explanation: 'Test explanation' }),
    });

    const resultSuccess = await fetchAnswerCheck('Test Answer', 'Correct Answer', 'Test Question');
    expect(resultSuccess).toEqual({ isCorrect: true, explanation: 'Test explanation' });

    // Test failed API response
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchAnswerCheck('Test Answer', 'Correct Answer', 'Test Question')).rejects.toThrow('Failed to check answer');
  });

  it('checkAnswer should return API response on success and null on failure', async () => {
    // Test successful API call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ isCorrect: true, explanation: 'Test explanation' }),
    });

    const resultSuccess = await checkAnswer('user answer', 'correct answer', 'question');
    expect(resultSuccess).toEqual({ isCorrect: true, explanation: 'Test explanation' });

    // Test failed API call
    fetch.mockRejectedValueOnce(new Error('API error'));
    const resultFailure = await checkAnswer('user answer', 'correct answer', 'question');
    expect(resultFailure).toBeNull();
  });

  it('handleAnswerSubmit should update score and feedback based on answer correctness', () => {
    // Test when answer is correct
    const resultCorrect = { isCorrect: true, explanation: 'Correct answer explanation' };
    const correctSubmit = handleAnswerSubmit(resultCorrect, 3);
    expect(correctSubmit.newScore).toBe(4);
    expect(correctSubmit.feedback).toBe('Correct! Correct answer explanation');
    expect(correctSubmit.showNextButton).toBe(true);

    // Test when answer is incorrect
    const resultIncorrect = { isCorrect: false, explanation: 'Incorrect answer explanation' };
    const incorrectSubmit = handleAnswerSubmit(resultIncorrect, 2);
    expect(incorrectSubmit.newScore).toBe(2);
    expect(incorrectSubmit.feedback).toBe('Incorrect. Incorrect answer explanation');
    expect(incorrectSubmit.showNextButton).toBe(true);
  });

  it('getNextQuestionIndex and resetQuizState should handle quiz progression and reset', () => {
    // Test next question logic
    const quiz = { questions: [{}, {}, {}] };
    const nextIndex = getNextQuestionIndex(quiz, 1);
    expect(nextIndex.newIndex).toBe(2);
    expect(nextIndex.showNextButton).toBe(false);

    // Test quiz completion logic
    const completeIndex = getNextQuestionIndex(quiz, 2);
    expect(completeIndex.quizCompleted).toBe(true);
    expect(completeIndex.finalScore).toBe(3);

    // Test quiz state reset
    const resetState = resetQuizState();
    expect(resetState).toEqual({
      currentQuestionIndex: 0,
      userAnswer: '',
      score: 0,
      feedback: '',
      showNextButton: false,
      quizCompleted: false,
    });
  });
});
