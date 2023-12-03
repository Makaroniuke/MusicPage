const Sample = require('../models/sample')
const User = require('../models/user')
const { cloudinary } = require('../cloudinary')



module.exports.index = async (req, res) => {
    const samples = await Sample.find({}).populate('author')
    res.render('samples', { samples })
}

module.exports.newForm = (req, res) => {
    res.render('samples/new')
}

module.exports.new =  async (req, res) => {
    const { sampleName, type, key } = req.body
    const url = req.file.path
    const filename = req.file.filename
    const user = await User.findById(req.user.id)
    const sample = new Sample({ name: sampleName, filename: filename, sampleUrl: url, type: type, key: key, author: user })
    await sample.save()
    res.redirect('/samples')
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const sample = await Sample.findById(id);
    await cloudinary.uploader.destroy(sample.filename)
    await Sample.findByIdAndRemove(id);
    res.redirect('/samples')
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const sample = await Sample.findById(id);
    res.render('samples/edit', {sample})
}

module.exports.edit = async (req, res) => {
    const{sampleName, type, key} = req.body
    const { id } = req.params;
    await Sample.findByIdAndUpdate(id, {name:sampleName, type:type, key:key});
    res.redirect('/samples')
}