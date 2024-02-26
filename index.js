require('dotenv').config({ path: '.env'});
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const Animal = require("./models/animal");
const User = require("./models/user");
const Event = require("./models/event");
const { render } = require("ejs");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { Passport } = require("passport");
const dbUrl = process.env.DB_URL;
const app = express();

const clientP = require("mongoose").connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((m) => {
        console.log("Connected.");
        return m.connection.getClient();
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });


initializePassport(
    passport,
    email => { return User.findOne({ email: email }) },
    _id => { return User.findOne({ _id: _id }) }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        clientPromise: clientP,
        dbName: "Animal-Shop-Data",
        stringify: false,
        autoRemove: 'interval',
        autoRemoveInterval: 1
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    const animalList = await Animal.find({});
    const events = await Event.find({});
    const users = await User.find({});
    res.render("index", { signedIn, user, animals: animalList, events, users });
});

app.get("/animals", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    if (req.query.q) {
        const query = req.query.q.charAt(0).toUpperCase() + req.query.q.slice(1);
        const animalList = await Animal.find({});
        const filterdList = [];
        for (let animalA of animalList) {
            if (animalA.animalInfo.animal == query || animalA.name == query || animalA.animalInfo.breed.includes(query)) {
                filterdList.push(animalA);
            }
        }
        res.render("animals/index", { animals: filterdList, signedIn, user });
    } else {
        const animalList = await Animal.find({});
        res.render("animals/index", { animals: animalList, signedIn, user });
    }
});

app.get("/events", async (req, res) => {
    const events = await Event.find({});
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    const users = await User.find({});
    res.render("events/index", { signedIn, user, events, users });
});

app.get("/events/add", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
        res.render("events/add", { user, signedIn });
    } else {
        res.redirect("/login");
    }
});

app.get("/events/:id/edit", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    res.render("events/edit", {user, signedIn, event});
});

app.patch("/events/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (req.body.name) {
        event.name = req.body.name;
    }
    if (req.body.text) {
        event.text = req.body.text;
    }
    if (req.body.img) {
        event.img = req.body.img;
    }
    await event.save().then(() => console.log("Edited"));
    res.redirect("/events");
});

app.post("/events", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    let img = "";
    if (req.body.img) {
        img = req.body.img;
    }
    const newEvent = new Event({
        name: req.body.name,
        img: img,
        text: req.body.text,
        userId: user._id
    });
    await newEvent.save().then(() => console.log(newEvent.name + " Added"));
    res.redirect("/events");
});

app.get("/login", (req, res) => {
    const signedIn = req.isAuthenticated();
    if (signedIn) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

app.get("/register", (req, res) => {
    const signedIn = req.isAuthenticated();
    if (signedIn) {
        res.redirect("/");
    } else {
        res.render("register");
    }
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        newUser.save().then(() => console.log("New user added."));
        res.redirect("/login");
    } catch (e) {
        console.log(e);
        res.redirect('/register');
    }
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/animals/add", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    res.render("animals/add", {user, signedIn});
});

app.post("/animals", async (req, res) => {
    let trained = false;
    if (req.body.trained) {
        trained = true;
    }
    const newAnimal = new Animal({
        name: req.body.name,
        animalInfo: {
            animal: req.body.animal,
            breed: req.body.breed
        },
        age: req.body.age,
        img: req.body.img,
        trained: trained,
    });
    await newAnimal.save().then(() => console.log(newAnimal.name + " Added"));
    res.redirect("/animals");
});

app.get("/profile/:id/img", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    res.render("editImg", { user, signedIn })
});

app.patch("/profile/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (req.body.img) {
        user.img = req.body.img;
    }
    await user.save();
    res.redirect(`/profile/${id}`);
});

app.get("/profile/:id", async (req, res) => {
    const { id } = req.params;
    const signedIn = req.isAuthenticated();
    const user = await User.findById(id);
    const events = await Event.find({});
    if (signedIn) {
        res.render("profile", { signedIn, user, id, events });
    } else {
        res.redirect("/");
    }
});

app.get("/animals/:id/edit", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    const { id } = req.params;
    const animal = await Animal.findById(id);
    res.render("animals/edit.ejs", { id, animal, user, signedIn })
});

app.get("/animals/:id/delete", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    const { id } = req.params;
    await Animal.findByIdAndDelete(id);
    res.redirect("/animals");
});

app.get("/animals/:id/adopt", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    const { id } = req.params;
    const animal = await Animal.findById(id);
    animal.adopted = true;
    await animal.save();
    res.render("animals/animal", { animal, signedIn, user });
});


app.patch("/animals/:id", async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    if (req.body.name) {
        animal.name = req.body.name;
    }
    if (req.body.age) {
        animal.age = req.body.age;
    }
    if (req.body.img) {
        animal.img = req.body.img;
    }
    if (req.body.img) {
        animal.img = req.body.img;
    }
    if (req.body.img) {
        animal.img = req.body.img;
    }
    if (req.body.trained) {
        animal.trained = true;
    } else {
        animal.trained = false;
    }
    if (req.body.adopted) {
        animal.adopted = true;
    } else {
        animal.adopted = false;
    }
    await animal.save();
    res.redirect(`/animals/${id}`);
});

app.get("/animals/:id", async (req, res) => {
    const signedIn = req.isAuthenticated();
    let user;
    if (signedIn) {
        user = await (User.findById(req.session.passport.user));
    }
    const { id } = req.params;
    const animal = await Animal.findById(id);
    res.render("animals/animal", { animal, signedIn, user });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("LISTENING ON PORT")
});
