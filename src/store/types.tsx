// src/store/types.ts
export interface ExampleState {
    data: string[];
  }
  
  export const SET_DATA = 'SET_DATA';
  
  interface SetDataAction {
    type: typeof SET_DATA;
    payload: string[];
  }
  
  export type ExampleActionTypes = SetDataAction;
  