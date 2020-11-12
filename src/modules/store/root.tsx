import { combineReducers } from 'redux';

import { formAmounts } from './formAmounts';
import { formAddress } from './formAddress';

export const rootReducer = combineReducers({ formAmounts, formAddress });
