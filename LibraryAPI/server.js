const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const errorHandler = require('./middleware/error-handler');
const flash = require('flash');
const cookieSession = require('cookie-session');
const methodOverride = require("method-override");

app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(flash());
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/books', require('./controllers/api/books.controller'));
app.use('/api/logbooks', require('./controllers/api/logbook.controller'));
app.use('/api/penalties', require('./controllers/api/penalties.controller'));

app.use('/', require('./controllers/pages.controller'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));