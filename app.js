const express = require('express')
const ejsmate = require('ejs-mate')
const path = require('path')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const passport = require('passport')
const localStrategy = require('passport-local')
const flash = require('connect-flash')

const User = require('../MusicPage/models/user')

const app = express();


app.engine('ejs', ejsmate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '/public')))

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
app.use(flash())
app.use((req,res, next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


const blogRouter = require('./routes/blog')
const feedbackRouter = require('./routes/feedback')
const profileRouter = require('./routes/profile')
const samplesRouter = require('./routes/samples')
const roleRouter = require('./routes/role')
const userRouter = require('./routes/user')


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

app.use('/blog', blogRouter)
app.use('/feedback', feedbackRouter)
app.use('/profile', profileRouter)
app.use('/', roleRouter)
app.use('/samples', samplesRouter)
app.use('/', userRouter)

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

app.get('/test', (req, res) => {
    res.render('home')
})

app.get('/', (req, res) => {
    res.render('homee')
})

app.get('*', (req, res) => {
    res.render('pageNotFound')
})




