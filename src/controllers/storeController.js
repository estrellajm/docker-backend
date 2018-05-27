'use strict';

const r = require('rethinkdb');

class StoreController {

	getPizzas(req) {
		var conn = req.app.get('rethinkdb.conn');
		return r.table('pizzas').run(conn).then((cursor) => {
			return cursor.toArray();
		});
	}
	createPizza(req) {
		var conn = req.app.get('rethinkdb.conn');
		var pizza = {
			id: Math.floor((Math.random() * 99999) + 1),
			name: req.body.name,
			toppings: req.body.toppings
		}
		console.log(pizza)
		return r.table('pizzas').insert(pizza).run(conn);
	}
	
	
	
	
	
	
	
	updatePizza(req) {
		var conn = req.app.get('rethinkdb.conn');
		console.log(req.body)
		// var id = req.body.game.id;
		
		// var game = {
		// 	player1: req.body.game.player1,
		// 	player2: req.body.game.player2,
		// 	status: req.body.game.status
		// }
		// console.log(game);
		// return r.table('games').get(id).update(game).run(conn);
	}
	removePizza(req) {
		var conn = req.app.get('rethinkdb.conn');
		var id = req.body.game.id;
		return r.table('games').get(id).delete().run(conn);
	}
















	getEmptyPizzas(req) {
		var conn = req.app.get('rethinkdb.conn');
		return r.table('empty_pizzas').run(conn).then((cursor) => {
			return cursor.toArray();
		});
	}
	getToppings(req) {
		var conn = req.app.get('rethinkdb.conn');
		return r.table('toppings').run(conn).then((cursor) => {
			return cursor.toArray();
		});
	}
}

module.exports = StoreController;