"use strict";

const config = require("../config.json");
const app = require("../index").app;
const io = app.io;
const db = require("../helpers/db");
const gameModel = require("../models/game");
const playerModel = require("../models/player");

const co = require("co");

io.on("connection", (ctx, data) => {
	// eslint-disable-next-line require-yield
	co(function* co() {
		io.broadcast("connect", players);
		console.log("join event fired", data);
	}).catch(onError);
});

io.on("disconnect", (ctx, data) => {
	co(function* co() {
		const players = yield session.disconnectPlayer(data.id);
		io.broadcast("disconnect", players);
		console.log("leave event fired", data);
	}).catch(onError);
});


/**
* join handler
* Listens for players attempting to join a game
*
* @param {string} data.game - The game ID
* @param {string} data.name - The player's name
* @returns {object} game -  The full game object
*/
io.on("join", (ctx, data) => {
	co(function* co() {
		let payload;
		try {
			payload = JSON.parse(data);
		} catch (err) {
			return io.socket.emit("join", {
				error: true,
				message: "Bad game object"
			});
		}
		// TODO: this is just because my websocket utility is wacky...i hope
		try {
			payload = JSON.parse(payload);
			console.log("using testing utility");
		} catch (err) {
			console.log("not using testing utility");
		}
		// replace everything but letters, numbers, and spaces
		const cleanedName = payload.name.replace(/[^a-zA-Z0-9 ]/g, "");
		let game = yield db.getGame(payload.game);
		if (game.error === true) {
			// something went wrong during load
			console.log("Something went wrong during game retrieval");
			return io.socket.emit("join", JSON.stringify(game));
		}
		// create a player object
		const player = playerModel.newPlayer(cleanedName);
		game = gameModel.joinGame(game, player);
		if (game.error === true) {
			// something went wrong during load
			console.log("Something went wrong during joining");
			return io.socket.emit("join", JSON.stringify(game));
		}
		io.socket.emit("join", JSON.stringify(game));
	}).catch(onError);
});


io.on("fetch", (ctx, data) => {
	co(function* co() {
		const game = yield db.getGame(data);
		if (game.error === true) {
			// something went wrong during load
			console.log("Something went wrong during game retrieval");
			io.socket.emit("fetch", JSON.stringify(game));
			return;
		}
		io.socket.emit("fetch", JSON.stringify(game));
	}).catch(onError);
});

io.on("action", (ctx, data) => {
	co(function* co() {
		let game = yield db.getGame(data);
		if (game.error === true) {
			// something went wrong during load
			console.log("Something went wrong during game retrieval");
			io.socket.emit("action", JSON.stringify(game));
			return;
		}
		game = model.processAction(data.action, game);
		if (game.error === true) {
			// something went wrong during load
			console.log("Something went wrong during action performing");
			io.socket.emit("action", JSON.stringify(game));
			return;
		}
		io.socket.emit("action", JSON.stringify(game));
		// TODO: don't actually send out the entire game object, send a pruned version
		io.broadcast("action", game);
	}).catch(onError);
});

function onError(err) {
	console.log("error!");
	console.error(err);
}