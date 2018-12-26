# trello-clone

Basic trello clone focused on practicing backend development. Touched on HTML drag and drop api and maintaining card positions (not so eloquent).

[trello app link](https://trello-mysql-clone.herokuapp.com/)
## Getting Started

git clone https://github.com/duongdv95/trello-clone.git

Create a config.js file in the root folder with the following:

```javascript
module.exports = 

{
  client: "mysql",
  connection: {
    host: "your info here",
    port: "your info here",
    user: "your info here",
    password: "your info here",
    database: "your info here"   
  }
}
```

npm install

node server.js
### Prerequisites

1. Node version 7+
2. MySQL database running locally or cloud (AWS)

### Installing

Deploying locally
1. Install node version 7+
2. Clone from this repo
3. Create config file with your DB credentials (check getting started)
4. run npm install
5. run node server.js

Deploying on heroku
1. Follow steps on [heroku](https://devcenter.heroku.com/articles/deploying-nodejs#next-steps)
2. Set environment variables to match your DB credentials
3. Deploy

## Built With

* [knex.js](https://knexjs.org/) - SQL query builder that helps your app communicate with MySQL database
* [node.js](https://nodejs.org/en/) - Javascript runtime that works as your backend
* [MySQL](https://www.mysql.com/) - SQL database

## Authors

* **Daniel Duong** - [duongdv95](https://github.com/duongdv95)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thank you to PurpleBooth for creating this readme template
