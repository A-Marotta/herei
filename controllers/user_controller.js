const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const passport = require("passport");
const sendEmail = require("../email_notification/send");
const initializePassport = require("../passportConfig");
initializePassport(passport);
const pool = require('../models/db')
// const validateFormContents = require("../middlewares/validate_registration.js")
const { logError, returnError } = require("../middlewares/error_handler.js")


router.get('/users/register', (req, res) => {
    res.render('register.ejs')
});

router.get('/users/login', (req, res) => {
    res.render('login.ejs')
});

router.get('/users/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Thanks for looking, see you next time!')
    res.redirect('/users/login')
});

router.post(
    "/users/login",
    passport.authenticate("local", {
        successRedirect: "/attractions",
        failureRedirect: "/users/login",
        failureFlash: true
    })
);

router.post('/users/register', async(req, res) => {
    let { name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    })
    let errors = [];
    //check all forms are entered
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    //check password length
    if (password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }
    //check password is matched
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    // if the error array has item inside, we will return to the login page and get an error 
    if (errors.length > 0) {
        res.render("register.ejs", { errors });
    } else {
        // form validation has passed
        //bycrpt
        let hashedPassword = await bcrypt.hash(password, 10); //10 is the convention default amount;
        console.log(hashedPassword);

        // query database to see the users is already exists or not
        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
                if (err) {
                    throw err
                }
                console.log(results.rows); // return a list containing the objects of the use in database
                if (results.rows.length > 0) {
                    errors.push({ message: "Email already register" });
                    res.render('register.ejs', { errors })

                } else { // we can register the user;

                    pool.query(
                        `INSERT INTO users (name, email, password_digest)
                            VALUES ($1, $2, $3)
                            RETURNING id, password_digest`, [name, email, hashedPassword],
                        async (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            try {
                                await sendEmail(`${email}`, "Verify Email", `Please click <a href="${process.env.BASE_URL}/users/verify?user_email=${email}">link</a> to confirm.`);
                                req.flash("success_msg", "You are now registered. Please verified your account by Email");
                                res.redirect("/users/login");
                            } catch(error) {
                                return res.status(404).send(error.toString());
                            }

                        }
                    )
                }
            }
        )

    }
});

router.get('/users/verify', async (req, res) => {
    const email = req.query.user_email;
    if (!email) {
        returnError({ statusCode: 400, message: "invalid user email" }, req, res)
        // return res.status(400).send("invalid user email");
    }
    return pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], async (err, result) => {
            try {
                if (err || result.rows.length !== 1) {
                    returnError({message: "unable to validate user email"}, req, res);
                }
                console.log(result.rows[0]);
                req.flash("success_msg", "You are now verified.");
                res.redirect("/users/login");
            } catch (error){
                logError(error)
                req.flash("Failed to verify your credentials. Please start again.")
                res.redirect("/")
            }
        });
});

// router.post('/users/register', async (req, res) => {
//     try {
//         const errors = validateFormContents(req.body)
//         if (errors) {
//             res.render("register.ejs", { errors });
//         } else {
//             let hashedPassword = await bcrypt.hash(password, 10); //10 is the convention default amount;
//             console.log(hashedPassword);

//             pool.query(
//                 `INSERT INTO users (name, email, password_digest)
//                 VALUES ($1, $2, $3)
//                 RETURNING id, password_digest`, [name, email, hashedPassword],
//                 async (err, results) => {
//                     if (err) {
//                         throw err;
//                     }
//                     console.log(results.rows);
//                     try {
//                         await sendEmail(`${email}`, "Verify Email", `Please click <a href="${process.env.BASE_URL}/users/verify?user_email=${email}">link</a> to confirm.`);
//                         req.flash("success_msg", "You are now registered. Please verify your email address by following the instructions in the message sent to your email.");
//                         res.redirect("/users/login");
//                     } catch (error) {
//                         returnError({statusCode: 404, message: error.toString()}, req, res);
//                     }
//                 })
//         }
//     } catch (error) {
//         logError(error, req, res)
//         req.flash("Oops something went wrong!")
//         res.redirect("/") //in lieu of building a 404 error page
//     }
// })



module.exports = router