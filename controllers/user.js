const User = require('../models/user')



module.exports.registerForm = (req, res) => {
    res.render('register')
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username, imageUrl: '' })
        const registeredUser = await User.register(user, password)
        await registeredUser.save()
        res.redirect('/')      
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register') 
    }
}

module.exports.loginForm = (req, res) => {
    res.render('login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Succesfully logged in')
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