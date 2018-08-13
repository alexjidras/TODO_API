const _ = require('lodash');
const express = require('express');
let {Todo} = require('./models/todo'),
    {User} = require('./models/user'),
    {authenticate} = require('./middleware/authenticate'),
    app = express.Router();


app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
  	return user.generateAuthToken();
   }).then((token) => {
	  	user.tokens.push({access: 'auth', token});
		  return user.save().then(() => {
  		  res.header('x-auth', token).send(user);
  })}).catch((e) => {
    res.status(400).send(e);
  })
});


app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
	  	user.tokens.push({access: 'auth', token});
		  return user.save().then(() => {
  		  res.header('x-auth', token).send(user);
  })}).catch((e) => {
    res.status(400).send(e);
  })

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});



app.delete('/users/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = app;