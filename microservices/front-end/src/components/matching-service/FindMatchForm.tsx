import { FC } from "react";
import { QuestionComplexity } from "../types";

import styles from "./FindMatchForm.module.css";

type MatchFormProps = {
  complexity: QuestionComplexity,
  setComplexity: (newComplexity: QuestionComplexity) => void
  isSearching: boolean,
  setIsSearching: (newIsSearching: boolean) => void
}

const FindMatchForm: FC<MatchFormProps> = ({
  complexity,
  setComplexity,
  isSearching,
  setIsSearching,
}) => {

  const handleToggleSearch = () => {
    setIsSearching(!isSearching);
  }

  return (
    <form
      className={styles.form_container}
      onSubmit={(e) => {
        e.preventDefault();
        handleToggleSearch();
      }}
    >
      <h2 className={styles.form_header}>Match Details</h2>
      <div>
        <label className={styles.form_label}>Complexity</label>
        <select
          className={styles.form_select}
          value={complexity}
          onChange={(e) => setComplexity(e.target.value as QuestionComplexity)}
          disabled={isSearching}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <button className={styles.action_button} type="submit">
        {
          isSearching ? 'Cancel' : 'Find Match'
        }
      </button>
    </form>
  );  
}

export default FindMatchForm;
