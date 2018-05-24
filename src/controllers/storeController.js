'use strict';

const r = require('rethinkdb');

class StoreController {

	getPizzas(req) {
		var conn = req.app.get('rethinkdb.conn');
		return r.table('pizzas').run(conn).then((cursor) => {
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