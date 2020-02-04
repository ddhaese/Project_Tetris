var t_lines = 0;
var t_field = [];
var t_next_type;
var t_type;
var t_block;
var t_x;
var t_y;
var t_timer_tick;
var t_timer_line;
var playing = false;
var SPEED_DIF = 50;
var MIN_SPEED = 100;

function init() {
  canvas = document.getElementById("tetris-canvas");
  context = canvas.getContext("2d");

  window.addEventListener("keydown", checkKey, false);
  newGame();
}

function clearField() {
  for (var y = 0; y < FIELD_HEIGHT; y++) {
    t_field[y] = [];
    for (var x = 0; x < FIELD_WIDTH; x++) {
      t_field[y][x] = 0;
    }
  }
}

function drawBlock(x, y, color) {
  context.fillStyle = color;
  context.fillRect(
    x * BLOCK_SIZE + 1,
    y * BLOCK_SIZE + 1,
    BLOCK_SIZE - 2,
    BLOCK_SIZE - 2
  );
}

function drawField() {
  context.fillStyle = GRID_COLOR;
  context.fillRect(0, 0, BLOCK_SIZE * FIELD_WIDTH, BLOCK_SIZE * FIELD_HEIGHT);

  for (var y = 0; y < FIELD_HEIGHT; y++) {
    for (var x = 0; x < FIELD_WIDTH; x++) {
      drawBlock(x, y, COLORS[t_field[y][x]]);
    }
  }
}

function drawTetromino(tetromino, xx, yy, color) {
  for (var y = 0; y < tetromino.length; y++) {
    for (var x = 0; x < tetromino.length; x++) {
      if (tetromino[y][x]) drawBlock(xx + x, yy + y, COLORS[color]);
    }
  }
}

function drawAll() {
  drawField();
  drawTetromino(t_block, t_x, t_y, t_type + 1);

  var width = FIELD_WIDTH * BLOCK_SIZE;

  context.fillStyle = BACK_COLOR;
  context.fillRect(width, 0, BLOCK_SIZE * 7, BLOCK_SIZE * 6);

  drawTetromino(TETROMINOS[t_next_type], FIELD_WIDTH + 2, 2, t_next_type + 1);

  document.getElementById("lines").innerHTML = "Lines: " + t_lines;
}

function rotateTetromino(tetromino) {
  var tetromino_out = [];

  for (var x = 0; x < tetromino.length; x++) {
    tetromino_out[x] = [];
    for (var y = 0; y < tetromino.length; y++) {
      tetromino_out[x][tetromino.length - y - 1] = tetromino[y][x];
    }
  }

  return tetromino_out;
}

function placeTetromino(tetromino, xx, yy, color) {
  for (var x = 0; x < tetromino.length; x++) {
    for (var y = 0; y < tetromino.length; y++) {
      if (tetromino[y][x] && yy + y >= 0) t_field[yy + y][xx + x] = color;
    }
  }
}

function getFieldBlock(x, y) {
  if (x < 0 || x >= FIELD_WIDTH || y >= FIELD_HEIGHT) return 1;
  else if (y < 0) return 0;
  else return t_field[y][x];
}

function collides(tetromino, xx, yy) {
  for (var x = 0; x < tetromino.length; x++) {
    for (var y = 0; y < tetromino.length; y++) {
      if (tetromino[y][x] && getFieldBlock(xx + x, yy + y)) return true;
    }
  }

  return false;
}

function randomType() {
  return Math.floor(Math.random() * TETROMINOS.length);
}

function placeNewTetromino() {
  t_type = t_next_type;
  t_next_type = randomType();
  t_block = TETROMINOS[t_type];

  t_x = T_START_X;
  t_y = T_START_Y;
}

function newGame() {
  t_lines = 0;

  clearField();
  t_next_type = randomType();
  placeNewTetromino();

  drawAll();
}

function gameOver() {
  clearInterval(t_timer_down);
  clearInterval(t_timer_line);

  alert("Game Over");
}

function togglePlay() {
  if (playing) {
    clearInterval(t_timer_down);
    clearInterval(t_timer_line);
    document.getElementById("toggle-play").src = "img/play.png";
  } else {
    t_timer_down = setInterval(moveDown, T_FALL_DELAY);
    t_timer_line = setInterval(checkLine, T_LINE_DELAY);
    document.getElementById("toggle-play").src = "img/pause.png";
  }

  playing = !playing;
}

function isFullLine(y) {
  return t_field[y].indexOf(0) == -1;
}

function moveDown() {
  if (collides(t_block, t_x, t_y + 1)) {
    placeTetromino(t_block, t_x, t_y, t_type + 1);
    placeNewTetromino();

    if (collides(t_block, t_x, t_y)) gameOver();
  } else {
    t_y++;
  }

  drawAll();
}

function checkLine() {
  var removed = false;
  var y = 0;

  while (y < FIELD_HEIGHT && !removed) {
    if (isFullLine(y)) {
      var newTopLine = [];
      for (x = 0; x < FIELD_WIDTH; x++) {
        newTopLine[x] = 0;
      }

      t_field.splice(y, 1);
      t_field.unshift(newTopLine);

      drawAll();
      removed = true;
      t_lines++;
      T_FALL_DELAY = Math.max(T_FALL_DELAY - SPEED_DIF, MIN_SPEED);
      clearInterval(t_timer_down);
      t_timer_down = setInterval(moveDown, T_FALL_DELAY);
    }

    y++;
  }
}

function checkKey(e) {
  var code = e.keyCode;

  if (code == KEY_LEFT && !collides(t_block, t_x - 1, t_y)) {
    t_x--;
  } else if (code == KEY_RIGHT && !collides(t_block, t_x + 1, t_y)) {
    t_x++;
  } else if (code == KEY_UP) {
    var t = rotateTetromino(t_block);
    if (!collides(t, t_x, t_y)) {
      t_block = t;
    }
  } else if (code == KEY_DOWN) {
    moveDown();
  } else if (code == KEY_SPACEBAR) {
    jumpDown();
  }

  drawAll();
}

function jumpDown() {
  while (!collides(t_block, t_x, t_y + 1)) {
    t_y++;
  }
}