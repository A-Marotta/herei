const pool = require('../models/db')

function validateEmail(email){
    pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
            if (err) {
                return err
            }
            console.log(results.rows); // return a list containing the objects of the use in database
            if (results.rows.length > 0) {
                return {message: "Email already register"};
            }
        })
}

function validateFormContents(body) {
    let { name, email, password, password2 } = body;
    console.log({
        name,
        email,
        password,
        password2
    })
    let errors = [];
    //check all forms are entered
    if (!name || !email || !password || !password2) {
        errors.push({message: "Please enter all fields"});
        // return errors
    }
    //check password length
    if (password.length < 6) {
        errors.push({message: "Password must be a least 6 characters long"});
        // return errors
    }
    //check password is matched
    if (password !== password2) {
        errors.push({message: "Passwords do not match"});
        // return errors
    }
    const emailCheck = validateEmail(email)
    if (emailCheck) {
        errors.push(emailCheck)
        // return errors
    }
    return errors
}



module.exports = validateFormContents