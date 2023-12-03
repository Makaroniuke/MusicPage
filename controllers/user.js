const User = require('../models/user')



module.exports.registerForm = (req, res) => {
    res.render('register')
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        await registeredUser.save()
        res.redirect('/')      
    } catch (e) {
        console.log(e.message)
    }
}

module.exports.loginForm = (req, res) => {
    res.render('login')
}

module.exports.login = (req, res) => {
    res.redirect('/')
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    })
    res.redirect('/')
}