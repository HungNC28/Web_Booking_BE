const User = require("../../models/user");

exports.AdminLogin = async (req, res) => {
    try {
        const check = await User.findOne({
            username: req.body.username,
            password: req.body.password,
            isAdmin: true,
        });
        if (check) {
            res.status(200).json({ message: "Login Success" });
        } else {
            res.status(401).json({
                error: "Password or username is not correct",
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
};
