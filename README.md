# Steps to Run Project

## DB

I have used POSTGRESQL for Database. Unfortunately, due to some issues on my laptop, I am unable to run docker therefore DB script for tables and seed admin user is added to API folder.

In pgAdmin, please first execute `CREATE DATABASE "greenQuote";` and then after connecting to newly created DB, the queries in DB Script.sql should be executed. 

It will create two tables; Users and Quotes and insert one admin user in Users. Other users can be created from Register page on the website. It is not possible to create admin type user from UI.

DB related fields (name, host, user, password) should be added to .env in api.

## API

1. Install dependencies by running `npm install` in api directory.
2. Create a .env file in api folder. .env.example file has already been added to the API folder for reference.
3. Run `npm run dev` command to start the API.

Prerequisite: greenQuote Database is running on Port 5432.

To execute tests, `npm run test` needs to be executed.

Swagger can be accessed via http://localhost:3001/documentation#/

## Web

1. Install dependencies by running `npm install` in web directory.
2. Run `npm start` command to start the React Application.


## Design Decisions

I have used Hapi JS with NODE JS for API and React for the Frontend.

API is based on the components Model. Each Entity will have its separate folder inside the components folder where all the relevant controllers for that entity, Model file, Schema validation file and other code related files if needed for that component can be placed.

This makes it easier to have all the relevant code for an entity in one place.

A separate folder for tests is created which also contains sub folder for entity and separate test files for each controller.

I have added some unit tests and Integration tests for a couple of Controllers to give an idea of the testing approach I like to follow. Due to time constraint, I couldn't achieve 100% test coverage.

server.ts file in test folder serves the purpose of initializing a separate server for test. HAPI can run tests just be initializing the server.

On Frontend, I have made a separate folder for layout and common components such as Toast. If we need different kind of layout for different pages in the app, like a different layout for different roles or type of users of the application, we can put it here. For now, to keep it simple as there was minimal header required, I have added same for both usertypes and have displayed different tabs based on user type. 

Then a separate folder for pages and a sub folder to arrange it entity/module wise to organize all the relevant pages and files in that sub folder.

For validation, both at BE and FE, I have used Joi. 

## More things which can be added

If I could have been able to spend more time on it, I would have considered adding the following things:

1. Separate DB setup for tests so that there is no risk of corrupting data in main DB.
2. DB setup via migrations for a scalable solution.
3. Different config files to handle the configuration related stuff for different environments like local, test, etc.
4. Better Test coverage on API
5. Test coverage on FE
6. Since we are using Session based cookies for authentication, implemeting CSRF token protection also for more security. 
7. Right now, passwords are simple stored as plain text in DB as it was just an assignment. But for actual applications, they should always be encrypted and stored. 

