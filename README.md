# Routine Scheduler Backend

This is the backend for the Routine Scheduler project. It is a RESTful API built using Express.js and PostgreSQL.

## Setup

### Database

1. Install PostgreSQL
2. Create a new database
3. Create a new user and grant all privileges on the new database
4. Create a `.env` file in the root directory of the project and add the following environment variables:

5. Use dump file to restore the database

```bash
psql -U user -d database_name -f dump.sql
```

### Running the server

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the root directory of the project and add the following environment variables:
```
CONNECTION_URL="postgresql://user:password@localhost:5432/routine_scheduler?sslmode=disable"
SECRET=jst_secret_set_1234
SENDEREMAIL= '___@gmail.com'
SENDERPASSWORD = ''
PORT=4200
```
Create a app password for gmail and add it to the SENDERPASSWORD

3. Start the server

```bash
npm start
```

### Accessing the API

Credentials:

```
username: admin
password: password
```

To change the credentials, [generate a bcrypt hash](https://bcrypt-generator.com/) of the new password and update in the database.