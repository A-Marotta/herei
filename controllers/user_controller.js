const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const passport = require("passport");
const nodemailer = require("nodemailer");
const initializePassport = require("../passportConfig");
initializePassport(passport);
const pool = require('../models/db')

router.get('/users/register', (req, res) => {
    res.render('register.ejs')
});

router.get('/users/login', (req, res) => {
    res.render('login.ejs')
});

router.get('/users/playground', (req, res) => {
    console.log(req.user); // User session information
    res.render('playground.ejs', { user: req.user.name })
});

router.get('/users/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out')
    res.redirect('/users/login')
});

router.post(
    "/users/login",
    passport.authenticate("local", {
        successRedirect: "/users/playground",
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

router.get('/users/verify', async(req, res) => {
    const email = req.query.user_email;
    if (!email) {
        return res.status(400).send("invalid user email");
    }
    return pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], async(err, result) => {
            if (err || result.rows.length !== 1) {
                res.status(500).send("unable to validate user email");
            }
            console.log(result.rows[0]);
            req.flash("success_msg", "You are now verified.");
            res.redirect("/users/login");
        });

});

const sendEmail = async (email, subject, html) => {
    try {
        console.log(process.env.SERVICE);
        console.log(process.env.USER);
        console.log(process.env.PASS);

        const transporter = nodemailer.createTransport({
            host: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: `"HereI" <process.env.EMAIL_USER>`,
            to: email,
            subject: subject,
            html: html,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

router.post('/email', async(req, res)=> {
    try {
        await sendEmail("gigi.cai0310@gmail.com", "Verify Email", "Congratulations. Your email address is verified.");
        return res.status(200).send("done");
    } catch(error) {
        return res.status(404).send(error.toString());
    }
});

module.exports = router