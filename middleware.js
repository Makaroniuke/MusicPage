const Track = require('./models/track')
const Sample = require('./models/sample')

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user)
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
}

module.exports.isTrackAuthor = async (req, res, next) => {
    const { id } = req.params;
    const track = await Track.findById(id)
    if (!track.author.equals(req.user._id)) {
        req.flash('error', 'You dont have a permission')
        return res.redirect(`/`)
    }
    next()
}

module.exports.isSampleAuthor = async (req, res, next) => {
    const { id } = req.params;
    const sample = await Sample.findById(id)
    if (!sample.author.equals(req.user._id)) {
        req.flash('error', 'You dont have a permission')
        return res.redirect(`/`)
    }
    next()
}


module.exports.isProducer = (req,res,next)=>{
    if (req.user.role != 'Producer'){
        req.flash('error', 'You dont have a permission')
        return res.redirect(`/`)
    }
    next()
}

module.exports.isAdmin = (req,res,next)=>{
    if (req.user.role != 'Administrator'){
        req.flash('error', 'You dont have a permission')
        return res.redirect(`/`)
    }
    next()
}
