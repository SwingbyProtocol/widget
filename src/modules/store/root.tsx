import { combineReducers } from 'redux';

import { swapForm } from './swapForm';
import { swaps } from './swaps';

export const rootReducer = combineReducers({ swapForm, swaps });
