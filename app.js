const express = require('express')
const ejsmate = require('ejs-mate')
const path = require('path')
const session = require('express-session')
const multer = require('multer')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const passport = require('passport')
const localStrategy = require('passport-local')


const User = require('../MusicPage/models/user')
const Blog = require('../MusicPage/models/blog')
const Sample = require('../MusicPage/models/sample')
const Track = require('../MusicPage/models/track')
const Feedback = require('../MusicPage/models/feedback')
const { isLoggedIn } = require('../MusicPage/middleware')


const { audioStorage, imageStorage } = require('../MusicPage/cloudinary')
const audioUpload = multer({ storage: audioStorage })
const imageUpload = multer({ storage: imageStorage })


const app = express();

app.engine('ejs', ejsmate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))



const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


mongoose.connect('mongodb://localhost:27017/music-page', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})





app.listen(3001, () => {
    console.log('Serving on port 3001')
})


app.get('/', (req, res) => {
    res.render('homee')
})

app.get('/blog', async (req, res) => {
    const blogs = await Blog.find({}).populate('author')
    res.render('blog', { blogs })
})

app.get('/blog/new', isLoggedIn, async (req, res) => {
    if (req.user.role == 'Producer') {
        return res.render('blog/new')
    }
    res.redirect('/blog')
})


app.post('/blog/new', isLoggedIn, imageUpload.single('image'), async (req, res) => {
    try {
        const { topic, article } = req.body
        const url = req.file.path
        const user = await User.findById(req.user.id)
        const blog = new Blog({ topic: topic, imageUrl: url, article: article, author: user })
        await blog.save()
        res.redirect('/blog')
    }
    catch (e) {
        console.log(e)
    }
})



app.get('/samples', async (req, res) => {
    const samples = await Sample.find({}).populate('author')
    res.render('samples', { samples })
})

app.get('/samples/new', isLoggedIn, (req, res) => {
    res.render('samples/new')
})

app.post('/samples/new', isLoggedIn, audioUpload.single('sample'), async (req, res) => {
    const { sampleName, type, key } = req.body
    const url = req.file.path
    const filename = req.file.filename
    const user = await User.findById(req.user.id)
    const sample = new Sample({ name: sampleName, filename: filename, sampleUrl: url, type: type, key: key, author: user })
    await sample.save()
    res.redirect('/samples')
})


app.get('/feedback', async (req, res) => {
    const tracks = await Track.find({})
    res.render('feedback', { tracks })
})
app.get('/feedback/new', isLoggedIn, (req, res) => {
    if (req.user.role == 'Producer')
        res.render('feedback/new')
    res.redirect('/feedback')
})



app.get('/feedback/uploadTrack', isLoggedIn, (req, res) => {
    res.render('feedback/uploadTrack')
})

app.post('/feedback/uploadTrack', isLoggedIn, audioUpload.single('track'), async (req, res) => {
    const { trackName, description } = req.body
    const track = new Track({ filename: req.file.filename, name: trackName, description: description, forFeedback: true, url: req.file.path })
    await track.save()
    res.redirect('/feedback')
})

app.post('/feedback', (req, res) => {
    console.log(req.body)
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        await registeredUser.save()
        res.redirect('/')
        // req.login(registeredUser, err => {
        //     if (err) return next(err)
        //     req.flash('success', 'Welcome to Yelp camp')
        //     res.redirect('/campgrounds')
        // })
    } catch (e) {
        console.log(e.message)
    }
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/')
})

app.get('/profile', async (req, res) => {
    const tracks = await Track.find({ forFeedback: false })
    res.render('profile', { tracks })
})



app.get('/profile', isLoggedIn, async (req, res) => {
    const tracks = await Track.find({ forFeedback: false })
    // Combine the data from both collections
    const combinedData = [...data1, ...data2];

    // Sort the combined data by date
    combinedData.sort((a, b) => a.date - b.date);
    res.render('profile', { tracks })
})

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    })
    res.redirect('/')
})


app.get('/blog/:id/edit', isLoggedIn, async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        return res.redirect(`/blog`)
    }
    var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var checkedBlog = blog.article.replace('<script>', '')
    var checkedBlog = blog.article.replace('</script>', '')
    blog.article = checkedBlog
    res.send(checkedBlog)
    res.render('blog/edit', { blog })
})

app.put('/blog/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { ...req.body.blog })
    await blog.save()

    res.redirect(`/blog/${blog._id}`)
})

app.get('/blog/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('author')
    if (!blog) {
        return res.redirect(`/blog`)
    }
    res.render('blog/details', { blog })
})

app.get('/feedback/new/:id/edit', isLoggedIn, async (req, res) => {
    const feedback = await Feedback.findById(req.params.id).populate('track')
    if (!feedback) {
        return res.redirect(`/feedback`)
    }
    res.render('feedback/edit', { feedback })
})

app.post('/feedback/new/:id/edit', isLoggedIn, async (req, res) => {
    const feedback = await Feedback.findById(req.params.id).populate('track')
    if (!feedback) {
        return res.redirect(`/feedback`)
    }
    res.render('feedback/edit', { feedback })
})

app.get('/feedback/new/:id', isLoggedIn, async (req, res) => {
    const track = await Track.findById(req.params.id)
    if (!track) {
        return res.redirect(`/feedback`)
    }
    res.render('feedback/new', { track })
})

app.post('/feedback/new/:id', isLoggedIn, async (req, res) => {


    const { review } = req.body
    const { id } = req.params;
    // const checkedReview = review.replace(scriptRegex, "");
    res.send(review)

    const track = await Track.findById(id)
    const feedback = new Feedback({ _id: track._id, review: review, track: track })
    // res.send(feedback)
    await feedback.save()
    return res.redirect(`/feedback/details/${feedback._id}`)
})

app.get('/feedback/details/:id', async (req, res) => {
    const feedback = await Feedback.findById(req.params.id).populate('track')
    res.render('feedback/details', { feedback })
    // if (!track) {
    //     return res.redirect(`/feedback`)
    // }
    // res.render('feedback/new', { track })
})

app.get('/profile/addTrack', isLoggedIn, (req, res) => {
    res.render('profile/addTrack')
})

app.post('/profile/addTrack', isLoggedIn, audioUpload.single('track'), async (req, res) => {
    const { trackName, description } = req.body
    const track = new Track({ filename: req.file.filename, name: trackName, description: description, forFeedback: false, url: req.file.path })
    await track.save()
    res.redirect('/profile')
})

app.get('/profile/:id/editTrack', isLoggedIn, async (req, res) => {
    const track = await Track.findById(req.params.id)
    if (!track) {
        return res.redirect(`/feedback`)
    }
    res.render('profile/editTrack', { track })
})

app.post('/profile/:id/editTrack', isLoggedIn, async (req, res) => {
    const { trackName, description } = req.body
    const track = await Track.findByIdAndUpdate(req.params.id, { description: description })
    await track.save()

    res.redirect('/profile')
})

app.delete('/profile/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Track.findByIdAndRemove(id);
    res.redirect('/profile')
})

app.delete('/samples/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Sample.findByIdAndRemove(id);
    res.redirect('/samples')
})

app.delete('/blog/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Blog.findByIdAndRemove(id);
    res.redirect('/blog')
})



