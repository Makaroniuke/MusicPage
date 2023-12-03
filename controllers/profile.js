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
    res.redirect('/profile')
}

module.exports.editTrackForm =  async (req, res) => {
    const track = await Track.findById(req.params.id)
    if (!track) {
        return res.redirect(`/feedback`)
    }
    res.render('profile/editTrack', { track })
}

module.exports.editTrack = async (req, res) => {
    const { trackName, description } = req.body
    const track = await Track.findByIdAndUpdate(req.params.id, {trackName: trackName, description: description })
    await track.save()

    res.redirect('/profile')
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const track = await Track.findById(id);
    await cloudinary.uploader.destroy(track.filename)
    await Track.findByIdAndRemove(id);
    res.redirect('/profile')
}