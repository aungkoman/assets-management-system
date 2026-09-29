# Assests Management System 

- Express.js + Mongo DB for API
- React for Frontend
- Run project using docker compose.



## Backend 

```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv
# create app.js
node app.js
node --watch app.js

```


ok, let's unified response format

status : bool
message : String
data : object or list of object
pagination : null or pagination object
error : object ( each fileds with array string )


## Basic Road Map

- [ ] Basic API 
- [ ] Docker
- [ ] Simple API Integration