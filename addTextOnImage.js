const sharp = require("sharp");

async function addTextOnImage(text) {
    try {
        // Width of quarkus card is 600px
        const width = 600;
        // Height of quarkus card is 330px
        const height = 330;
        // Font size of the text
        const fontSize = 30;

        // Start position of the text
        let idx = 90;
        // Create several tspan elements

        // Split the words in every 32 characters
        // Break on every 32 characters
        const tspanElements = splitTextIntoLines(text).map((line) => {
            console.log(line);
            const tspan = `<tspan x="50%" y="${idx}">${line}</tspan>`;
            idx += fontSize + 10;
            return tspan;
        }).join("");
        const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      .title { fill: white; font-size: ${fontSize}px; font-weight: bold; font-family:'Open Sans',ui-serif}
      </style>
            <text x="50%" y="50%" text-anchor="middle" class="title" >
                ${tspanElements}
            </text>
    </svg>
    `;
        const svgBuffer = Buffer.from(svgImage);
        const image = await sharp("quarkus_card_blank.png")
            .composite([
                {
                    input: svgBuffer,
                    top: 80,
                    left: 0,
                },
            ])
            .toFile("quarkus-output.png");
    } catch (error) {
        console.log(error);
    }
}

function splitTextIntoLines(text) {
    const lines = [];
    const words = text.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if (currentLine.length + word.length <= 32) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine !== '') {
        lines.push(currentLine);
    }

    return lines;
}

addTextOnImage("Amazon Lambda with RESTEasy Reactive, Undertow, or Reactive Routes");