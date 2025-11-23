const calculateScore = (answers: string[], correctAnswers: string[]): number => {
  return answers.reduce((score, answer, index) => {
    return score + (answer === correctAnswers[index] ? 1 : 0);
  }, 0);
};

const getScoreFeedback = (score: number, totalQuestions: number): string => {
  const percentage = (score / totalQuestions) * 100;
  if (percentage === 100) {
    return "Perfect score! You're a quiz master!";
  } else if (percentage >= 80) {
    return "Great job! You have a strong understanding!";
  } else if (percentage >= 50) {
    return "Good effort! Keep studying!";
  } else {
    return "Don't worry, try again and you'll improve!";
  }
};

export { calculateScore, getScoreFeedback };