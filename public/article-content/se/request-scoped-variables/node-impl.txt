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