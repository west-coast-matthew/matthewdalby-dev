---
title: "REST: Exception Handling"
date: "January 19, 2025"
excerpt: "A standardized approach to exception handling in REST APIs."
readTime: "6 min read"
category: "API Design"
---

## Introduction

        

          Consistent exception handling is critical for effective API design.
          While there is truly no hard standard for reporting exceptions, I will
          share my experiences and opinions here.
        

        

          This article will focus on exception handling from within a REST
          focus, as I have a tendency to work a lot in this area.
        

        

          To illustrate how these concepts may be applied across different
          stacks, and are pretty much framework agnostic, I will provide
          examples in Java and Node.js stacks. Fully functional projects are
          available on GitHub under the following locations.
        

        

          * [
              https://github.com/west-coast-matthew/blog_rest_exception_handling_node
            ](https://github.com/west-coast-matthew/blog_rest_exception_handling_node){" "}

          * <li>
              [
                https://github.com/west-coast-matthew/blog_rest_exception_handling_java
              ](https://github.com/west-coast-matthew/blog_rest_exception_handling_java){" "}

          </li>
        

        

          I have been working with REST APIs for over a decade now, across
          various projects and organizations. To me the concepts what I am
          presenting here seem self-evident, however I am often surprised at the
          amount of what could be described as 'anti-patterns'. I hope
          this articles either confirms your current processes are correct, or
          perhaps allows you to indentify opportunities for improvement in your
          existing code base.
        

        

          There are a few important areas I will cover in this article as
          follows.
        

        

          * Apply an effective validation policy

          * Utilize custom exceptions

          * Provide consistency in response codes

        

        

## Apply an effective validation policy

        

          So whenever possible, I highly recommend using a well though out
          approach towards validation. If you can capture invalid data as early
          as possible, you you can respond with a concise response.
        

        

          For example, when attempting to perform an update (HTTP PUT/PATCH)
          operation, a check to confirm that the targeted entity for the update
          operation actually exists, and if it does not exist, ideally we would
          return and 404 response code. The issue is the default result for
          attempting to update a non-existent entity will more than likely throw
          an exception that would probably result in an 500 response code.
        

        

          In the java world, the Java Bean Validation API provides an intuitive
          way to annotate objects with validation constraints. So in the
          following example illusts an annotated entity and via the @Valid
          annotation, the runtime framework is instructed to automatically apply
          attribute level validation.
        

        

[code]
// An object annotated with validation logic..
public class Product{
    private int id;

    @NotNull
	@Size(max=64)
    private String name;
}

// An controller entry point implementing auto validation...
@RESTController
public class ProductController{

    @PostMapping
    public ResponseEntity<ProductVo> saveProduct(@Valid @RequestBody Product product){

    ...

    }
}
[/code]

        

          This is a standard approach for that particular tech stack, however
          for NodeJS there is less of a standard, so many other options exist.
        

        

          My main point here is validate at a detailed level, and as early as
          possible.
        

        

## Utilize custom exceptions

        

          I am a big advocate of utilizing custom exceptions. This allows you to
          create a hierarchy of exceptions that are specific to your domain and
          application. This is important as it allows you to handle exceptions
          in a more granular way, and provide more meaningful error messages to
          the client.
        

        **A custom handler in Node.js**
        

[code]
export abstract class BaseApplicationException extends Error{

    /** Custom application level codes, intended for monitoring functions. */
    appCode:string; 
    /** HTTP status code that will ultimately be returned in the ressponse payload. */
    httpStatusCode:number;
    /** Whereas the message provides a more customizable reason for the error, this code is 
     * standardized for all instances of this error. */
    defaultMessage:string;

    /**
     * 
     */
    constructor( message: string, appCode:AppErrorCodes, httpStatusCode:number, 
      defaultMessage:string) {
    super(message);
    this.appCode = appCode;
    this.httpStatusCode = httpStatusCode;
    this.defaultMessage = defaultMessage;
  }
}

/**
 * Exception intended for cases where a request to create or update an entity fails due to business 
 * validation logic.
 */
export class EntityValidationException extends BaseApplicationException{
    
    constructor(message:string){
        super(message,AppErrorCodes.ENTITY_VALIDATION_ERR, HTTP_STATUS_CODE_BAD_REQUEST, 
            "Entity validation failure");
    }
}
[/code]

        **And an example in Java**
        

[code]
package com.wc_matthew.demo.exception_handling.exception;

import org.springframework.http.HttpStatusCode;

/**
 * BaseException
 * 
 * Parent class for all custom application exceptions. 
 * 
 */
public abstract class BaseException extends RuntimeException{
	
	public BaseException() {
        super();
    }

	public String customMessage;
	public String errCode;
	public HttpStatusCode httpStatusCode;
	
	/**
	 * All instances of custom exceptions used additional attributes in 
	 * conjunction with just a standard message. 
	 * 
	 * @param message Standard message for all instances of a given type.
	 * @param customMessage, provides additional contextual information, such as the 
	 * reason for why attribute or business logic fails.... 
	 * @param errCode Custom error code used to uniquely identify the exception 
	 * type, intended for use by external monitoring applications.
	 */
    public BaseException(String message, String customMessage, String errCode) {
        super(message);
        this.customMessage = customMessage;
        this.errCode = errCode;
    }
	
}

public class EntityValidationFailureException extends BaseException{
	
	public EntityValidationFailureException(String detailMsg) {
		super("Entity validation failure", detailMsg, ErrorConstants.ENTITY_VALIDATION_ERR);
	}
}
[/code]

        

          In both examples, we have create a base class, for which purpose
          specific implementations are created. Basically we wrap an additional
          message element, and an exception code that makes it easy to classify
          the exception from an auditing perspective. Given a centralized
          exception approach, which we will cover later in this article, this
          helps to maintain a consistent exception handling strategy.
        

        

## Provide consistency in response codes

        

          An important consideration if to provide the correct code for error
          type conditions. I have seen on mulitple occasions something like the
          following.
        

        

[code]
fetch ('http://myapi.com')
.then((rawData)=>rawData.json())
.then((jsonData)=>{
	
	// Manually check the message to determine if the operation actually suceeded
	if(jsonData.status=="error"){

		...
	}

	// Other valiations
	if(jsonData.success=="true"){
	if(jsonData.status=="succeeded"){

});
[/code]

        

          So the above example is a Javascript snippet that is prepared to
          handle exceptions that are masked by HTTP 200 response codes. The
          issue here is that the Fetch API is natively prepared to handle 500
          response codes. Adding in cheks for a status message in the body to
          determine if the operation truly succeeded requires unecessary effort.
          Additionally, a 500 response code, using an alternate approach leaves
          more options. Above we see each developer may return their own
          preferred status indicators. That example is something based on real
          world past experience. One particular project used this approach, and
          the request handlers would use additional criteria in the if
          condition, which was a mess. Typically when you observe this type of
          syntax, it is a sign of larger architectual issues.
        

        

          In short, use 400 and 500 codes strictly. Stay out of the business of
          overriding logic that simple &amp;works&amp;
        

        

### Implementing creational codes

        

          For requests that create or update data, use the appropriate more
          granular HTTP status code. 201 (Created) and 204 (No content) may be
          used to further clarify the operation was successful.
        

        

### Proper use of 404 exceptions

        

          The use of 404 exceptions is a bit tricky as this could indicate if a
          resquested API endpoint does not physically exist, or if indeed it
          did, but the requested record did not. I frequently make use of a
          header containing an additional message that allows us to
          differentiate between the two cases. An additional entry in the
          response payload is another viable option, however the important thing
          is you provide the ability for the client to understand the true
          nature of the issue, ,and possibly any auditing middleware that might
          be responsible for exposing broken links.
        

        

### Bringing visibility into actual exceptions

        

          Finally, information regaring the nature of the error condition may be
          of use. You may not want to necessarily return the entire stack trace
          or details of if a database or dependency API is not available,
          however at a minimum returning a application specific code that might
          indicate which system dependency was not available may help to
          streamine the exception troublshooing process.
        

        

          For example, if a support resource recieves a request from a user
          indicating they are experiencing an ' SE-10017 &pos;, the support
          runbook could direct the request initially to a resource responsible
          for the database system that is off line, rather than initially
          fielding it to the developer on call.
        

        

### Centralizing exception handling

        

          Governence of a consistent process for handling exceptions in your API
          is most easily accomplished when exception handling logic is
          centralized. So, let's look at the following examples of throwing
          exceptions at the logic level.
        

        

[code]
// A javascript example
function doSomething {
    ...
    throw new ValidationException("For some reason.....");
}

// And a java implementation
public void doSomething(){
    ...

    throw new ValidationException("For some reason......");

}
[/code]

        

          Clean, consistent, easy to throw runtime exceptions. Note that
          developer is abstracted from the details of the exception handling
          strategy, and the resulting response output. Establishing an
          centralized location for catching and handling exceptions acorss the
          application can be accomplished in Java via Servlet Filters, and
          within a Node.js stack via express Middleware. Examples are as
          follows.
        

        **Java based centralized exception handling**
        

[code]
package com.wc_matthew.demo.erp.core.middleware;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.wc_matthew.demo.erp.core.exception.BaseException;
import com.wc_matthew.demo.erp.core.exception.InvalidRequestException;
import com.wc_matthew.demo.erp.core.service.ExceptionHandlerService;

/**
 * GlobalExceptionHandler 
 * 
 * Responsible for centralizing exception handling logic for exceptions (
 * both custom thrown and un-handled).
 * 
 * The goal is to standardize exception handling, where details are returned in an 
 * consistent manner across the application via HTTP headers.
 * 
 */

@ControllerAdvice
public class GlobalExceptionHandler {
	
	public static final String HEADER_ERROR_CODE = "app-err-code";
	public static final String HEADER_DEFAULT_MESSAGE = "default-message";
	public static final String HEADER_MESSAGE = "message";
	
	@Autowired 
	ExceptionHandlerService exceptionService;
	
	@ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<String> handleCustomException(InvalidRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
	
	/**
	 * TODO: investigate RFC 9457 compliance (https://www.rfc-editor.org/rfc/rfc9457.html)
	 * 
	 * @param ex
	 * @return
	 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(BaseException ex) {
    	
    	// Broadcast exception to the generic handler, which in turn may perform
    	// operations such as reporting to a third party API for enhanced 
    	// error handling.
    	exceptionService.logException(ex);	
    	
    	HttpHeaders responseHeaders = new HttpHeaders();
    	
    		BaseException customEx = (BaseException)ex;
    		
            responseHeaders.set(HEADER_ERROR_CODE, customEx.getErrCode());
            responseHeaders.set(HEADER_DEFAULT_MESSAGE, customEx.getMessage());
            responseHeaders.set(HEADER_MESSAGE, customEx.getCustomMessage());
        
            ResponseEntity<String> response = new ResponseEntity<String>(customEx.getMessage(), customEx.getHttpStatusCode());
            return response;		         
       }
    
}
[/code]

        **Node based centralized exception handling**
        

[code]
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
[/code]

        

          So the above two example accomplish the same result, watch for certain
          exception types, catch them, and then return a consistent result.
          Since we making use of custom exceptions here, this streamlines the
          process of including custom codes in headers. From a developers
          perspective, the syntax is very similar to standard exceptions, so
          there is very little overhead associated with using them, which helps
          to increase adoption.
        

        

## In Summary

        

          So, consistency, consistency, consistency. Centralize logic, make use
          of custom exceptions, return consistent messaged, using established
          use cases.
        

        

          Again, two functioning projects are available at the following
          locations on GitHub that illustrate these concepts in both Node.js and
          Java stacks.
        

        

          * [
              https://github.com/west-coast-matthew/blog_rest_exception_handling_node
            ](https://github.com/west-coast-matthew/blog_rest_exception_handling_node){" "}

          * <li>
              [
                https://github.com/west-coast-matthew/blog_rest_exception_handling_java
              ](https://github.com/west-coast-matthew/blog_rest_exception_handling_java){" "}

          </li>
