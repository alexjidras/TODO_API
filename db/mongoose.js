var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI).catch((e)=> {
	console.error("Unable to connect to database!");
	process.exit();
});

module.exports = {mongoose};
