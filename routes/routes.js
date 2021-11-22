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
    res.render('create', {
        title: 'Create Account'
    });
}