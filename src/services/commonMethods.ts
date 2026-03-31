//import liraries
import { useDispatch } from 'react-redux';
import * as TYPES from '../action/ActionType';
import store from '../store';


// create a component
export const ConsoleLog = (message: unknown, err = false) => {
  console.log(message);
};

export const doChangeSpinnerFlag = async (flag: boolean) => {
  store.dispatch({ type: TYPES.SPINNER_FLAG, payload: flag });
};
