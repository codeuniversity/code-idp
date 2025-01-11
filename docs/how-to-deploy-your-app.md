 # How to deploy your Nodejs and Flask Applications
 
 Before you can proceed, we need a few things from you:
 
1. **Your Github Repository**

You need to provide the name of your repository: `https://github.com/your-user-name/your-repo-name`


2. **Your Database Credentials**

You also need to provide your MongoDB database string: `mongodb+srv://<your-user-name>:<your-password>@<your-cluster-name>.nhn6ohr.mongodb.net/`


3. **Environment Variables**

Your Mongo database string contains sensitive information, such as your password and your 
You should make a habit of storing sensitive information, such as the database string, which, among other things, includes your password, in environment variables. A not so gentle **reminder**: Ensure your `.env` file is added to your `.gitignore` to prevent it from being uploaded to version control systems like Git.

```
DB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
```
For more on environment variables, and why they are important, check out [this article](https://www.dreamhost.com/blog/environment-variables/).

If your connection string contains special characters, as your password most likely will, you need to put it in quotation marks in your `.env`file. 

```
DB_URI="your_mongodb_connection_string"
DB_NAME="your_database_name"
```

While you could leave out quotation marks for anything that does not contain special characters, you should use them anyway, just to avoid unnecessary error messages later on.