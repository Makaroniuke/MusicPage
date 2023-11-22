const express = require('express')
const ejsmate = require('ejs-mate')
const path = require('path')
const session = require('express-session')

const User = require('../MusicPage/models/user')
const Blog = require('../MusicPage/models/blog')
const Sample = require('../MusicPage/models/sample')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../MusicPage/cloudinary')
const audioUpload = multer({ storage: audioStorage })
const imageUpload = multer({ storage: imageStorage })

const mongoose = require('mongoose');

const app = express();

app.engine('ejs', ejsmate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



mongoose.connect('mongodb://localhost:27017/music-page', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

// const sessionConfig = {
//     secret: 'thisshouldbeabettersecret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }
// app.use(session(sessionConfig))


app.listen(3000, () => {
    console.log('Serving on port 3000')
})


app.get('/', (req, res) => {
    res.render('homee')
})

app.get('/blog', async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blog', { blogs })
})

app.get('/blog/new', async (req, res) => {
    res.render('blog/new')
})


app.post('/blog/new', imageUpload.single('image'), (req, res) => {
    try {
        // await Blog.deleteMany({});
        const { article } = req.body
        console.log(req.body, req.file)
        // const blog = new Blog({ article })
        // await blog.save()
        // res.redirect('/')
        res.send(req.file)
    } catch (e) {
        console.log(e)
    }
})



app.get('/samples', async (req, res) => {
    const samples = await Sample.find({})
    res.render('samples', { samples })
    // res.send(samples)
})

app.get('/samples/new', (req, res) => {
    res.render('samples/new')
})

app.post('/samples/new', audioUpload.single('sample'), async (req, res) => {
    const { sampleName } = req.body
    const url = req.file.path
    const filename = req.file.filename
    const sample = new Sample({ name: sampleName, filename: filename, sampleUrl: url })
    await sample.save()
    // console.log(req.body, req.file)
    res.redirect('/samples')
})



app.get('/feedback', (req, res) => {
    res.render('feedback')
})
app.get('/feedback/new', (req, res) => {
    res.render('feedback/new')
})

app.post('/feedback/new', (req, res) => {
    res.send(req.body)
})

app.get('/addForFeedback', (req, res) => {
    res.render('addForFeedback')
})

app.post('/feedback', (req, res) => {
    console.log(req.body)
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username, password })
        console.log(user)
        await user.save()
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {

})


app.get('/blog/:id/edit', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.redirect(`/blog`)
    }
    res.render('blog/edit', { blog })
})

app.post('/blog/:id/edit', async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { ...req.body.blog })
    await blog.save()

    res.redirect(`/blog/${blog._id}`)
})

app.get('/blog/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.redirect(`/blog`)
    }
    res.render('blog/details', { blog })
})
