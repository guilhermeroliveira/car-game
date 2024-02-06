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

const maxTireAngle = 30;

const car = {
   position: {
      x: 100,
      y: 60,
   },
   size: {
      width: 0,
      height: 0,
   },
   angle: 0,
   model: carImage,
   tireAngle: 0,
   tireAngleRads: 0,
   speed: 0,

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

         mainCtx.rotate(car.tireAngleRads);

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

      if (car.speed !== 0) {
         const minTurnSensitivity = .01;
         const maxTurnAngle = 0.2;
         const adjustedTurnSensitivity = Math.max(minTurnSensitivity, 0.001 / Math.abs(car.speed));
         const deltaAngle = car.tireAngleRads * adjustedTurnSensitivity;

         car.angle += Math.min(Math.max(-maxTurnAngle, deltaAngle), maxTurnAngle);

         let deltaX = Math.cos(car.angle) * car.speed;
         let deltaY = Math.sin(car.angle) * car.speed;

         car.position.x += deltaX;
         car.position.y += deltaY;
      }

      debugCtx.restore();

      updateDebugStats();
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
   if (!["F5", "F12", "Control", "r"].includes(ev.key)) ev.preventDefault();

   if (ev.key === "ArrowLeft") {
      car.tireAngle = Math.max(-maxTireAngle, car.tireAngle - 2);
      car.tireAngleRads = car.tireAngle * Math.PI / 180;
   }

   if (ev.key === "ArrowRight") {
      car.tireAngle = Math.min(maxTireAngle, car.tireAngle + 2);
      car.tireAngleRads = car.tireAngle * Math.PI / 180;
   }

   if (ev.key === "ArrowUp") {
      car.speed = Math.min(5, (car.speed + 0.1).toFixed(1));
   }

   if (ev.key === "ArrowDown") {
      car.speed = Math.max(-5, (car.speed - 0.1).toFixed(1));
   }
};

document.onkeyup = (ev) => { };

drawFrame();

function clamp(num, min, max) {
   return num < min ? max : num > max ? min : num;
}

function sleep(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateDebugStats() {
   const text = `
      Car angle: ${car.angle * 180 / Math.PI}<br>
      Tire angle rads: ${car.tireAngleRads}<br>
      Tire angle: ${car.tireAngle}<br>
      Car speed: ${car.speed}
   `;

   const div = document.querySelector("#debugText");
   div.innerHTML = text;
}
