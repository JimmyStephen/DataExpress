const {MongoClient, ObjectId} = require('mongodb');
const { render } = require('pug');
const bcrypt = require('bcryptjs');

//get new database
const url = 'mongodb+srv://Jinx:Pass@cluster0.7gqy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const client = new MongoClient(url);

//function that will get the info from the form that the user submits and adds the data to the database
//in the form of a person model
exports.createAccount = (req, res) => {
    await client.connect();
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    //    username, password, email, age, and the answers to three multiple choice
    let account = {
        username: req.body.name,
        password: hash,
        email: req.body.email,
        age: req.body.age,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
    };
    const insertResult = await collection.insertOne(account);
    client.close();
    res.redirect('/');
}


//function used to load the create screen
exports.loadCreate = (req, res) => {

}

exports.add = async (req, res) => {

    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirmation = req.body.confirmation;

    const nameRegex = /.*[a-z].*[a-z].*/i;
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{4,}.[a-zA-Z]{2,}$/;
    const userRegex = /^[0-9a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$!%*?&])(?=.*\d)[A-Za-z\d@#$!%*?&]{4,}$/;   

    if(first != null && last != null && email != null && username != null && password != null && confirmation != null) {
        
        if(password == confirmation) {
            if(nameRegex.test(first) && nameRegex.test(last) && emailRegex.test(email) && userRegex.test(username) && passwordRegex.test(password)) {
                
                await client.connect();

                const id = await dataCollection.countDocuments() + 1;

                const query = dataCollection.findOne({ "Username" : username });
                if(query != null) {
                    console.log('username already exists');
                    res.redirect('/error');
                }else{

                }
            }
        }
    }
}