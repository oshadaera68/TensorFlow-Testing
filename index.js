/**
 *Powered By:MINDARTLK.
 *version:v0.1.0
 **/

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
}

document.addEventListener("DOMContentLoaded", run);