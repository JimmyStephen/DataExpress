const { MongoClient, ObjectId } = require('mongodb');
const { render } = require('pug');
const bcrypt = require('bcryptjs');

//get new database
const url = 'mongodb+srv://Jinx:Pass@cluster0.7gqy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const client = new MongoClient(url);

exports.main = (req, res) => {
    res.render('main', {
        title: 'Main'
    });
}

//function that will get the info from the form that the user submits and adds the data to the database
//in the form of a person model
exports.createAccount = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const age = req.body.age;
    const q1 = req.body.q1;
    const q2 = req.body.q2;
    const q3 = req.body.q3;

    if (username == null || password == null || email == null || age == null || q1 == null || q2 == null || q3 == null) {
        res.redirect('/invalid');
    } else {
        await client.connect();

        const id = await dataCollection.countDocuments() + 1;
        const query = dataCollection.findOne({ "Username": username });
        if (query != null) {
            console.log('username already exists');
            res.redirect('/invalid');
        } else {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
            //    username, password, email, age, and the answers to three multiple choice
            let account = {
                username: username,
                password: hash,
                email: email,
                age: age,
                q1: q1,
                q2: q2,
                q3: q3,
            };
            const insertResult = await collection.insertOne(account);
            client.close();
            res.redirect('/');
        }
    }
}

exports.Invalid = (req, res) => {
    res.render('invalid', {
        title: 'Add Account'
    });
}

//function used to load the create screen
exports.loadCreate = (req, res) => {
    res.render('createAc', {
        title: 'Add Account'
    });
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

    if (first != null && last != null && email != null && username != null && password != null && confirmation != null) {

        if (password == confirmation) {
            if (nameRegex.test(first) && nameRegex.test(last) && emailRegex.test(email) && userRegex.test(username) && passwordRegex.test(password)) {

                await client.connect();

                const id = await dataCollection.countDocuments() + 1;

                const query = dataCollection.findOne({ "Username": username });
                if (query != null) {
                    console.log('username already exists');
                    res.redirect('/error');
                } else {

                }
            }
        }
    }
}