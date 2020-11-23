import { combineReducers } from 'redux';

import { swap } from './swap';
import { pagination } from './pagination';

export const rootReducer = combineReducers({ swap, pagination });
