const User = require("../../models/user");

exports.UserSignUp = async (req, res) => {
    try {
        const existingUser = await User.findOne({
            username: req.body.username,
        });
        if (existingUser) {
            return res.status(401).json({ error: "Username already exists" });
        } else {
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                fullName: req.body.fullName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                isAdmin: req.body.isAdmin || false,
            });

            await newUser.save();
            res.status(200).json({ message: "Create user successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
};

exports.UserLogin = async (req, res) => {
    try {
        const check = await User.findOne({
            username: req.body.username,
            password: req.body.password,
        });
        if (check) {
            res.status(200).send(check);
        } else {
            res.status(401).json({
                error: "Password or username is not correct",
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
};
