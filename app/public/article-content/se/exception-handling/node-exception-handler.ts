const ServerErrorException = require('../exception/server-error.exception');
const ValidationException = require('../exception/validation-failure.exception');
const EntityNotFoundException = require('../exception/entity-not-found.exception');
const reportError = require('../utils/error-repoprting.utils');
/**
 * Middleware dedicated to centralizing logic related to exception handling
 * related operations.
 * 
 * @param {*} error 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const errorHandlerMiddleware = (ex, req, res, next)=>{
    console.log(`middleware: exception caught`);
    console.warn(ex);
    if(ex){
        
        // Call hook to broadcast out error event to any configured 
        // third party exception handling services.
     reportError(ex);

        if(ex instanceof ValidationException){
            console.log(`mw: validation error caught`);
            res.status(400);
            res.set('messsage','validation-failed');
            res.send({
                'validation-message': ex.message
            });
            next();
        }
        else if(ex instanceof ServerErrorException){
            res.status(500);
            res.set('messsage','Internal server exception');
            res.send({});
        }
        else if(ex instanceof EntityNotFoundException){
            res.status(500);
            res.set('messsage','Entity not found exception');
            res.send({'message':ex.message});
        }
        else{
            res.status(500);
            res.set('messsage','Unhandled exception');
            res.send({});
        }
        
        return;
    }
    console.log(`all good!`);
    next();
};

module.exports = errorHandlerMiddleware;