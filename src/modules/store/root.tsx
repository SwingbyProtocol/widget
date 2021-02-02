import { combineReducers } from 'redux';

import { swapForm } from './swapForm';
import { swaps } from './swaps';
import { sdkContext } from './sdkContext';

export const rootReducer = combineReducers({ swapForm, swaps, sdkContext });
