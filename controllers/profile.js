const Track = require('../models/track')
const User = require('../models/user')
const { cloudinary } = require('../cloudinary')



module.exports.index = async (req, res) => {
    const user = await User.findById(req.params.id)
    const tracks = await Track.find({ forFeedback: false , author: user})
    res.render('profile', { tracks , user})
}

module.exports.addTrackForm = (req, res) => {
    res.render('profile/addTrack')
}

module.exports.addTrack =async (req, res) => {
    const { trackName, description } = req.body
    const track = new Track({ filename: req.file.filename, name: trackName, description: description, forFeedback: false, url: req.file.path, author: req.user})
    await track.save()
    req.flash('success', 'Track uploaded successfully')
    res.redirect(`/profile/${req.user.id}`)
}

module.exports.editTrackForm =  async (req, res) => {
    try{
        const track = await Track.findById(req.params.id)
        if (!track) {
            req.flash('error', 'Cannot find this track')
            return res.redirect(`/profile/${req.user.id}`)
        }
        res.render('profile/editTrack', { track })
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/profile/${req.user.id}`)
    }
}

module.exports.editTrack = async (req, res) => {
    try{
        const { trackName, description } = req.body
        const track = await Track.findByIdAndUpdate(req.params.id, {trackName: trackName, description: description })
        await track.save()
        req.flash('success', 'Track updated successfully')
        res.redirect(`/profile/${req.user.id}`)
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/profile/${req.user.id}`)
    }
}

module.exports.delete = async (req, res) => {
    try{
        const { id } = req.params;
        const track = await Track.findById(id);
        if (!track) {
            req.flash('error', 'Cannot find this track')
            return res.redirect(`/profile`)
        }
        await cloudinary.uploader.destroy(track.filename)
        await Track.findByIdAndRemove(id);
        req.flash('success', 'Track deleted successfully')
        res.redirect(`/profile/${req.user.id}`)
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/profile/${req.user.id}`)
    }
}

module.exports.editProfileForm = async(req, res) => {
    res.render('profile/editProfile')
}

module.exports.editProfile = async (req, res) => {
    const {id} = req.params
    if(req.user.imageUrl == ''){
        await User.findByIdAndUpdate(id, {filename: req.file.filename,  imageUrl: req.file.path})
    }else{
        await cloudinary.uploader.destroy(req.user.filename, {"resource_type": "image"})
        await User.findByIdAndUpdate(id, {filename: req.file.filename,  imageUrl: req.file.path})
    } 
    req.flash('success', 'Image uploaded successfully')
    res.redirect(`/profile/${id}`)
}