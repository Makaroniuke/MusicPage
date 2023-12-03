const Blog = require('../models/blog')
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
        res.redirect('/blog')
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.edit = async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.redirect(`/blog`)
    }
    res.render('blog/edit', { blog })
}

module.exports.editForm = async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.redirect(`/blog`)
    }
    res.render('blog/edit', { blog })
}

module.exports.blogDetails = async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('author')
    if (!blog) {
        return res.redirect(`/blog`)
    }
    res.render('blog/details', { blog })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    await cloudinary.uploader.destroy(blog.filename)
    await Blog.findByIdAndRemove(id)
    res.redirect('/blog')
}