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
		return r.table('pizzas').insert(pizza).run(conn);
	}
	updatePizza(req) {
		var conn = req.app.get('rethinkdb.conn');
		var id = req.body.id;
		var pizza = {
			id: req.body.id,
			name: req.body.name,
			toppings: req.body.toppings
		}
		return r.table('pizzas').get(id).update(pizza).run(conn);
	}

	removePizza(req) {
		var conn = req.app.get('rethinkdb.conn');
		var id = Number(req.params.id) // Number due to this frontend code ONLY, remove!!
		return r.table('pizzas').get(id).delete().run(conn);
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