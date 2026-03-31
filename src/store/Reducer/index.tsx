// src/store/reducers/index.ts
import { combineReducers } from 'redux';

import Reducer from './Reducer';

const rootReducer = combineReducers({
  Reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
