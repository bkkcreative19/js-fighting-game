const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.6;

class Sprite {
  constructor({ postition, height, width, velocity, color, offset }) {
    this.position = postition;
    this.height = height;
    this.width = width;
    this.velocity = velocity;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box
    if (this.isAttacking) {
      ctx.fillStyle = "red";
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // console.log(this.position.y);
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      //   this.position.y = canvas.height + this.height;
    } else {
      this.velocity.y += gravity;
    }
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = 0;
      //   this.position.y = canvas.height + this.height;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  postition: {
    x: 0,
    y: 40,
  },
  height: 150,
  width: 50,
  velocity: {
    x: 0,
    y: 0,
  },
  color: "yellow",
  offset: {
    x: 0,
    y: 0,
  },
});
const enemy = new Sprite({
  postition: {
    x: 800,
    y: 30,
  },
  height: 150,
  width: 50,
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
};

let lastKey;

function rectCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(animate);

  player.update();

  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  enemy.update();

  enemy.velocity.x = 0;

  if (keys.arrowLeft.pressed && enemy.lastKey === "arrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.arrowRight.pressed && enemy.lastKey === "arrowRight") {
    enemy.velocity.x = 5;
  }

  //   collision
  if (rectCollision({ rect1: player, rect2: enemy }) && player.isAttacking) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemy").style.width = enemy.health + "%";
  }

  if (rectCollision({ rect1: enemy, rect2: player }) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#player").style.width = player.health + "%";
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      enemy.lastKey = "arrowLeft";
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = true;
      enemy.lastKey = "arrowRight";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});
addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
  }
});
