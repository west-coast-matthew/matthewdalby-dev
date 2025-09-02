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
