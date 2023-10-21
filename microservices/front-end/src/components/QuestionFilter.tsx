import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./QuestionFilter.module.css";
import CloseIcon from "@mui/icons-material/Close";

interface QuestionFilterProps {
  onAttemptFilterChange: (attempted: string) => void;
  onDifficultyFilterChange: (difficulty: string) => void;
  onSortChange: (sortBy: string) => void;
  onSearch: (query: string) => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  onAttemptFilterChange,
  onDifficultyFilterChange,
  onSortChange,
  onSearch,
}) => {
  const [attempted, setAttempted] = React.useState<string>("All");
  const [difficulty, setDifficulty] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<string>("None");
  const [localSearchQuery, setLocalSearchQuery] = React.useState<string>("");

  const handleAttemptFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setAttempted(value);
    onAttemptFilterChange(value);
  };

  const handleDifficultyFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setDifficulty(value);
    onDifficultyFilterChange(value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSortBy(value);
    onSortChange(value);
  };

  // search result should not change immediately if input changes
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(localSearchQuery);
  };

  return (
    <div className={styles.filter_container}>
      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth>
          <InputLabel id="attempted-label">Status</InputLabel>
          <Select
            labelId="attempted-label"
            id="attempted-select"
            value={attempted}
            label="Attempted"
            onChange={handleAttemptFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Attempted">Attempted</MenuItem>
            <MenuItem value="Unattempted">Unattempted</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth>
          <InputLabel id="difficulty-label">Level</InputLabel>
          <Select
            labelId="difficulty-label"
            id="difficulty-select"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyFilterChange}
          >
            <MenuItem value="All">All Levels</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange} // New handler for sorting
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Title">Title</MenuItem>
            <MenuItem value="Complexity">Complexity</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Added Search Bar */}
      <Paper
        component="form" // this is rendering Paper as a HTML form!
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 300,
          boxShadow: "none",
          border: "1px solid rgba(0, 0, 0, 0.23)",
        }}
        onSubmit={(e) => e.preventDefault()}
        // Prevent refreshing the page every time user press enter
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Questions"
          inputProps={{ "aria-label": "search questions" }}
          value={localSearchQuery}
          onChange={handleSearchInputChange}
        />
        {localSearchQuery && (
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="clear search"
            onClick={() => {
              setLocalSearchQuery(""); // Clear the search query
              onSearch(""); // Notify parent component to clear the filter
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={handleSearch}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
};

export default QuestionFilter;
