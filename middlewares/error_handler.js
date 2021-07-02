
function logError (err) {
    console.error(err)
}

function logErrorMiddleware (err, req, res, next) {
    logError(err)
    next(err)
}

function returnError (err, req, res, next) {
    res.status(err.statusCode || 500).send(err.message)
}

function isOperationalError(error) {
    if (error instanceof BaseError) {
    return error.isOperational
    }
    return false
}

// function errorHandler(err, req, res, next) { //***dt-taught error handler kept incase of issues with below*/

//     let status = err.status || 500
//     let message = err.message || 'Something went wrong'

//     res.status(status).json({ message })

//     next(err)
// }

module.exports = {
    logError,
    logErrorMiddleware,
    returnError,
    isOperationalError
    // errorHandler, //***dt-taught error handler kept incase of issues with below*/
}