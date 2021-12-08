let Q1A1 = 0;
let Q1A2 = 0;
let Q1A3 = 0;
let Q2A1 = 0;
let Q2A2 = 0;
let Q2A3 = 0;
let Q3A1 = 0;
let Q3A2 = 0;
let Q3A3 = 0;
let getData = async () => {
    let url = `http://localHost:3000/getData`
    await fetch(url).then(response => response.json())
        .then(data => {
            console.log(data);

            data.forEach(element => {
                switch (element.q1) {
                    case "yes.":
                        Q1A1++;
                        console.log("match yes.")
                        break;
                    case "yes!":
                        Q1A2++;
                        break;
                    case "Yes?!":
                        Q1A3++;
                    default:
                        break;
                }
                switch (element.q2) {
                    case "Leaches":
                        Q2A1++;
                        console.log("match leaches")
                        break;
                    case "Wasps":
                        Q2A2++;
                        break;
                    case "Mosquitoes":
                        Q2A3++;
                    default:
                        break;
                }
                switch (element.q3) {
                    case "Oranges":
                        Q3A1++;
                        break;
                    case "Apples":
                        Q3A2++;
                        break;
                    case "Lemons":
                        Q3A3++;
                    default:
                        break;
                }
            });
            makeGraph();
            Q1A1 = 0;
            Q1A2 = 0;
            Q1A3 = 0;
            Q2A1 = 0;
            Q2A2 = 0;
            Q2A3 = 0;
            Q3A1 = 0;
            Q3A2 = 0;
            Q3A3 = 0;
        }).catch(err => {
            console.log(err);
        })
}
let makeGraph = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    //changing size
    canvas.width = 450;
    canvas.height = 150;
    drawText = () => {
        //setting text color
        ctx.fillStyle = '#FFF';
        //setting font and text size
        ctx.font = '10px Arial';
        //setting the text and start location
        //(text, start x, start y)
        //question 1
        ctx.fillText('yes.', 0, 150);
        ctx.fillText('yes!', 50, 150);
        ctx.fillText('Yes?!', 100, 150);
        ctx.fillText(`Do you like me?`, 50, 10);
        //question 2
        ctx.fillText('Leaches', 150, 150);
        ctx.fillText('Wasps', 200, 150);
        ctx.fillText('Mosquitoes', 250, 150);
        ctx.fillText(`What is your favorite insect`, 200, 10);
        //question3
        ctx.fillText('Oranges', 300, 150);
        ctx.fillText('Apples', 350, 150);
        ctx.fillText('Lemons', 400, 150);
        ctx.fillText(`The better fruit`, 350, 10);
    }

    drawGraph = (Q1A1, Q1A2, Q1A3, Q2A1, Q2A2, Q2A3, Q3A1, Q3A2, Q3A3) => {
        //get total Q1
        let Q1total = Q1A1 + Q1A2 + Q1A3;
        let Q1A1Percent = (Q1A1 / Q1total);
        let Q1A2Percent = (Q1A2 / Q1total);
        let Q1A3Percent = (Q1A3 / Q1total);

        let Q2total = Q2A1 + Q2A2 + Q2A3;
        let Q2A1Percent = (Q2A1 / Q2total);
        let Q2A2Percent = (Q2A2 / Q2total);
        let Q2A3Percent = (Q2A3 / Q2total);

        let Q3total = Q3A1 + Q3A2 + Q3A3;
        let Q3A1Percent = (Q3A1 / Q3total);
        let Q3A2Percent = (Q3A2 / Q3total);
        let Q3A3Percent = (Q3A3 / Q3total);

        console.log("Q1A1: " + Q1A1Percent);
        console.log("Q1A2: " + Q1A2Percent);
        console.log("Q1A3: " + Q1A3Percent);

        console.log("Q2A1: " + Q2A1Percent);
        console.log("Q2A2: " + Q2A2Percent);
        console.log("Q2A3: " + Q2A3Percent);

        console.log("Q3A1: " + Q3A1Percent);
        console.log("Q3A2: " + Q3A2Percent);
        console.log("Q3A3: " + Q3A3Percent);

        console.log("Total Q1: " + (Q1A3Percent + Q1A2Percent + Q1A1Percent));
        console.log("Total Q2: " + (Q2A3Percent + Q2A2Percent + Q2A1Percent));
        console.log("Total Q3: " + (Q3A3Percent + Q3A2Percent + Q3A1Percent));

        //setting the rect color
        ctx.fillStyle = '#405';

        //draw rectangles Q1
        //a1
        ctx.fillRect(10, (1 - Q1A1Percent) * canvas.height, 20, 150);
        //a2
        ctx.fillRect(60, (1 - Q1A2Percent) * canvas.height, 20, 150);
        //a3
        ctx.fillRect(110, (1 - Q1A3Percent) * canvas.height, 20, 150);

        ctx.fillRect(142, 0, 5, 150);

        //draw rectangles Q2
        //a1
        ctx.fillRect(160, (1 - Q2A1Percent) * canvas.height, 20, 150);
        //a2
        ctx.fillRect(210, (1 - Q2A2Percent) * canvas.height, 20, 150);
        //a3
        ctx.fillRect(260, (1 - Q2A3Percent) * canvas.height, 20, 150);

        ctx.fillRect(292, 0, 5, 150);

        //draw rectangles Q3
        //a1
        ctx.fillRect(310, (1 - Q3A1Percent) * canvas.height, 20, 150);
        //a2
        ctx.fillRect(360, (1 - Q3A2Percent) * canvas.height, 20, 150);
        //a3
        ctx.fillRect(410, (1 - Q3A3Percent) * canvas.height, 20, 150);
    }

    //take in data from API
    drawGraph(Q1A1, Q1A2, Q1A3, Q2A1, Q2A2, Q2A3, Q3A1, Q3A2, Q3A3);
    drawText();
}