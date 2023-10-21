## Questions Repository

This directory sets up a server to get, add, update and delete questions to a database.

### Set Up
Clone the repository, install dependencies and set up environment.
```
cd ./microservices/questions-repo
npm install
touch .env
```

Add in your MongoDB atlas URI in the .env file with your username and password.
```
// .microservices/questions-repo/.env

MONGO_URI="mongodb+srv://<username>:<password>@cluster0.hg6rriw.mongodb.net/questions?retryWrites=true&w=majority"
```

Start the dev server.
```
npm run serverstart
```

### API Reference

#### Types

```
type Question = {
  title: string
  categories: string[]
  complexity: 'Easy' | 'Medium' | 'Hard'
  description: string
};

type QuestionWithId = {
  _id: string
  title: string
  categories: string[]
  complexity: 'Easy' | 'Medium' | 'Hard'
  description: string
}
```

#### Add question

Request: POST /api/questions
Body: `Question` in JSON format

Returns: `Question` URI in response's header.Location.

#### List questions

Request: GET /api/questions
Body (Optional): `Partial<Question>` in JSON format to list only documents with specific field values.
Returns: List of questions with their id (`QuestionWithId[]`) in JSON format.

#### Get question by id

GET /api/questions/:id
Returns: `QuestionWithId` in JSON format.

### Update question by id
PUT /api/questions/:id
Body: `Partial<Question>` in JSON format.

### Delete question by id
DELETE /api/questions/:id
