# Assignment 3

1. Checkout the commit with tag name `assignment-3` (its commit SHA should be `0662bbb6ff7d0f69d52ed2899b041ca3bbc06691`)

2. Rename the environment variable text files from Canvas and place them at the correct locations:

   ```shell
   # one-liners for bash, Windows Powershell 5.1 and Windows Command Prompt
   mv ./Assignment3-auth.txt ./microservices/auth/.env
   mv ./Assignment3-user-service.txt ./microservices/user-service/.env
   mv ./Assignment3-questions-repo.txt ./microservices/questions-repo/.env
   ```

3. Install the dependencies and run the various microservices in separate terminals:

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

4. We have a basic user with username `john` and password `password`, and an admin / maintainer user with username `mary` and password `mary`.
