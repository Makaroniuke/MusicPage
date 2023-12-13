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
    try{
        const { sampleName, type, key } = req.body
        const url = req.file.path
        const filename = req.file.filename
        const user = await User.findById(req.user.id)
        const sample = new Sample({ name: sampleName, filename: filename, sampleUrl: url, type: type, key: key, author: user })
        await sample.save()
        req.flash('success', 'Sample added successfully')
        res.redirect('/samples')
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/samples`)
    }
}

module.exports.delete = async (req, res) => {
    try{
        const { id } = req.params;
        const sample = await Sample.findById(id);
        if (!sample) {
            req.flash('error', 'Cannot find this blog')
            return res.redirect(`/samples`)
        }
        await cloudinary.uploader.destroy(sample.filename, {"resource_type": "video"})
        await Sample.findByIdAndRemove(id);
        req.flash('success', 'Sample deleted successfully')
        res.redirect('/samples')
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/samples`)
    }
}

module.exports.editForm = async (req, res) => {
    try{
        const { id } = req.params;
        const sample = await Sample.findById(id);
        if (!sample) {
            req.flash('error', 'Cannot find this sample')
            return res.redirect(`/samples`)
        }
        res.render('samples/edit', {sample})
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/samples`)
    }
}

module.exports.edit = async (req, res) => {
    try{
        const{sampleName, type, key} = req.body
        const { id } = req.params;
        await Sample.findByIdAndUpdate(id, {name:sampleName, type:type, key:key});
        req.flash('success', 'Sample updated successfully')
        res.redirect('/samples')
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/samples`)
    }
}