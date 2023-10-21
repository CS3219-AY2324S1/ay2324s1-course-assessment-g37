import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionBank.module.css";
import { Question } from "./types";
import { RootState } from "../store";
import {
  getQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  calculateCategorySummary,
} from "./fetchData";
import AddQuestionForm from "./AddQuestionForm";
import QuestionTable from "./QuestionTable";
import CategorySummary from "./CategorySummary";
import QuestionFilter from "./QuestionFilter";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "../UserContext";
import { useAppSelector } from "../store/hook";
import { createSelector } from "@reduxjs/toolkit";

const allCategories = [
  "Arrays",
  "Strings",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Databases",
  "Breadth-First Search",
  "Tree",
  "Matrix",
  "Two Pointers",
  "Binary Tree",
  "Bit Manipulation",
  "Heap (Priority Queue)",
  "Stack",
  "Prefix Sum",
  "Graph",
  "Simulation",
  "Design",
  "Counting",
  "Backtracking",
  "Queue",
  "Algorithms",
  "Data Structures",
  "Recursion",
  "Brainteaser",
  "Others",
];

const QuestionBank: React.FC = () => {
  // State to store the list of questions
  const [questions, setQuestions] = useState<Question[]>([]);

  const [categorySummary, setCategorySummary] = useState<{
    [key: string]: number;
  }>({});

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(
    null
  );
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    complexity: "Easy" as "Easy" | "Medium" | "Hard", // default value
  });
  const navigate = useNavigate();

  // These are to reset selection field, otherwise it will display strange stuff
  const [selectedCategory, setSelectedCategory] = useState("");
  const [updateSelectedOption, setUpdateSelectedOption] = useState("");

  // Create refs outside the map
  const titleRef = React.createRef<HTMLInputElement>();
  // const categoryRef = React.createRef<HTMLInputElement>();
  const complexityRef = React.createRef<HTMLSelectElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();

  // set the Add & Update status
  const [addError, setAddError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // maintain filter & sort states
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [filteredCategory, setFilteredCategory] = useState<string>("All");
  const [attemptedFilter, setAttemptedFilter] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("None");

  // Need to fetch current user as well
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { currentUser, setCurrentUser } = useUserContext();

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;

  const selectHistory = (state: RootState) => state.history;
  const selectAttemptedQuestions = createSelector([selectHistory], (history) =>
    history.map((historyItem) => historyItem.questionId)
  );
  const attemptedQuestions = useAppSelector(selectAttemptedQuestions);

  // const attemptedQuestions = useAppSelector((state) =>
  //   state.history.map((historyItem) => historyItem.questionId)
  // );
  // the .map() function creates a new array reference every time the selector runs, leading to unnecessary re-renders
  console.log(attemptedQuestions);

  // fetch when component mounts
  // Use isFetching on question fetching
  useEffect(() => {
    async function init() {
      if (!isAuthenticated) {
        return;
      }

      try {
        setIsFetching(true);
        const fetchedQuestions = await fetchQuestions();
        await setQuestionSummary(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions", error);
      } finally {
        setIsFetching(false);
      }
    }

    init();
  }, [isAuthenticated]);

  // check if currentUser is authenticated, if not, direct back to login
  // Including an dependency array is good practice! Otherwise will re-render whenever some state changes
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <></>;
  }

  // functions to fetch all questions and update UI
  const fetchQuestions = async () => {
    const fetchedQuestions = await getQuestions();

    if (fetchedQuestions === undefined) {
      alert("Failed to fetch questions");
      return;
    }

    setQuestions(fetchedQuestions);
    return fetchedQuestions; // return the questions
  };

  const setQuestionSummary = async (questions?: Question[]) => {
    if (questions && questions.length > 0) {
      const summary = calculateCategorySummary(questions);
      setCategorySummary(summary);
    } else {
      alert("Failed to fetch question summary");
    }
  };

  // dummy function for filter changes
  const handleAttemptFilterChange = (attempted: string) => {
    setAttemptedFilter(attempted);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // break one filterQuestion into

  const filterQuestions = (
    questions: Question[],
    difficulty: string,
    category: string,
    query: string,
    attempted: string
  ): Question[] => {
    return questions.filter((question) => {
      const matchesDifficulty =
        difficulty === "All" || question.complexity === difficulty;
      const matchesCategory =
        category === "All" || question.categories.includes(category);
      const matchesQuery =
        query === "" ||
        question.title.toLowerCase().includes(query.toLowerCase());
      const hasBeenAttempted = attemptedQuestions.includes(question._id);
      const matchesAttemptStatus =
        attempted === "All" ||
        (attempted === "Attempted" && hasBeenAttempted) ||
        (attempted === "Unattempted" && !hasBeenAttempted);

      return (
        matchesDifficulty &&
        matchesCategory &&
        matchesQuery &&
        matchesAttemptStatus
      );
    });
  };

  // declare the filteredQuestions here
  const filteredQuestions = filterQuestions(
    questions,
    selectedDifficulty,
    filteredCategory,
    searchQuery,
    attemptedFilter
  );

  // handle sorting
  const handleSort = (sortBy: string, questions: Question[]): Question[] => {
    if (sortBy === "Complexity") {
      return questions.sort((a, b) => {
        const complexityOrder = { Easy: 1, Medium: 2, Hard: 3 }; // Define order
        return complexityOrder[a.complexity] - complexityOrder[b.complexity];
      });
    } else if (sortBy === "Title") {
      return questions.sort((a, b) => a.title.localeCompare(b.title));
    }
    return questions; // If neither of above, return original
  };

  const sortedQuestions = handleSort(sortBy, filteredQuestions);

  const toggleQuestionDetails = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // adding a new question
  const handleAddQuestion = async (newQuestion: Partial<Question>) => {
    await addQuestion(newQuestion, setAddError);
    fetchQuestions();
  };

  const handleDeleteQuestion = async (id: string) => {
    await deleteQuestion(id);
    fetchQuestions();
  };

  const handleUpdateQuestion = async (
    updatedQuestion: Question,
    id: string | number
  ) => {
    const success = await updateQuestion(updatedQuestion, id, setUpdateError);
    fetchQuestions();
    return success;
  };

  const updateExistingCategoryArray = (
    qustionId: string,
    category: string,
    action: "add" | "remove"
  ) => {
    const index = questions.findIndex((q) => q._id === qustionId);
    if (index != -1) {
      const updatedQuestions = [...questions];
      const question = { ...updatedQuestions[index] };
      if (action == "add") {
        question.categories.push(category);
      } else {
        question.categories = question.categories.filter(
          (cat) => cat != category
        );
      }
      // trigger a re-render to show the current question tags
      // limit this to ONLY the current question!
      updatedQuestions[index] = question;
      setQuestions(updatedQuestions);
    }
  };

  return (
    <div>
      {isFetching ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isFetching}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className={styles.header_container}>
            <h1>Question Bank</h1>
          </div>
          {/* If user is null, no access to questions */}
          {currentUser &&
          Object.keys(currentUser).length != 0 &&
          !currentUser.username ? (
            <div>
              <h2 style={{ textAlign: "center" }}>
                Please sign in to access the questions.
              </h2>
            </div>
          ) : (
            <>
              <CategorySummary
                categorySummary={categorySummary}
                onSelectCategory={setFilteredCategory}
              />

              <QuestionFilter
                onAttemptFilterChange={handleAttemptFilterChange}
                onDifficultyFilterChange={(difficulty: string) =>
                  setSelectedDifficulty(difficulty)
                }
                onSortChange={setSortBy}
                onSearch={handleSearch}
              />

              <QuestionTable
                currentUser={currentUser}
                questions={sortedQuestions}
                updatingQuestionId={updatingQuestionId}
                titleRef={titleRef}
                descriptionRef={descriptionRef}
                setUpdateError={setUpdateError}
                updateExistingCategoryArray={updateExistingCategoryArray}
                updateSelectedOption={updateSelectedOption}
                setUpdateSelectedOption={setUpdateSelectedOption}
                allCategories={allCategories}
                complexityRef={complexityRef}
                updateError={updateError}
                handleUpdateQuestion={handleUpdateQuestion}
                toggleQuestionDetails={toggleQuestionDetails}
                handleDeleteQuestion={handleDeleteQuestion}
                expandedQuestionId={expandedQuestionId}
                setUpdatingQuestionId={setUpdatingQuestionId}
              />
            </>
          )}
          {/* Render AddQuestionForm conditionally */}
          {currentUser &&
            Object.keys(currentUser).length != 0 &&
            currentUser.username &&
            currentUser.role === "admin" && (
              <>
                <h2 className={styles.add_header}>Add a New Question</h2>
                <AddQuestionForm
                  newQuestion={newQuestion}
                  allCategories={allCategories}
                  selectedCategory={selectedCategory}
                  setNewQuestion={setNewQuestion}
                  handleAddQuestions={handleAddQuestion}
                  setSelectedCategory={setSelectedCategory}
                  error={addError}
                  onErrorChange={setAddError}
                />
              </>
            )}
        </>
      )}
    </div>
  );
};
export default QuestionBank;
