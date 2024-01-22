Follow these steps to get the application up and running:

1. Clone the Project
2. Install Dependencies (npm install)
3. Open the .env file and adjust the configurations accordingly.(DATABASE_URL)
4. Add seed in mongodb (npm run seed)
5. Start the Application (npm run start)
6. open http://localhost:3000/doc
   
    a. login 
     - admin (email:pratik7601@gmail.com, password: abc)
     - user (email:abc@gmail.com, password: abc)
       
    b. copy bearer token and add/update on authorizations 
    c Movies operation
     - create movie (role:admin only)
     - delete movie (role:admin only)
     - update movie (role:admin only)
     - search movie (all) 
     - get all movies (all) with cache
     
7.Run Tests: npm run test

