---
title: "Request Scoped Variables"
date: "May 14, 2025"
excerpt: "How to scope variables at a request level"
readTime: "3 min read"
category: "Software Engineering"
---

## Introduction

        

          Here I am going to cover how to bind variables to a request scope. The
          use case for this is to allow us to pass variables through the request
          scope, so that we can access them in the controller and service layers
          of our application, without having to pass references around.
        

        

          Specifically, we will be generating a unique id within a REST
          controller, which will be used to represent the transaction. This
          approach would support the ability to correlate logging events across
          a request.{" "}
        

        

          While it is true that global level variables are generally frowned
          upon in the software industry, there are rare exceptions when they
          make sense, and this is one of them.
        

        

          In order to illustrate how this concept is universal, and not
          necessarily stack specific, examples in both Java/Spring and
          Node.js/express are provided.
        

        

          Two projects have created to illustrate the concepts covered here,
          which are available on my GitHub account.
        

        

          [
            https://github.com/west-coast-matthew/blog-context-variables-node
          ](https://github.com/west-coast-matthew/blog-context-variables-node)
        

        

          [
            https://github.com/west-coast-matthew/blog-context-variables-java
          ](https://github.com/west-coast-matthew/blog-context-variables-java)
        

        

## A Java Based Implementation

        

          In the following example we will be using a servlet filter to bind a
          variable to the request scope. This will allow us to access the
          variable in the controller and service layers of our application.
        

        

[code]
@Component
@WebFilter("/*")
public class TransactionFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
        String transactionId = TransactionUtils.getNewTransactionID();
        
        RequestContext.setCurrentTransactionId(transactionId);
        
        chain.doFilter(request, response);	
	}
	
}
[/code]

        *Binding variables through an servlet filter*

        

          Using the @WebFilter annotation, we establish an interceptor for any
          inbound requests, this is the direct equivelent of middleware applied
          in node based projects. The
          '&com.matthewdalby.example.context_variables.filter.TransactionFilter
          ' class creates the request scoped variable and binds it to the
          current request via the RequestContext class.
        

        

          Java works by handling each request via a higher level thread, and the
          setCurrentTransactionId method will result in the variable being bound
          to the current thread. In our case here, we are generating a unqie id
          representing the current transaction or request, and then making it
          available across the stack in order to support our ability to
          coordinate associate log entries with the overal operation.
        

        

## And a Node.js Implementation

        

          An here we have a node implementation, which is essentially performing
          the same operation. In this instance,
          ./src/iddleware/context.middleware.mjs file.
        

        

          Node of course operates a bit differently as all requests are handled
          by a single higher level thread, instead of a pool of threads each
          handling specific requests. AsyncLocalStorage from the
          'hooks' package is used to wire in the magic that allows us
          to bind our transaction ids to individual requests, despite the fact a
          common parent thread is concurrently handing all requests.
        

        

        

[code]
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';
import { TRANSACTION_ID } from "../constants/index.mjs";
import {generateTransactionId} from '../utils/transaction-generator.utils.mjs';
import als from '../local-storeage.mjs';

const asyncLocalStorage = new AsyncLocalStorage();

const contextMiddleware = (req, res, next) => {
  
  als.run({ TRANSACTION_ID: generateTransactionId() }, () => {
    next();
  });
  
};

export default contextMiddleware;
[/code]

        *And our implementation in node*

        

## Conclusion

        

          In conclusion, request scoped variables are a powerful tool that can
          help us to manage state across the request lifecycle. They allow us to
          bind variables to the request scope, which can then be accessed in the
          controller and service layers of our application. This can be useful
          for things like generating unique ids for transactions, or for
          coordinating logging events across a request.
