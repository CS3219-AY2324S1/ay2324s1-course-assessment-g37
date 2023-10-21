# Assignment 2

1. Checkout the commit with tag name `assignment-2` (its commit SHA should be `35b05145d40937a1c49135959b21ac43c3c84b9f`)
2. Rename `Assignment2-auth.txt` as `.env` and place it at `PROJECT_FOLDER/microservices/auth/.env`
3. Rename `Assignment2-user-service.txt` as `.env` and place it at `PROJECT_FOLDER/microservices/user-service/.env`
4. Rename `Assignment2-questions-repo.txt` as `.env` and place it at `PROJECT_FOLDER/microservices/questions-repo/.env`
5. Install the dependencies and run the various microservices in separate terminals:

   ```shell
   # one-liners for Windows Powershell 5.1
   cd microservices/front-end; npm install; npm run dev
   cd microservices/auth; npm install; npm run dev
   cd microservices/user-service; npm install; npm run start
   cd microservices/questions-repo; npm install; npm run devstart
   ```

   ```shell
   # one-liners for bash and Windows Command Prompt
   cd microservices/front-end && npm install && npm run dev
   cd microservices/auth && npm install && npm run dev
   cd microservices/user-service && npm install && npm run start
   cd microservices/questions-repo && npm install && npm run devstart
   ```

6. We have a user with username `john` and password `password`. Alternatively, you can create your own account via the sign up page to test our website
