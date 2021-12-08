

const getInfo = () => {
    let counter = 0;
    let url = `http://localHost:3000/getData`
    fetch(url).then(response => response.json())
        .then(data => {
            console.log(data);

            data.forEach(element => {
                console.log(element.q1)
            });


        }).catch(err => {
            console.log(err);
        })
}