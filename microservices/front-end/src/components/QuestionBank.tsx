import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./QuestionBank.css";

// Need to define a Question type. ? = optional fields
interface Question {
    id: number;
    title: string;
    description: string;
    category: string[];
    complexity: 'Easy' | 'Medium' | 'Hard';
}

const allCategories = [
  'Arrays', 'Strings', 'Hash Table', 'Math', 'Dynamic Programming',
  'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search',
  'Databases', 'Breadth-First Search', 'Tree', 'Matrix', 
  'Two Pointers', 'Binary Tree', 'Bit Manipulation', 'Heap (Priority Queue)',
  'Stack', 'Prefix Sum', 'Graph', 'Simulation', 'Design',
  'Counting', 'Backtracking', 'Queue', 'Algorithms', 'Data Structures',
  'Recursion', 'Brainteaser', 'Others'
]

const QuestionBank: React.FC = () => {
  // State to store the list of questions
  const [questions, setQuestions] = useState<Question[]>([]); 
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<number | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: [] as string[],
    complexity: 'Easy' as 'Easy' | 'Medium' | 'Hard' // default value
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

  useEffect(() => {
    fetch('http://localhost:3001/questions')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleSignout = () => {
    navigate('/login');
  }

  const toggleQuestionDetails = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // newQuestion only have 4 fields, unlike Question have 5, need to use Partial
  const addQuestion = (newQuestion: Partial<Question>) => {
    // empty field check
    if (!newQuestion.title || !newQuestion.description) {
      alert('Question title and description cannot be empty.');
      return;
    }
    // set to others if no category
    if (!newQuestion.category || newQuestion.category.length == 0) {
      newQuestion.category = ["Others"];
    }

    // First fetch all questions to check for duplicates
    fetch('http://localhost:3001/questions')
    .then((res) => res.json())
    .then((existingQuestions: Question[]) => {
      const duplicate = existingQuestions.find(q => q.title === newQuestion.title);
      if (duplicate) {
        alert('Question with this title already exists.');
        return;
      }

      // If no duplicates, proceed to add question
      fetch('http://localhost:3001/addQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      })
      .then(() => fetch('http://localhost:3001/questions')) // re-fetch questions, update UI
      .then((res) => res.json())
      .then((data) => setQuestions(data));
    });
  };

  const deleteQuestion = (id: number) => {
    fetch(`http://localhost:3001/questions/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      // Re-fetch questions to update UI
      return fetch('http://localhost:3001/questions');
    })
    .then((res) => res.json())
    .then((data) => setQuestions(data));
  };

  const updateQuestion = (updatedQuestion: Question, id: string | number) => {
    // Empty field check
    if (!updatedQuestion.title || !updatedQuestion.description) {
      alert('Question title and description cannot be empty.');
      return;
    }
    if (!updatedQuestion.category || updatedQuestion.category.length === 0) {
      updatedQuestion.category = ["Others"];
    }
    
    // Do the duplicate check
    fetch('http://localhost:3001/questions')
    .then((res) => res.json())
    .then((existingQuestions: Question[]) => {
      const duplicate = existingQuestions.find(
        q => q.title == updatedQuestion.title && q.id !== updatedQuestion.id
      );
      if (duplicate) {
        alert("Question with this title already exists. ");
        return;
    }

      fetch(`http://localhost:3001/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestion),
      })
      .then(() => fetch('http://localhost:3001/questions'))
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setUpdatingQuestionId(null);
      });
    });
  };

  const updateExistingCategoryArray = (qustionId: number, category: string, action: 'add' | 'remove') => {
    const index = questions.findIndex(q => q.id === qustionId);

    if (index != -1) {
      const updatedQuestions = [...questions];
      const question = { ... updatedQuestions[index]};

      if (action == 'add') {
        question.category.push(category);
      } else {
        question.category = question.category.filter(cat => cat != category);
      }

      // trigger a re-render to show the current question tags
      // limit this to ONLY the current question!
      updatedQuestions[index] = question;
      setQuestions(updatedQuestions);
    }
  }
  

  return (
    <div>
      <div className='header-container'>
        <h1>Question Bank</h1>
        <button onClick={handleSignout}>Sign Out</button>
      </div>
      <table>
            <thead>
                <tr>
                <th className='table-header'>Title</th>
                <th className='table-header'>Category</th>
                <th className='table-header'>Complexity</th>
                <th className='table-header'>Actions</th>
                </tr>
            </thead>
            <tbody>
            {questions.map((question) => (
                <React.Fragment key={question.id}>
                {updatingQuestionId === question.id ? (
                    <tr>
                        <td colSpan={3}>
                            <div className='update-form'>
                                <div>
                                    <label>Title</label>
                                    <input ref={titleRef} type="text" defaultValue={question.title} />
                                </div>
                                <div>
                                    <label>Description</label>
                                    <textarea ref={descriptionRef} defaultValue={question.description}></textarea>
                                </div>
                                <div>
                                    <label>Category</label>

                                    <div>
                                      {question.category.map((cat, index) => (
                                      <span key={index}>
                                        {cat}
                                        <button onClick={() => updateExistingCategoryArray(question.id, cat, 'remove')}>X</button>
                                      </span>
                                      ))}
                                    </div>
                                    <select 
                                      value={updateSelectedOption} // explicitly set the value
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        updateExistingCategoryArray(question.id, newValue, 'add');
                                        setUpdateSelectedOption("");  // reset the selected option
                                      }}
                                    >
                                      <option value="" disabled>Select your option</option>
                                      {allCategories.filter(cat => !question.category.includes(cat)).map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                      ))}
                                    </select>

                                    {/* <input ref={categoryRef} type="text" defaultValue={question.category} /> */}
                                </div>
                                <div>
                                    <label>Complexity</label>
                                    <select ref={complexityRef} defaultValue={question.complexity}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button className='action-button' onClick={() => setUpdatingQuestionId(null)}>Cancel</button>
                            <button className='action-button' onClick={() => {
                            const updatedTitle = titleRef.current?.value || "";
                            // const updatedCategory = categoryRef.current?.value || "";
                            const updatedComplexity = complexityRef.current?.value as 'Easy' | 'Medium' | 'Hard'; // type assertion
                            const updatedDescription = descriptionRef.current?.value || ""; // New line
                            
                            const updatedQuestion = {
                                id: question.id,
                                title: updatedTitle,
                                category: question.category, // already updated in-place
                                complexity: updatedComplexity,
                                description: updatedDescription // New field
                            };
                            
                            updateQuestion(updatedQuestion, question.id);
                            setUpdatingQuestionId(null);
                            }}>Save</button>
                        </td>
                    </tr>
                ) : (
                    <tr>
                    <td>
                        <button onClick={() => toggleQuestionDetails(question.id)}>
                        {question.title}
                        </button>
                    </td>
                    <td className='center-align-cell'>{question.category.join(', ')}</td>
                    <td className='center-align-cell'>{question.complexity}</td>
                    <td>
                        <button className='action-button' onClick={() => deleteQuestion(question.id)}>Delete</button>
                        <button className='action-button' onClick={() => setUpdatingQuestionId(question.id)}>Update</button> {/* Fixed */}
                    </td>
                    </tr>
                )}
                {expandedQuestionId === question.id && (
                    <tr>
                    <td colSpan={4}>
                        <div dangerouslySetInnerHTML={{ __html: question.description }}></div>
                    </td>
                    </tr>
                )}
                </React.Fragment>
            ))}
            </tbody>
      </table>

      {/* Create new Questions */}
      <h2 className='add-header'>Add a New Question</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        addQuestion(newQuestion);
        setNewQuestion({
          title: '',
          description: '',
          category: [],
          complexity: 'Easy'
        });
      }}>
        <div>
          <label>Title</label>
          <input type="text" value={newQuestion.title} onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={newQuestion.description} onChange={e => setNewQuestion({ ...newQuestion, description: e.target.value })}></textarea>
        </div>
        <div>
          <label>Category</label>
          <div>
            {/* take all the current categories, and display them one by one (start from an empty array) */}
            {newQuestion.category.map((cat, index) => (
              // display each category followed by 'X'. Click X will remove the category
              <span key = {index}>
                {cat} <button type = "button" onClick={() => setNewQuestion(
                  // in a form, button can be by default "submit". Here need to specify type, in case it just submit the form
                  prev => ({...prev, category: prev.category.filter(
                    c => c != cat
                  )})
                )}>X</button>
              </span>
            ))}
            {/* drop-down list to add new categories. Only those not already added will be displayed */}
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setNewQuestion(prev => ({
                  ...prev, 
                  category: [...prev.category, e.target.value]
                }));

                // Reset the selected value
                setSelectedCategory("");
              }}
            >
              <option value="" disabled selected>Select your option</option>
              {allCategories.filter(cat => !newQuestion.category.includes(cat)).map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>       
          {/* <input type="text" value={newQuestion.category} onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })} /> */}
        </div>
        <div>
          <label>Complexity</label>
          <select value={newQuestion.complexity as 'Easy' | 'Medium' | 'Hard'} 
          onChange={e => setNewQuestion({ ...newQuestion, 
          complexity: e.target.value as 'Easy' | 'Medium' | 'Hard' })}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <button className='action-button' type="submit">Add Question</button>
      </form>

    </div>
  );
};

export default QuestionBank;