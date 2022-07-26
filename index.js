const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const carImage = new Image();
carImage.src = "./assets/car.png";
carImage.width = 300;
carImage.height = 150;

const tireImage = new Image();
tireImage.src = "./assets/tire.png";
tireImage.width = 50;
tireImage.height = 16;

const maxTireAngle = (30 * Math.PI) / 180;

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

    ctx.translate(car.position.x, car.position.y);
    ctx.rotate(car.angle);

    for (let i = 0; i < 2; i++) {
      if (!tireImage.complete) break;
      ctx.save();
      const modifier = Math.pow(-1, i + 1);
      ctx.translate(
        car.size.width / 2 - tireImage.width / 2 - 40,
        (car.size.height / 2) * modifier -
          (tireImage.height / 2) * modifier -
          15 * modifier
      );
      ctx.rotate(car.tireAngle);

      ctx.drawImage(
        tireImage,
        -tireImage.width / 2,
        -tireImage.height / 2,
        tireImage.width,
        tireImage.height
      );
      ctx.restore();
    }

    ctx.drawImage(
      car.model,
      -car.size.width / 2,
      -car.size.height / 2,
      car.size.width,
      car.size.height
    );

    car.position.x += Math.cos(car.tireAngle) * car.acceleration;
    car.position.y += Math.sin(car.tireAngle) * car.acceleration;
  },
};

carImage.onload = () => {
  car.size.width = carImage.width;
  car.size.height = carImage.height;
};

const drawables = [car];

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const drawable of drawables) {
    ctx.save();
    drawable.draw();
    ctx.restore();
  }
  requestAnimationFrame(drawFrame);
}

document.onkeydown = (ev) => {
  console.log(ev.key);
  ev.preventDefault();
  if (ev.key === "ArrowLeft") {
    car.tireAngle = Math.max(-maxTireAngle, car.tireAngle - Math.PI / 90);

    console.log(car.tireAngle);
    console.log({
      cos: Math.cos(car.tireAngle),
      sin: Math.sin(car.tireAngle),
    });
  }

  if (ev.key === "ArrowRight") {
    car.tireAngle = Math.min(maxTireAngle, car.tireAngle + Math.PI / 90);

    console.log(car.tireAngle);
    console.log({
      cos: Math.cos(car.tireAngle),
      sin: Math.sin(car.tireAngle),
    });
  }

  if (ev.key === "ArrowUp") {
    car.acceleration = Math.min(0.3, car.acceleration + 0.1);
  }

  if (ev.key === "ArrowDown") {
    car.acceleration = Math.max(-0.3, car.acceleration - 0.1);
  }
};

drawFrame();
