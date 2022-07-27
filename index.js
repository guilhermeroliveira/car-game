const mainCanvas = document.querySelector("#main");
const mainCtx = mainCanvas.getContext("2d");
const debugCanvas = document.querySelector("#debug");
const debugCtx = debugCanvas.getContext("2d");

const carImage = new Image();
carImage.src = "./assets/car.png";
carImage.width = 150;
carImage.height = 75;

const tireImage = new Image();
tireImage.src = "./assets/tire.png";
tireImage.width = 25;
tireImage.height = 8;

const maxTireAngle = 30 * (Math.PI / 180);

const car = {
  position: {
    x: 200,
    y: 200,
  },
  size: {
    width: 0,
    height: 0,
  },
  angle: 0,
  model: carImage,
  tireAngle: 0,
  acceleration: 0,

  draw: () => {
    if (!car.model.complete) return;

    mainCtx.translate(car.position.x, car.position.y);
    mainCtx.rotate(car.angle);

    debugCtx.translate(car.position.x, car.position.y);
    debugCtx.rotate(car.angle);

    for (let i = 0; i < 2; i++) {
      if (!tireImage.complete) break;

      mainCtx.save();
      debugCtx.save();

      const modifier = Math.pow(-1, i + 1);

      mainCtx.translate(
        car.size.width / 2 - tireImage.width / 2 - 20,
        (car.size.height / 2) * modifier -
          (tireImage.height / 2) * modifier -
          (car.size.height / 10) * modifier
      );
      debugCtx.translate(
        car.size.width / 2 - tireImage.width / 2 - 20,
        (car.size.height / 2) * modifier -
          (tireImage.height / 2) * modifier -
          (car.size.height / 10) * modifier
      );

      mainCtx.rotate(car.tireAngle);

      mainCtx.drawImage(
        tireImage,
        -tireImage.width / 2,
        -tireImage.height / 2,
        tireImage.width,
        tireImage.height
      );

      debugCtx.fillRect(-tireImage.width / 2, -tireImage.height / 2, 2.5, 2.5);
      debugCtx.restore();
      mainCtx.restore();
    }

    mainCtx.drawImage(
      car.model,
      -car.size.width / 2,
      -car.size.height / 2,
      car.size.width,
      car.size.height
    );

    if (car.acceleration > 0) {
      car.angle +=
        car.tireAngle * (Math.PI / 180) -
        car.tireAngle * (Math.PI / 180) * car.acceleration;

      const deltaX = Math.cos(car.angle) * car.acceleration;
      const deltaY = Math.sin(car.angle) * car.acceleration;
      car.position.x += deltaX;
      car.position.y += deltaY;

      if (deltaX !== 0 && deltaY !== 0) {
      }
    }
  },
};

carImage.onload = () => {
  car.size.width = carImage.width;
  car.size.height = carImage.height;
};

const drawables = [car];

async function drawFrame() {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  for (const drawable of drawables) {
    mainCtx.save();
    debugCtx.save();
    drawable.draw();
    mainCtx.restore();
    debugCtx.restore();
  }

  requestAnimationFrame(drawFrame);
}

document.onkeydown = (ev) => {
  if (!["F5", "Control", "r"].includes(ev.key)) ev.preventDefault();
  if (ev.key === "ArrowLeft") {
    car.tireAngle = Math.max(-maxTireAngle, car.tireAngle - Math.PI / 90);
  }

  if (ev.key === "ArrowRight") {
    car.tireAngle = Math.min(maxTireAngle, car.tireAngle + Math.PI / 90);
  }

  if (ev.key === "ArrowUp") {
    car.acceleration = Math.min(0.3, car.acceleration + 0.1);
  }

  if (ev.key === "ArrowDown") {
    car.acceleration = Math.max(-0.3, car.acceleration - 0.1);
  }
};

drawFrame();

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let logLock = false;

async function logs() {
  if (logLock) return;

  logLock = true;
  await sleep(1000);
  logLock = false;
  console.log({ carAngle: car.angle });
}
