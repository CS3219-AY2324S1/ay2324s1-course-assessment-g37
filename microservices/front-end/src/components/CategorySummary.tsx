import React, { useState } from "react";
import styles from "./CategorySummary.module.css";

interface CategorySummaryProps {
  categorySummary: { [key: string]: number };
  onSelectCategory: (category: string) => void;
}

const CategorySummary: React.FC<CategorySummaryProps> = ({
  categorySummary,
  onSelectCategory,
}) => {
  const [filteredCategory, setFilteredCategory] = useState<string>("All");

  const orderedCategories = [
    "All",
    ...Object.keys(categorySummary).filter((key) => key !== "All"),
  ]; // ensure All is always mapped first

  const handleCategoryClick = (category: string) => {
    setFilteredCategory(category);
    onSelectCategory(category);
  };

  return (
    <div className={styles.summary_container}>
      {orderedCategories.map((category) => (
        <button
          key={category}
          className={`${styles.summary_button} ${
            category !== "All" && category === filteredCategory
              ? styles.active
              : ""
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}{" "}
          <span className={styles.count}>({categorySummary[category]})</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySummary;
