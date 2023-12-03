const Feedback = require('../models/feedback')
const Track = require('../models/track')
const { cloudinary } = require('../cloudinary')


module.exports.index = async (req, res) => {
    const tracks = await Track.find({forFeedback: true}).populate('feedback')
    res.render('feedback', { tracks })
}

// module.exports.newForm = (req, res) => {
//     if (req.user.role == 'Producer')
//         res.render('feedback/new')
//     res.redirect('/feedback')
// }

module.exports.newForm = async (req, res) => {
    const track = await Track.findById(req.params.id).populate('author')
    if (!track) {
        return res.redirect(`/feedback`)
    }
    res.render('feedback/new', { track })
}

module.exports.new =  async (req, res) => {
    const { review } = req.body
    const { id } = req.params;
    const feedback = new Feedback({review: review })
    await feedback.save()
    const updatedTrack = await Track.findByIdAndUpdate(id, {feedback: feedback})
    await updatedTrack.save()
    return res.redirect(`/feedback/details/${updatedTrack._id}`)
}

module.exports.uploadTrackForm = (req, res) => {
    res.render('feedback/uploadTrack')
}

module.exports.uploadTrack = async (req, res) => {
    const { trackName, description } = req.body
    const track = new Track({ filename: req.file.filename, name: trackName, description: description, forFeedback: true, url: req.file.path, author: req.user })
    await track.save()
    res.redirect('/feedback')
}

module.exports.editForm = async (req, res) => {
    const track = await Track.findById(req.params.id).populate('feedback')
    if (!track) {
        return res.redirect(`/feedback`)
    }
    res.render('feedback/edit', { track })
}

module.exports.edit = async (req, res) => {
    const track = await Track.findById(req.params.id).populate('feedback')

    if (!track) {
        return res.redirect(`/feedback`)
    }
    res.render('feedback/edit', { track })
}

module.exports.feedbackDetails =  async (req, res) => {
    const track = await Track.findById(req.params.id).populate('feedback')
    res.render('feedback/details', { track })
}