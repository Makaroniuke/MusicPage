const User = require('../models/user')


module.exports.index = (req,res)=>{
    res.render('roles')
}

module.exports.getUser = async (req,res)=>{
    const {username} = req.body
    const user = await User.findOne({username: username})
    res.redirect(`/rolesChange/${user._id}`)
}

module.exports.showUser = async(req,res)=>{
    const user = await User.findById(req.params.id)
    res.render('rolesChange', {user})
}

module.exports.changeRole = async (req,res)=>{
    const {role} = req.body
    const {id} = req.params
    const user = await User.findByIdAndUpdate(id, {role: role})
    user.save()
    res.redirect('/roles')
}