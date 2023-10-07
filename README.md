<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->

 ## Table of Content
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#technical-requirements">Technical Requirements</a></li>
        <li><a href="#user-requirements">User Requirements</a></li>
        <li><a href="#folder-structure">Folder Structure</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#apis">APIs</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#testing">Testing</a></li>
      </ul>
    </li>
  </ol>



<!-- ABOUT THE PROJECT -->
## About The Project

This is a simple Nodejs/Express app with REST API's to perform CRUD on assignments. There are 5 CRUD API's and 1 healthCheck endpoint at the moment; the API can be tested on an http client such as Postman. 

<p align="right"><a href="#readme-top">(back to top)</a></p>

### Technical requirements:

#### The RESTful API requirements are:

* All API request/response payloads should be in JSON.
* No UI should be implemented for the application.
* As a user, I expect all API calls to return with a proper HTTP status code.
* As a user, I expect the code quality of the application to be maintained to the highest standards using the integration tests.

#### Bootstrapping DB:

* The application is expected to automatically bootstrap the database at startup.
* Bootstrapping creates the schema, tables, indexes, sequences, etc., or updates them if their    definition has changed.
* The database cannot be set up manually by running SQL scripts.
* It is highly recommended that you use ORM frameworks such as Hibernate (for java), SQLAlchemy (for  python), and Sequelize (for Node.js).

#### User and User Accounts

* The web application will load account information from a CSV file from well known location /opt/user.csv.
* The application should load the file at startup and create users based on the information provided in the CSV file.
* The application should create new user account if one does not exist.
* If the account already exists, no action is required i.e. no updates.
* Deletion is not supported.
* The user's password must be hashed using BCrypt before it is stored in the database.
* Users should not be able to set values for account_created and account_updated. Any value provided for these fields must be ignored.

#### Authentication Requirements

* The user must provide a basic authentication token when making an API call to the authenticated endpoint.
* The web application must only support Token-Based authentication and not Session Authentication.
 
<p align="right"><a href="#readme-top">(back to top)</a></p>

### User requirements: 

In this assignment we are going to implement REST API to allow users to create assignments.

The authenticated user should be able to do the following:

1. Create Assignment
    - Any user can add an assignment.
    - Assignment points must be between 1 and 10.
2. Update Assignment
    - Only the user who created the assignment can update the assignment.
    - Users can use either the PUT API for updates.
3. Delete Assignment
    - Only the user who created the assignment can delete the assignment.
4. Users should not be able to set values for `assignment_created` and `assignment_updated`. Any value provided for these fields must be ignored.
<p align="right"><a href="#readme-top">(back to top)</a></p>

### Folder Structure

The folder structure used for the project follows domain-driven design with 4 major components: 

* Models
* Services
* Controllers
* Routes

Other development, testing, utility, setup and dependency folders include:

* tests
* config
* node_modules
* coverage
* utils

<p align="right"><a href="#readme-top">(back to top)</a></p>

### APIs



#### Get Assignment by ID

**URL**: `/v1/assignments/{assignmentId}`

**Method**: `GET`

**Description**: Retrieve a single assignment by its unique ID.

**Path Parameters**:

- `assignmentId` (required): The unique identifier of the assignment.

**Example Request**:
`GET /v1/assignments/36758241-66a3-4d89-bd81-3eaca3318dc8`

**Response**:

- Status Code: `200 OK`
- Response Body: 
  ```{
  "id": "36758241-66a3-4d89-bd81-3eaca3318dc8", 
  "name": "Demo3", 
  "points": 100, 
  "num_of_attempts": 3,
  "deadline": "2019-08-29T09:12:33.000Z",
  "assignment_created": "2023-10-03T04:55:05.000Z",
  "assignment_updated": "2023-10-03T04:55:05.000Z"}

#### Get All Assignments

**URL**: `/v1/assignments`

**Method**: `GET`

**Description**: Retrieve a list of assignments. You can optionally filter the assignments by using query parameters.

**Query Parameters**:

- `name` (optional): Filter assignments by name.
- `points` (optional): Filter assignments by points.
- `num_of_attempts` (optional): Filter assignments by num_of_attempts.
- `deadline` (optional): Filter assignments by deadline.

**Example Request**:
`GET /v1/assignments?num_of_attempts=3`

**Response**:

- Status Code: `200 OK`
- Response Body:
    ```
      [
        {
          "id": "3349a83d-ae42-48ab-b10e-56abe165443e",
          "name": "Demo4",
          "points": 100,
          "num_of_attempts": 3,
          "deadline": "2019-08-29T09:12:33.000Z",
          "assignment_created": "2023-10-03T05:01:07.000Z",
          "assignment_updated": "2023-10-03T05:01:07.000Z"
        },
        {
          "id": "36758241-66a3-4d89-bd81-3eaca3318dc8",
          "name": "Demo3",
          "points": 100,
          "num_of_attempts": 3,
          "deadline": "2019-08-29T09:12:33.000Z",
          "assignment_created": "2023-10-03T04:55:05.000Z",
          "assignment_updated": "2023-10-03T04:55:05.000Z"
        }
      ]

### Health Check Endpoint

**URL**: `/healthz`

**Method**: `GET`

**Description**: Check the health status of the application.

**Example Request**:
`GET /healthz`


**Response**:

- Status Code: `200 OK` if the application is healthy, or `503 Service unavailable` if application unhealthy.

---

### Update Assignment by ID

**URL**: `/v1/assignments/{assignmentId}`

**Method**: `PUT`

**Description**: Update an assignment's details by its unique ID.

**Path Parameters**:

- `assignmentId` (required): The unique identifier of the assignment to update.

**Example Request**:
`PUT /v1/assignments/36758241-66a3-4d89-bd81-3eaca3318dc8`


- Request Body : 
   ```
    {
      "name": "Demo3",
      "points": 100,
      "num_of_attempts": 15,
      "deadline" : "2019-08-29T09:12:33.001Z",
    }
    
**Response**:

- Status Code: `204 No Content` if the update is successful.

---

### Delete Assignment by ID

**URL**: `/v1/assignments/{assignmentId}`

**Method**: `DELETE`

**Description**: Delete an assignment by its unique ID.

**Path Parameters**:

- `assignmentId` (required): The unique identifier of the assignment to delete.

**Example Request**:
`DELETE /v1/assignments/36758241-66a3-4d89-bd81-3eaca3318dc8`


**Response**:

- Status Code: `204 No Content` if the deletion is successful.

---

### Post a New Assignment

**URL**: `/v1/assignments`

**Method**: `POST`

**Description**: Create a new assignment.

**Request Body**: 
- JSON object representing the new assignment to be created.

**Example Request**: `POST /v1/assignments`
  - ```
      {
        "name": "Demo3",
        "points": 100,
        "num_of_attempts": 15,
        "deadline" : "2019-08-29T09:12:33.001Z",
      }

**Response**:

- Status Code: `201 Created` if the assignment is successfully created.
- Response Body:
- ```
    {
    "id": "3349a83d-ae42-48ab-b10e-56abe165443e",
    "name": "Demo3",
    "points": 100,
    "num_of_attempts": 15,
    "deadline": "2019-08-29T09:12:33.001Z",
    "assignment_updated": "2023-10-03T05:01:07.521Z",
    "assignment_created": "2023-10-03T05:01:07.521Z"
  }

---
<p align="right"><a href="#readme-top">(back to top)</a></p>

### Built With

* Express
* Sequelize (MYSQL)
* Node
* Jest

<p align="right"><a href="#readme-top">(back to top)</a></p>

<!-- GETTING STARTED -->
## Getting Started

Clone this repository, and and follow the instructions to install pre-requisites before running the project

### Prerequisites

The project has dependencies of **'express'**, '**sequelize**', '**mysql2**', '**bcrypt**', '**ajv**', '**ajv-formats**', '**csv-parser**' . In order to locally install these dependencies, the following command must be run in terminal opened inside project folder:
 ```sh
  npm install
  ```
This will locally install the dependencies inside a node_modules folder.
This is because the package.json is cloned from repo which contains all the projects' dependencies and the command `npm install` installs all the dependencies listed in package.json

Additionally, sensitive data is encapsulated in process.env object from a **'.env'** file which must be manually created. In order to run the cloned codebase, it is recommended to install the dev dependency **'dotenv'**, and assign values to data in the .env file, which can they be accessed using **'process.env**' object.
`npm install --save-dev dotenv` will install the 'dotenv' dev-dependency for this purpose in package.json

The project can then be run using the command : 
 ```sh
  npm run start
  ```

This will execute the script 'start' defined in package.json which will run the server.js file which runs the app.

### Testing

#### Development

In addition to the production dependencies, in order to test the codebase with existing integration tests, the Jest dev-dependency can be installed using :

 ```sh
  npm --save-dev jest
  ```
The project can then be tested using the command : 
 ```sh
  npm test
  ```
Since the app has no UI, the endpoints must be tested using an http client. Postman is recommended for testing the endpoints in this project. 

#### Deploying on a VM

Steps to demo on a Debian VM on Digital Ocean:

1. ssh -i ~/.ssh/<path_to_digitalocean_private_key> root@<vm_ip>

2. scp -i ~/.ssh/digitalocean <path_to_project_zip> root@<vm_ip>:/opt

3. scp -i ~/.ssh/digitalocean <path_to_excel_file> root@<vm_ip>:/opt

4. sudo update
   
5. sudo apt install mariadb-server
   
6. sudo apt install nodejs npm
   
7. mysql -u root -p
   
8. Enter pw : (Press Enter)
   
9.  ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
    
10. FLUSH PRIVILEGES;
    
11. mysql -u root -p
    
12. Enter pw : (Press Enter)
    
13. CREATE DATABASE db_sequelize_mysql;
    
14. sudo systemctl start mariadb
    
15. go into project where package.json is located, then npm i -> node server.js
    
    
<p align="right"><a href="#readme-top">(back to top)</a></p>



