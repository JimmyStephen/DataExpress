const { MongoClient, ObjectId } = require('mongodb');
const { render } = require('pug');
const bcrypt = require('bcryptjs');


//get new database
const url = 'mongodb+srv://Jinx:Pass@cluster0.7gqy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const client = new MongoClient(url);
const dbName = 'myData';
const db = client.db(dbName);
const dataCollection = db.collection('Accounts');


exports.main = (req, res) => {
    res.render('main', {
        title: 'Main'
    });
}
exports.welcome = (req, res, next) => {
    res.render('welcome', {
        title: `Welcome`,
        lastEntry: `${req.cookies.LastVisit}`
    })
    next();
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
        const query = await dataCollection.findOne({ "username": username });
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
                isAdmin: false
            };
            let result = await dataCollection.insertOne(account);
            console.log(result)
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
exports.login = (req, res) => {
    res.render('login', {
        title: 'Login'
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

exports.loginAccount = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username == null || password == null) {
        res.redirect('/invalid');
    } else {
        await client.connect();
        let query = await dataCollection.findOne({ "username": username });
        if (query == null) {
            console.log('username does not exist exists');
            res.redirect('/invalid');
        } else {
            console.log(query.password)
            console.log(`sync : ${password}`, bcrypt.compareSync(password, query.password))
            if (!bcrypt.compareSync(password, query.password)) {
                res.redirect('/invalid');
            } else {
                console.log("Made it to next function")
                next();
            }
        }
    }

}

exports.showDB = async (req, res) => {
    await client.connect();
    const findResult = await dataCollection.find({}).toArray();
    console.log('Results Found: ', findResult);
    client.close();
    res.render('viewDB', {
        people: findResult
    });
}
exports.edit = async (req, res) => {
    await client.connect();
    const filteredDocs = await dataCollection.find({}).toArray();
    client.close();
    console.log('Got Account');
    res.render('edit', {
        people: filteredDocs
    })
}
exports.allData = async (req, res) => {
    console.log("client is trying to connect")
    await client.connect();
    console.log("makes it to all data function and client connects ")
    let findResult = await dataCollection.find({}).toArray();
    console.log("Find result: " + findResult)
    res.json(findResult);
}
exports.editPerson = async (req, res) => {
    await client.connect();
    const currentAccount = await dataCollection.findOne({ username: req.body.currentUsername });

    const newAccount = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        age: req.body.age,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        isAdmin: false
    }
    if (newAccount.email == null) {
        newAccount.email = currentAccount.email;
    }
    if (newAccount.username == null) {
        newAccount.username = currentAccount.username;
    }
    if (newAccount.age == null) {
        newAccount.age = currentAccount.age;
    }
    if (bcrypt.compareSync(currentAccount.password, newAccount.password)) {
        newAccount.password = currentAccount.password;
    } else {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(newAccount.password, salt);
        newAccount.password = hash;
    }


    console.log("This is the current account: \n" + currentAccount.username + ", " + currentAccount.email + ", " + currentAccount.age + ", " + currentAccount.password);
    console.log("This is the newAccount account: \n" + newAccount.username + ", " + newAccount.email + ", " + newAccount.age + ", " + newAccount.password);



    const updateResult = await dataCollection.updateOne(
        { username: req.body.currentUsername },
        {
            $set: {
                username: newAccount.username,
                password: newAccount.password,
                email: newAccount.email,
                age: newAccount.age,
                q1: newAccount.q1,
                q2: newAccount.q2,
                q3: newAccount.q3
            }
        }
    );
    client.close();
    res.redirect('/');
}

exports.delete = async (req, res) => {
    await client.connect();
    const deleteResult = await dataCollection.deleteOne({ _id: ObjectId(req.params.id) });
    client.close();
    res.redirect('/');
}