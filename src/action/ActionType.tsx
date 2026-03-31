export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const CUSTOMER_LIST = 'CUSTOMER_LIST';
export const CUSTOMER_TOTAL = 'CUSTOMER_TOTAL';
export const SIGNATURE_LIST = 'SIGNATURE_LIST';
export const BANK_LIST = 'BANK_LIST';
export const TAX_LIST = 'TAX_LIST';
export const PRODUCT_LIST = 'PRODUCT_LIST';
export const VENDOR_LIST = 'VENDOR_LIST';
export const UNITS_LIST = 'UNITS_LIST';
export const CATEGORY_LIST = 'CATEGORY_LIST';
export const SPINNER_FLAG = 'SPINNER_FLAG';

type LoginSuccessAction = {
    type: typeof LOGIN_SUCCESS;
    payload: string;
};
type CustomerIdAction = {
    type: typeof CUSTOMER_LIST;
    payload: string;
};

type SignatureIdAction = {
    type: typeof SIGNATURE_LIST;
    payload: string;
};

type BankIdAction = {
    type: typeof BANK_LIST;
    payload: string;
};

type TaxIdAction = {
    type: typeof TAX_LIST;  
    payload: string;
};