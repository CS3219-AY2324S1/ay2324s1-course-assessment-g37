import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectAttemptedQuestions } from "./attemptedQuestions";

interface QuestionFilterState {
    attempted: string;
    difficulty: string;
    sortBy: string;
    localSearchQuery: string;
    // The 4 useState I had for QuestionFilter
}

// The initial states of the 4 variables
const initialState: QuestionFilterState = {
    attempted: "All",
    difficulty: "All",
    sortBy: "None",
    localSearchQuery: "",
};

// The 4 set functions of the 4 useState variables
const questionFilterSlice = createSlice({
    name: "questionFilter",
    initialState,
    reducers: {
        setAttempted: (state, action: PayloadAction<string>) => {
            state.attempted = action.payload;
        },
        setDifficulty: (state, action: PayloadAction<string>) => {
            state.difficulty = action.payload;
        },
        setSortBy: (state, action: PayloadAction<string>) => {
            state.sortBy = action.payload;
        },
        setLocalSearchQuery: (state, action: PayloadAction<string>) => {
            state.localSearchQuery = action.payload;
        },
        // for CollabPage
        resetAndSetDifficulty: (_state, action: PayloadAction<string>) => {
            return {
                ...initialState,
                difficulty: action.payload
            }
        }
    },
});

// handle the filtering of the questions
// But if I already handle filter here, why not handle sort here as well?
// I already set sortBy here
export const selectSortedFilteredQuestions = createSelector(
    (state: RootState) => state.questions,
    (state: RootState) => state.questionFilter,
    (state: RootState) => state.categoryFilter.filteredCategory,
    selectAttemptedQuestions,
    (questions, filters, filteredCategory, attemptedQuestions) => {
        const filteredQuestions = questions.filter((question) => {
            const matchesDifficulty =
                filters.difficulty === "All" || question.complexity === filters.difficulty;
            const matchesQuery =
                filters.localSearchQuery === "" ||
                question.title.toLowerCase().includes(filters.localSearchQuery.toLowerCase());
            const matchesCategory =
                filteredCategory === "All" || question.categories.includes(filteredCategory);
            const hasBeenAttempted = attemptedQuestions.includes(question._id); // Note: `attemptedQuestions` should come from somewhere
            const matchesAttemptStatus =
                filters.attempted === "All" ||
                (filters.attempted === "Attempted" && hasBeenAttempted) ||
                (filters.attempted === "Unattempted" && !hasBeenAttempted);



            return (
                matchesDifficulty &&
                matchesQuery &&
                matchesAttemptStatus &&
                matchesCategory
            );
        });

        const sortBy = filters.sortBy;
        if (sortBy === "Complexity") {
            return filteredQuestions.sort((a, b) => {
                const complexityOrder = { Easy: 1, Medium: 2, Hard: 3 };
                return complexityOrder[a.complexity] - complexityOrder[b.complexity];
            });
        } else if (sortBy === "Title") {
            return filteredQuestions.sort((a, b) => a.title.localeCompare(b.title));
        }

        return filteredQuestions;
    }
);

export const {
    setAttempted,
    setDifficulty,
    setSortBy,
    setLocalSearchQuery,
    resetAndSetDifficulty
} = questionFilterSlice.actions;

export default questionFilterSlice.reducer;



