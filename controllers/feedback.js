const Feedback = require('../models/feedback')
const Track = require('../models/track')
const { cloudinary } = require('../cloudinary')


module.exports.index = async (req, res) => {
    const tracks = await Track.find({forFeedback: true}).populate('feedback').populate('author')
    res.render('feedback', { tracks })
}



module.exports.newForm = async (req, res) => {
    const track = await Track.findById(req.params.id).populate('author')
    if (!track) {
        req.flash('error', 'Cannot find this track')
        return res.redirect(`/feedback`)
    }
    res.render('feedback/new', { track })
}

module.exports.new =  async (req, res) => {
    try{
        const { review } = req.body
        const { id } = req.params;
        const feedback = new Feedback({review: review })
        await feedback.save()
        const updatedTrack = await Track.findByIdAndUpdate(id, {feedback: feedback})
        await updatedTrack.save()
        req.flash('success', 'Feedback added successfully')
        return res.redirect(`/feedback/details/${updatedTrack._id}`)
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/feedback`)
    }
}

module.exports.uploadTrackForm = (req, res) => {
    res.render('feedback/uploadTrack')
}

module.exports.uploadTrack = async (req, res) => {
    try{
        const { trackName, description } = req.body
        const track = new Track({ filename: req.file.filename, name: trackName, description: description, forFeedback: true, url: req.file.path, author: req.user })
        await track.save()
        req.flash('success', 'Track uploaded successfully')
        res.redirect('/feedback')
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/feedback`)
    }
}

module.exports.editForm = async (req, res) => {
    try{
        const track = await Track.findById(req.params.id).populate('feedback')
        if (!track) {
            req.flash('error', 'Cannot find this track')
            return res.redirect(`/feedback`)
        }
        res.render('feedback/edit', { track })
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/feedback`)
    }
}

module.exports.edit = async (req, res) => {
    try{
        const { review } = req.body
        const { id } = req.params;
        const track = await Track.findById(id).populate('feedback')
        const feedback = await Feedback.findById(track.feedback.id)
        feedback.review = review;
        await feedback.save()
        await Track.findByIdAndUpdate(id, {feedback: feedback})
        req.flash('success', 'Feedback added successfully')
        return res.redirect(`/feedback/details/${updatedTrack._id}`)
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/feedback`)
    }
}

module.exports.feedbackDetails =  async (req, res) => {
    try{
        const track = await Track.findById(req.params.id).populate('feedback')
        if (!track) {
            req.flash('error', 'Cannot find this track')
            return res.redirect(`/feedback`)
        }
        res.render('feedback/details', { track })
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/feedback`)
    }
}