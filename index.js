const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const carImage = new Image();
carImage.src = "./assets/car.png";
carImage.width = 300;
carImage.height = 150;

const car = {
  position: {
    x: 200,
    y: 200,
  },
  size: {
    width: 292,
    height: 156,
  },
  direction: 0,
  model: carImage,

  draw: () => {
    if (!car.model.complete) return;

    ctx.save();
    ctx.translate(car.position.x, car.position.y);
    ctx.rotate(car.direction);
    ctx.drawImage(
      car.model,
      -car.size.width / 2,
      -car.size.height / 2,
      car.size.width,
      car.size.height
    );
    ctx.restore();

    ctx.fillStyle = "Green";
    ctx.fillRect(
      car.position.x - car.size.width / 2,
      car.position.y - car.size.height / 2,
      5,
      5
    );
  },
};

carImage.onload = () => {
  car.size.width = carImage.width;
  car.size.height = carImage.height;
};

const drawables = [car];

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const drawable of drawables) drawable.draw();

  requestAnimationFrame(drawFrame);
}

document.onkeydown = (ev) => {
  console.log(ev.key);
};

drawFrame();
