const User = require('../models/user')

module.exports.index = (req,res)=>{
    res.render('roles')
}

module.exports.getUser = async (req,res)=>{
    try{
        const {username} = req.body
        const user = await User.findOne({username: username})
        if (!user) {
            req.flash('error', 'Cannot find this user')
            return res.redirect(`/roles`)
        }
        res.redirect(`/rolesChange/${user._id}`)
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/roles`)
    }
}

module.exports.showUser = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if (!user) {
            req.flash('error', 'Cannot find this user')
            return res.redirect(`/roles`)
        }
        res.render('rolesChange', {user})
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/roles`)
    }
}

module.exports.changeRole = async (req,res)=>{
    try{
        const {role} = req.body
        const {id} = req.params
        const user = await User.findByIdAndUpdate(id, {role: role})
        user.save()
        req.flash('success', 'Role successfully changed')
        res.redirect('/roles')
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/roles`)
    }
}