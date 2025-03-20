const User = require("../model/userModel")


const userCtrl = {
    getAll: async (req, res) => {
        try {
            let users = await User.find().select('-password -role')
            res.status(200).json({ message: "all users", users })
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: error.message })
        }
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params
            let user = await User.findById(id).select('-password')
            if (!user) {
                res.status(404).json({ message: "user not found" })
            }
            res.status(200).json({ message: "get user", user: user })
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: error.message })
        }
    },
}
module.exports=userCtrl