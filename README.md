# VideoStorage
This is a NodeJS project that creates several REST APIs.

## Description
VideoStorage is an application (a set of APIs) similar to Netflix or HBOMax platforms, that gives users access to different movies stored in a MySQL database. Moreover, it allows users to create multiple accounts, that can be used to watch the movies they select. Other operations, such as data handling by an admin (CRUD for movies, accounts, possibility to see the accesses from different accounts, image upload and so on), are provided as well. 

## Initial setup
 I firstly created the package.json file with the **npm init** command. After that, I installed the express package (**npm install express --save**) and added the server.js file that establishes the connection to the server using this package.
The database used is a MYSQL localhost DB, so, before establsihing the connection, I installed the package for MySQL: **npm install mysql**. The connection to the database is created in the db_connection.js file.
 
## Database
![image](https://github.com/neagamaria/VideoStorage/assets/92460510/2b653963-0611-4e79-9764-65dce2269b2a)

## User flows of actions

### The flow of actions for an non-authenticated user

![image](https://github.com/neagamaria/VideoStorage/assets/92460510/41082cb5-ce9c-418a-ab90-f9a5c41eff86)

The following API calls are performed: 
- get all movies
- get movie by ID
- get all images for the movie with a given ID


### The flow of actions for an user which was previously signed up

![image](https://github.com/neagamaria/VideoStorage/assets/92460510/6986f690-42fd-4bbc-b80b-4263900a127d)

The following API calls are performed:
- log in
- get all accounts for the current user
- get one account by ID
- get a movie by ID
- create an access for the current user and the selected movie

  



