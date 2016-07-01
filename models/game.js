"use strict";

/**
 * Game Model
 * In charge of all things dealing with the game object
 *
 */

const deckModel = require("./deck");
const handModel = require("./hands");
const playerModel = require("./player");

module.exports = {
	/**
	* newGame
	* Creates a new game object and returns it
	*
	* @param {number} players - The total amount of players in this game
	* @returns {object} game -  The full game object
	*/
	newGame: (players) => {
		const game = {
		    deck: deckModel.newDeck(52),
		    newDeck: deckModel.shuffleDeck(deck),
	        hands: handModel.newHands(newDeck),
	        // FIX ME!! see notes above!
	        player1: playerModel.newPlayer("Player1"),
	        player2: playerModel.newPlayer("Player2"),
	        player3: playerModel.newPlayer("Player3"),
	        player4: playerModel.newPlayer("Player4"),
			// TODO: add an actual id
			id: 0,
			// TODO: generate unique token for sessions
			token: 0,
			state: "waiting",
			// TODO: change this so we allow more than 4
			max_players: 4,
			players: [ player1, player2, player3, player4
			],
			turns: [

			]
		};
		return game;
	}
};
