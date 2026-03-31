import { Product } from "../screens/invoices/addInvoice";

export const CalculationTotal = (data: Product[]): number => {
    // Use reduce to accumulate the total
    console.log(data, "iscalculated");

    return data.reduce((total, product) => {
        let amount = ((Number(product?.sellingPrice) || Number(product?.rate)) * Number(product?.quantity)) - (Number(product?.discountValue) || Number(product?.discount));
        let taxItem = (amount * (Number(product?.tax?.taxRate) || Number(product?.tax?.taxRate))) / 100;
        let TotalAmount = amount + taxItem;
        console.log(`Total: ${taxItem}`);

        return total + TotalAmount;
    }, 0);
};

export const CalculateTaxTotal = (data: Product[]): number => {
    return data.reduce((total, product) => {
        const sellingPrice = Number(product?.sellingPrice) || Number(product?.rate) || 0;
        const quantity = Number(product?.quantity) || 0;
        const discountValue = Number(product?.discountValue) || Number(product?.discount) || 0;
        const discountedPrice = (sellingPrice * quantity) - discountValue;

        const taxRate = Number(product?.tax?.taxRate) || Number(product?.taxInfo?.taxRate) || 0;
        const taxAmount = (discountedPrice * taxRate) / 100;

        return total + taxAmount;
    }, 0);
};


export const CalculateDiscount = (data: Product[]): number => {
    return data.reduce((total, product) => {
        return total + (Number(product.discountValue) || Number(product.discount));
    }, 0);
};

export const CalculatePrice = (data: Product[]): number => {
    return data.reduce((total, product) => {
        return total + (Number(product?.sellingPrice) || Number(product?.rate)) * product?.quantity;
    }, 0);
}