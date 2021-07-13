Planning app is a pet project was made by GoIT #24 students. It's a simple
dashboard solution written in React.js and Node.js/MongoDB-based back-end.

Implemented such functions like:

- authentication
- create/delete/edit/filter projects
- create/delete/edit sprints
- create/delete/edit tasks
- tasks estimation
- search by task title
- add registered users into the project
- sprint analysis (burn-down charts)

Frameworks and libraries:

bcrypt, cors, dotenv, express, helmet, joi, jsonwebtoken, mongoose,
mongoose-paginate-v2, morgan, passport, passport-jwt, swagger-ui-express

Back-end: https://planning-app1.herokuapp.com 
Documentation: https://planning-app1.herokuapp.com/api-docs/

### Команды:

- `npm start` &mdash; старт сервера в режиме production
- `npm run start:dev` &mdash; старт сервера в режиме разработки (development)
- `npm run lint` &mdash; запустить выполнение проверки кода с eslint, необходимо
  выполнять перед каждым PR и исправлять все ошибки линтера
- `npm lint:fix` &mdash; та же проверка линтера, но с автоматическими
  исправлениями простых ошибок
