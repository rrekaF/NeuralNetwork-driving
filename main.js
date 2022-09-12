const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;


const networkCanvas= document.getElementById("networkCanvas");
networkCanvas.width = 800;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const trafficN = 10;
let traffic = generateTraffic(trafficN);

const N = 2;
let cars = generateCars(N)
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
	for (let i = 0; i < cars.length; i++){
		cars[i].brain = JSON.parse(
			localStorage.getItem("bestBrain"));
		if (i != 0) {
			NeuralNetwork.mutate(cars[i].brain, 0.1);
			}
	}
}

function save() {
	localStorage.setItem("bestBrain",
		JSON.stringify(bestCar.brain));
}

function discard() {
	localStorage.removeItem("bestBrain");
}

function generateCars(N) {
	const cars = [];
	for (let i = 1; i < N; i++){
		cars.push(new Car(road.getLaneCenter(1), 100, "AI"));
	}
	return cars;
}
function generateSingleTraffic(playerY = 300) {
	return new Car(
		road.getLaneCenter(
			getRandomInt(0, road.laneCount)),
			-getRandomInt(Math.abs(playerY - 700),
			Math.abs(playerY - 1500)),
			"DUMMY",
			getRandomDecimal(1, 2.5),
			getRandomDecimal(0.05, 0.2));
}

function generateTraffic(trafficN) {
	const traffic = [];
	for (let i = 0; i < trafficN; i++){
		traffic.push(generateSingleTraffic());
	}
	return traffic;
}
let timer = 0;
function animate(time) {
	timer++;
	for (let i = 0; i < traffic.length; i++){
		if (traffic[i].damaged || traffic[i].y > bestCar.y + 200) {
			traffic.splice(i, 1, generateSingleTraffic(bestCar.y));
		}
	}
	for (let i = 0; i < traffic.length; i++){
		traffic[i].update(road.borders,[]);
	}
	for (let i = 0; i < cars.length; i++){
		cars[i].update(road.borders, traffic);
	}

	bestCar = cars.find(
		c => c.y == Math.min(
			...cars.map(c => c.y)
		));
	
	carCanvas.height = window.innerHeight;
	networkCanvas.height = window.innerHeight;

	carCtx.save();
	carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);

	road.draw(carCtx);
	for (let i = 0; i < traffic.length; i++){
		traffic[i].draw(carCtx, "darkred");
	}
	// carCtx.globalAlpha = 0.2;
	for (let i = 0; i < cars.length; i++) {
		if (!cars[i].damaged) {
			cars[i].draw(carCtx, "blue");
		}
	}
	// carCtx.globalAlpha = 1;
	bestCar.draw(carCtx, "blue", true);

	carCtx.restore();

	networkCtx.lineDashOffset = -time/50
	Visualizer.drawNetwork(networkCtx, bestCar.brain);
	requestAnimationFrame(animate);
	currentScore = bestCar.y;
	document.getElementById("currentScore").innerHTML = "current score: " + Math.floor(currentScore);
	document.getElementById("cycles").innerHTML = "cycles: " + timer;
	// if (timer == 10000) {
	// 	// save();
	// 	location.reload();
	// }
}
animate();