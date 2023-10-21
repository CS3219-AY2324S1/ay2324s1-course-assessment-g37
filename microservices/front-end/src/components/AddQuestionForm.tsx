import React from "react";
import { Question, NewQuestion } from "./types";
import styles from "./QuestionBank.module.css";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Box } from "@mui/material";

// React.dispatch = a funciton to dispatch actions
// SetStateAction = set or update current state
// interface = define a contract. Includes value + function
interface QuestionFormProps {
  newQuestion: NewQuestion;
  allCategories: string[];
  selectedCategory: string;
  setNewQuestion: React.Dispatch<React.SetStateAction<NewQuestion>>;
  handleAddQuestions: (question: Partial<Question>) => void;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  onErrorChange: (error: string | null) => void;
}

const AddQuestionForm: React.FC<QuestionFormProps> = ({
  newQuestion,
  allCategories,
  selectedCategory,
  setNewQuestion,
  handleAddQuestions,
  setSelectedCategory,
  error,
  onErrorChange,
  // Using destructuring to extract the properties form props
}) => {
  return (
    <form
      className={styles.form_container}
      onSubmit={(e) => {
        e.preventDefault();
        handleAddQuestions(newQuestion);
        setNewQuestion({
          title: "",
          description: "",
          categories: [],
          complexity: "Easy",
        });
      }}
    >
      <div>
        <label className={styles.the_label}>Title</label>
        <input
          className={styles.input_text}
          type="text"
          value={newQuestion.title}
          onChange={(e) => {
            setNewQuestion({ ...newQuestion, title: e.target.value });
            onErrorChange(null);
          }}
        />
      </div>
      <div>
        <label className={styles.the_label}>Description</label>
        <textarea
          className={styles.text_area}
          value={newQuestion.description}
          onChange={(e) => {
            setNewQuestion({ ...newQuestion, description: e.target.value });
            onErrorChange(null);
          }}
        ></textarea>
      </div>
      <div>
        <label className={styles.the_label}>Category</label>
        <div>
          {/* take all the current categories, and display them one by one (start from an empty array) */}
          {/* Here map and filter will only be called if category exists */}
          {newQuestion.categories?.map((cat, index) => (
            // display each category followed by 'X'. Click X will remove the category
            <span key={index}>
              {cat}{" "}
              <button
                className={styles.category_button}
                type="button"
                onClick={() =>
                  setNewQuestion(
                    // in a form, button can be by default "submit". Here need to specify type, in case it just submit the form
                    (prev) => ({
                      ...prev,
                      categories: prev.categories?.filter((c) => c != cat),
                    })
                  )
                }
              >
                X
              </button>
            </span>
          ))}
          {/* drop-down list to add new categories. Only those not already added will be displayed */}
          <select
            className={styles.the_select}
            value={selectedCategory}
            onChange={(e) => {
              setNewQuestion((prev) => ({
                ...prev,
                categories: [...(prev.categories || []), e.target.value],
              }));

              // Reset the selected value
              setSelectedCategory("");
              onErrorChange(null);
            }}
          >
            <option value="" disabled>
              {/* Here should not have disabled selected, cause confusion */}
              Select your option
            </option>
            {allCategories
              .filter((cat) => !(newQuestion.categories || []).includes(cat))
              .map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
        {/* <input type="text" value={newQuestion.category} onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })} /> */}
      </div>
      <div>
        <label className={styles.the_label}>Complexity</label>
        <select
          className={styles.the_select}
          value={newQuestion.complexity as "Easy" | "Medium" | "Hard"}
          onChange={(e) => {
            setNewQuestion({
              ...newQuestion,
              complexity: e.target.value as "Easy" | "Medium" | "Hard",
            });
            onErrorChange(null);
          }}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Handle error situation */}
      {error && (
        <Box mt={1} mb={1}>
          <Alert severity="error" onClose={() => onErrorChange(null)}>
            <AlertTitle>Add Question Error</AlertTitle>
            {error}
          </Alert>
        </Box>
      )}

      <button className={styles.action_button} type="submit">
        Add Question
      </button>
    </form>
  );
};

export default AddQuestionForm;
