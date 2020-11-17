import { combineReducers } from 'redux';

import { form } from './form';
import { pagination } from './pagination';

export const rootReducer = combineReducers({ form, pagination });
