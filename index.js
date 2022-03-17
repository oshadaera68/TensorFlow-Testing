/**
 *Powered By:MINDARTLK.
 *version:v0.1.0
 **/
function dataToTensor(data) {
    return tf.tidy(() => {
        tf.util.shuffle(data);

        const inputs = data.map(d => d.hp);
        const labels = data.map(d => mpg);

        //inputTensor and labalTensor
        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        //input tensor
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();

        //label tensor
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        //normalize inputs and labels
        const normalizeInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizeLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizeInputs,
            labels: normalizeLabels,
            inputMax,
            inputMin,
            labelMax,
            labelMin
        }
    });
}

async function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense(
        {
            inputShape: [1],
            units: 1
        }
    ));
    model.add(tf.layers.dense({
        units: 1
    }));

    return model;
}

async function getData() {
    const dataResp = await fetch("https://storage.googleapis.com/tfjs-tutorials/carsData.json");
    const rawData = await dataResp.json();

    const data = rawData.map(function (carData) {
        return {
            hp: carData.Horsepower,
            mpg: carData.Miles_per_Gallon
        }
    });

    return data;
}

async function run() {
    const data = await getData();
    const values = data.map(d => {
        return {
            x: d.hp,
            y: d.mpg
        }
    });
    console.log(values);
    tfvis.render.scatterplot({name: 'HorsePower VS Miles per gallon'}, {values}, {
        xLabel: "Horsepower",
        yLabel: "Mile per gallon",
        height: 450
    });

    const model = await createModel();
    tfvis.show.modelSummary({name: 'HP VS MPG model summary'}, model);
    const tensorData = dataToTensor(data);
    const {inputs, labels} = tensorData;
}

document.addEventListener("DOMContentLoaded", run);