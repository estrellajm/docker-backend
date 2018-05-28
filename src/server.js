const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const config = require('./config');
const express = require('express');
let router = express.Router();
const r = require('rethinkdb');
const DatabaseController = require('./controllers/databaseController');
const GameController = require('./controllers/gameController');
const StoreController = require('./controllers/storeController');

const appEnv = cfenv.getAppEnv();
const app = express();
const http = require('http').Server(app);

const databaseController = new DatabaseController();
const gameController = new GameController();
const storeController = new StoreController();

(function (app) {
  r.connect(config.rethinkdb, (err, conn) => {
    if (err) {
      console.log('Could not open a connection to initialize the database: ' + err.message);
    } else {
      console.log('Connected.');
      app.set('rethinkdb.conn', conn);
      databaseController
        .createDatabase(conn, config.rethinkdb.db)
        .then(() => {
          return databaseController.createTable(conn, 'games');
        })
        .catch(err => {
          console.log('Error creating database and/or table: ' + err);
        });
    }
  });
})(app);

// set body parser for form data
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// set view engine and map views directory
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// map requests
app.get('/', (req, res) => {
  gameController.getGames(req).then(games => {
    res.render('index', {
      games: games
    });
  });
});

// JIRA routes
app.use('/api', router);
router.get('/', (req, res) => {
  res.render('router_info');
});


// router.get('/pizzas', (req, res) => {
//   storeController.getPizzas(req).then(pizzas => {
//     res.json(pizzas);
//   });
// });
router.get('/toppings', (req, res) => {
  storeController.getToppings(req).then(toppings => {
    res.json(toppings);
  });
});
router.get('/empty_pizzas', (req, res) => {
  storeController.getEmptyPizzas(req).then(pizzas => {
    res.json(pizzas);
  });
});

router.route('/pizzas')
  .get((req, res) => {
    storeController.getPizzas(req).then(pizzas => {
      res.json(pizzas);
    });
  })
  .post((req, res) => {
    storeController.createPizza(req).then(pizzas => {
      res.json(pizzas);
    });
  })
  .put((req, res) => {
    storeController.updatePizza(req).then(pizzas => {
      res.json(pizzas);
    });
  });
router.delete('/pizzas/:id', (req, res) => {
  storeController.removePizza(req)
});



//////////// Game Controller Below ////////////





app.get('/update', (req, res) => {
  gameController.getGameById(req).then(game => {
    res.render('update', {
      game: game
    });
  });
});

// form submits
app.post('/create', (req, res) => {
  gameController.createGame(req).then(() => {
    res.redirect('/');
  });
});

app.post('/update', (req, res) => {
  gameController.updateGame(req).then(() => {
    res.redirect('/');
  });
});

app.post('/delete', (req, res) => {
  gameController.deleteGame(req).then(() => {
    res.redirect('/');
  });
});

// get the app environment from Cloud Foundry
const port = appEnv.isLocal ? 3000 : appEnv.port;
const hostname = appEnv.isLocal ? '0.0.0.0' : appEnv.bind;

http.listen(port, hostname, () => {
  console.log(`Server started on ${hostname}:${port}.`);
});