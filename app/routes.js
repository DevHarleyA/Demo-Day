module.exports = function (app, passport, db, multer, ObjectId) {
    // normal routes ===============================================================
    // Home Pages
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    app.get('/about', function (req, res) {
        res.render('about.ejs')
    })

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        favoriteCollection.find({ user_id: req.user._id.toString() }).toArray()
            .then(results => {
                // let thisUser = results.filter(element => { 
                //     console.log(req.user._id, element.user_id, element.user_id === req.user._id, element.user_id === req.user._id.toString())
                //     return element.user_id === req.user._id.toString()
                // }) this is the backend filter, mongo filter above (in find params)
                // console.log(results)
                let awaiting = results.filter(element => element.completed === false)
                let done = results.filter(element => element.completed === true)
                res.render('profile.ejs', {
                    user: req.user,
                    activities: awaiting,
                    completed: done
                })
            })
    });

    // ACTIVITIES PAGES =======================

    const activityCollection = db.collection('activities')
    const favoriteCollection = db.collection('favorited')

    app.get('/outside', isLoggedIn, function (req, res) {
        activityCollection.find().toArray()
            .then(results => {
                let notVirtual = results.filter(element => element.virtual === false)
                let length = notVirtual.length
                let random = Math.floor(Math.random() * length)
                result = notVirtual[random]
                console.log(result)
                res.render('outside.ejs', {
                    user: req.user,
                    activities: notVirtual,
                    outdoorRandom: result._id
                })
            })
    })

    app.get('/post/:zebra', isLoggedIn, function (req, res) {
        let postId = ObjectId(req.params.zebra)
        console.log(postId)
        activityCollection.find({ _id: postId }).toArray((err, result) => {
            if (err) return console.log(err)
            res.render('post.ejs', {
                user: req.user,
                posts: result
            })
        })
    });

    app.get('/virtual', isLoggedIn, function (req, res) {
        activityCollection.find().toArray()
            .then(results => {
                let virtual = results.filter(element => element.virtual === true)
                let length = virtual.length
                let random = Math.floor(Math.random() * length)
                result = virtual[random]
                res.render('virtual.ejs', {
                    user: req.user,
                    activities: virtual,
                    virtualRandom: result._id
                })
            })
    })

    app.get('/postTwo/:zebra', isLoggedIn, function (req, res) {
        let postId = ObjectId(req.params.zebra)
        console.log(postId)
        activityCollection.find({ _id: postId }).toArray((err, result) => {
            if (err) return console.log(err)
            res.render('postTwo.ejs', {
                user: req.user,
                posts: result
            })
        })
    });


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // CRUD routes ===============================================================

    app.post('/addAdventure', (req, res) => {
        console.log(req.body)
        favoriteCollection.save({
            activity_id: req.body.activity_id,
            activity_name: req.body.activity_name.toLowerCase(),
            img: req.body.img,
            short_desc: req.body.short_desc,
            user_id: req.body.user_id,
            completed: false,
            feedback: '',
        }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/profile')
        })
    })

    app.put('/adventureComplete', (req, res) => {
        favoriteCollection.findOneAndUpdate({ activity_name: req.body.activity.toLowerCase() }, {
            $set: {
                completed: true,
                feedback: req.body.feedback
            }
        }, {
            sort: { _id: -1 },
            upsert: false
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        })
    })

    app.delete('/remove', (req, res) => {
        favoriteCollection.findOneAndDelete({
            activity_name: req.body.activity.toLowerCase()
        }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Activity deleted!')
        })
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) => dont touch, it works==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
