var BLOCK_SIZE = 32;
var FIELD_HEIGHT = 20;
var FIELD_WIDTH = 10;
var T_FALL_DELAY = 1000;
var T_LINE_DELAY = 50;
var T_START_Y = -1;
var T_START_X = 3;

var TETROMINOS = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	],
	[
		[1, 1],
		[1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	]
];

var GRID_COLOR = "#222222";
var BACK_COLOR = "BLACK";
var COLORS = [BACK_COLOR, "cyan", "yellow", "purple", "green", "red", "blue", "orange", "red"];

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
