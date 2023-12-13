const Blog = require('../models/blog')
const User = require('../models/user')
const { cloudinary } = require('../cloudinary')


module.exports.index = async (req, res) => {
    const blogs = await Blog.find({}).populate('author')
    res.render('blog', { blogs })
}

module.exports.newForm = async (req, res) => {
    if (req.user.role == 'Producer') {
        return res.render('blog/new')
    }
    res.redirect('/blog')
}

module.exports.new =  async (req, res) => {
    try {
        const { topic, article } = req.body
        const url = req.file.path
        const filename = req.file.filename
        const user = await User.findById(req.user.id)
        const blog = new Blog({ topic: topic, imageUrl: url, filename:filename, article: article, author: user })
        await blog.save()
        req.flash('success', 'Blog successfully created')
        res.redirect('/blog')
    }
    catch (e) {
        req.flash('error', e.message)
        return res.redirect(`/blog`)
    }
}

module.exports.edit = async (req, res) => {
    try{
        const { topic, article } = req.body
        const blog = await Blog.findByIdAndUpdate(req.params.id, {topic: topic, article:article})
        return res.redirect(`/blog`)
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/blog`)
    }
}

module.exports.editForm = async (req, res) => {
    try{
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            req.flash('error', 'Cannot find this blog')
            return res.redirect(`/blog`)
        }
        res.render('blog/edit', { blog })
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/blog`)
    }
}

module.exports.blogDetails = async (req, res) => {
    try{
        const blog = await Blog.findById(req.params.id).populate('author')
        if (!blog) {
            req.flash('error', 'Cannot find this blog')
            return res.redirect(`/blog`)
        }
        res.render('blog/details', { blog })
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/blog`)
    }
}

module.exports.delete = async (req, res) => {
    try{
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            req.flash('error', 'Cannot find this blog')
            return res.redirect(`/blog`)
        }
        await cloudinary.uploader.destroy(blog.filename)
        await Blog.findByIdAndRemove(id)
        req.flash('success', 'Blog deleted successfully')
        res.redirect('/blog')
    }catch(e){
        req.flash('error', 'Something went wrong')
        return res.redirect(`/blog`)
    }
}