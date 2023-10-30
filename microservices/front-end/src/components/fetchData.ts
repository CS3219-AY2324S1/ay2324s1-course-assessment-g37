// This file should be in charge of API calls
// For the Question type, need to have a shared type file!
import authServiceUrl from "../utility/authServiceUrl";
import { Question } from "./types";


      
// originally directly fetch then update, deep coupling
// Now return a promise, let it de-couples from UI update
// Remove both re-fetching (let the getQuestions handle) and set
export const getQuestions = async (): Promise<Question[] | undefined> => {
  try {
    const res = await fetch(`${authServiceUrl}/api/questions`, { credentials: "include" });
    const questions: Question[] = await res.json();
    return questions;
  } catch (error) {
    console.error(error);
  }
};

export const addQuestion = async (newQuestion: Partial<Question>) => {
  // empty field check
  if (!newQuestion.title || !newQuestion.description) {
    throw new Error('Question title and description cannot be empty.');
  }
  // set to others if no category
  if (!newQuestion.categories || newQuestion.categories.length == 0) {
    // Cannot directly assign value to object from Redux store!
    // Need to create a new object instead
    newQuestion = {
      ...newQuestion,
      categories: ["Others"]
    };
  }

  // Removed the try-catch block
  // First fetch all questions to check for duplicates
  const res = await fetch(`${authServiceUrl}/api/questions`, { credentials: 'include' });
  const existingQuestions: Question[] = await res.json();

  const isDuplicateQuestion = existingQuestions.find(
    (q) => q.title === newQuestion.title
  );

  if (isDuplicateQuestion) {
    throw new Error("Question with this title already exists.");
  }

  // If no duplicates, proceed to add question
  const response = await fetch(`${authServiceUrl}/api/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuestion),
    credentials: "include"
  });

  if (response.status !== 200) {
    throw new Error("Failed to add question");
  }
};

// When using async/await, there is no need to wrap the code in a Promise
export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${authServiceUrl}/api/questions/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (response.status !== 200) {
      alert("Failed to delete question");
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateQuestion = async (
  updatedQuestion: Question, id: string | number,
  setError: (error: string | null) => void
): Promise<boolean> => {
  if (!updatedQuestion.title || !updatedQuestion.description) {
    setError('Question title and description cannot be empty.');
    return false;
  }

  if (!updatedQuestion.categories || updatedQuestion.categories.length === 0) {
    updatedQuestion.categories = ["Others"];
  }

  // we wrap async/await code in a try-catch block because the async/await code
  // may throw errors
  try {
    // Do the duplicate check
    // the code will wait here, until the await function finishes
    const res = await fetch(`${authServiceUrl}/api/questions`, { credentials: 'include' });
    const existingQuestions: Question[] = await res.json();

    const isDuplicatedQuestion = existingQuestions.find(
      (q) => q.title == updatedQuestion.title && q._id !== updatedQuestion._id
    );

    if (isDuplicatedQuestion) {
      setError("Question with this title already exists.");
      return false;
    }

    const response = await fetch(`${authServiceUrl}/api/questions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuestion),
      credentials: 'include'
    });

    if (response.status !== 200) {
      setError("Failed to update question");
      return false;
    }
    setError(null);
    return true;

  } catch (error) {
    console.error(error);
    setError('Failed to update the question due to an unexpected error.');
    return false;
  }
};

// count the number of questions for each category
export const calculateCategorySummary = (questions: Question[]): { [key: string]: number } => {
  // Compute category counts
  const summary = questions.reduce((acc, question) => {
    question.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as { [key: string]: number }); // provide a type assertion

  // Add "All" category with total count of questions
  summary["All"] = questions.length;

  return summary;
}
