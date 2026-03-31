import * as TYPES from '../../action/ActionType';

interface State {
  customer: any;
  signature: any;
  bank: any;
  tax: any;
  product: any;
  isLoggedIn?: boolean;
  vendor: any;
  units: any;
  category: any;
  totalCustomer: any;
  spinnerFlag: boolean;
}

const initial: State = {
  customer: null,
  signature: null,
  bank: null,
  tax: null,
  product: null,
  isLoggedIn: false,
  vendor: null,
  units: null,
  category: null,
  totalCustomer: null,
  spinnerFlag: false,
};

const Reducer = (
  state: State = initial,
  action: { type: string; payload?: string | any },
): State => {
  switch (action.type) {
    case TYPES.CUSTOMER_LIST:
      return {
        ...state,
        customer: action.payload,
        isLoggedIn: true,
      };
    case TYPES.SPINNER_FLAG:
      return {
        ...state,
        spinnerFlag: action.payload,
        isLoggedIn: true,
      };
    case TYPES.CUSTOMER_TOTAL:
      return {
        ...state,
        totalCustomer: action.payload,
        isLoggedIn: true,
      };
    case TYPES.SIGNATURE_LIST:
      return {
        ...state,
        signature: action.payload,
        isLoggedIn: true,
      };
    case TYPES.BANK_LIST:
      return {
        ...state,
        bank: action.payload,
        isLoggedIn: true,
      };
    case TYPES.TAX_LIST:
      return {
        ...state,
        tax: action.payload,
        isLoggedIn: true,
      };
    case TYPES.PRODUCT_LIST:
      return {
        ...state,
        product: action.payload,
        isLoggedIn: true,
      };
    case TYPES.VENDOR_LIST:
      return {
        ...state,
        vendor: action.payload,
        isLoggedIn: true,
      };
    case TYPES.UNITS_LIST:
      return {
        ...state,
        units: action.payload,
        isLoggedIn: true,
      };
    case TYPES.CATEGORY_LIST:
      return {
        ...state,
        category: action.payload,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};

export default Reducer;
