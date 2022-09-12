class NeuralNetwork{
	constructor(neuronCounts) {
		this.levels = [];
		for (let i = 0; i < neuronCounts.length - 1; i++){
			this.levels.push(new Level(
				neuronCounts[i], neuronCounts[i + 1]
			));
		}
	}
	static feedForward(givenInputs, network) {
		let outputs = Level.feedForward(
			givenInputs, network.levels[0]
		);
		// putting the output of the previous level as the input
		// for the new level
		for (let i = 1; i < network.levels.length; i++){
			outputs = Level.feedForward(
				outputs, network.levels[i]
			);
		}
		return outputs;
	}
	static mutate(network, amount = 1) {
		network.levels.forEach(level => {
			for (let i = 0; i < level.biases.length; i++) {
				level.biases[i] = lerp(level.biases[i],
					Math.random() * 2 - 1,
					amount
				)
			}
			for (let i = 0; i < level.weights.length; i++){
				for (let j = 0; j < level.weights[i].length; j++){
					level.weights[i][j] = lerp(
						level.weights[i][j],
						Math.random() * 2 - 1,
						amount
					)
				}
			}
		});
	}

}

class Level{
	constructor(inputCount, outputCount) {
		this.inputs = new Array(inputCount); // from sensors
		this.outputs = new Array(outputCount); // compute them using weights and biases
		this.biases = new Array(outputCount); //level at which the neuron will fire
	
		this.weights = [];
		for (let i = 0; i < inputCount; i++){
			this.weights[i] = new Array(outputCount);
		}
		// console.log("inputs: ", this.inputs);
		// console.log("outputs: ", this.outputs);
		// console.log("weights: ", this.weights);

		Level.#randomize(this);
	}
	static #randomize(level) {
		for (let i = 0; i < level.inputs.length; i++){
			for (let j = 0; j < level.outputs.length; j++){
				level.weights[i][j] = Math.random() * 2 - 1; // (0 to 1) * 2 to get (0 to 2) and then -1 to get (-1 to 1)
			}
		}
		// console.log("weights(after randomizing): ", this.weights);

		for (let i = 0; i < level.biases.length; i++){
			level.biases[i] = Math.random() * 2 - 1;
		}
		// console.log("biases(after randomizing): ", this.biases)
	}

	static feedForward(givenInputs, level) {
		for (let i = 0; i < level.inputs.length; i++){
			level.inputs[i] = givenInputs[i]; // set inputs to inputs from sensors
		}

		//for every output calculate the sum
		//sum = every input * the weight between that input and the output
		for (let i = 0; i < level.outputs.length; i++){
			let sum = 0;
			for (let j = 0; j < level.inputs.length; j++){
				sum += level.inputs[j] * level.weights[j][i];
				
			}

			//if the sum is greater than the bias the output fires
			if (sum > level.biases[i]) {
				level.outputs[i] = 1;
			} else {
				level.outputs[i] = 0;
			}
		}

		return level.outputs;
	}
}
