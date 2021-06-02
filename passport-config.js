const local = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: "User not found!" });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect password!" });
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new local({ usernameField: "email", passwordField: "password" }, authenticateUser));
    passport.serializeUser((user, done) => { done(null, user._id) });
    passport.deserializeUser((_id, done) => { return done(null, getUserById(_id)) });
}

module.exports = initialize;