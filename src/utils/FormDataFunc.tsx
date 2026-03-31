// utils.ts
import { Platform } from 'react-native';
import { Product, FormDataObject } from './types';

function formatDate(date: string): string {
  return new Date(date).toISOString(); // Ensure the date is in ISO format
}

export function convertToFormData(
  flatData: FormDataObject,
  products: Product[],
  address?: FormDataObject,
): FormData {
  const formData = new FormData();
  console.log('flatData', products);

  // Append flatData fields
  Object.keys(flatData).forEach(key => {
    const value = flatData[key];
    console.log(key, 'Key==>', value);
    if (key === 'signatureImage' && value != '') {
      formData.append('signatureImage', {
        name: 'signature.png',
        type: 'image/jpeg',
        uri: value,
      });
    } else if (key === 'signatureId') {
      if (value !== '') {
        formData.append(key, value);
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (address) {
    formData.append('deliveryAddress[name]', address.name);
    formData.append('deliveryAddress[addressLine1]', address.addressLine1);
    formData.append('deliveryAddress[city]', address.city);
    formData.append('deliveryAddress[state]', address.state);
    formData.append('deliveryAddress[pincode]', address.pincode);
    formData.append('deliveryAddress[country]', address.country);
  }
  // Append products data
  products.forEach((product, index) => {
    formData.append(`items[${index}][name]`, product.name);
    formData.append(`items[${index}][key]`, index.toString());
    formData.append(
      `items[${index}][productId]`,
      product._id ? product._id : product.productId,
    );
    formData.append(`items[${index}][quantity]`, product.quantity.toString());
    formData.append(
      `items[${index}][units]`,
      product?.units?.name ? product?.units.name : product.name,
    );
    formData.append(
      `items[${index}][unit]`,
      product?.units?._id ? product?.units._id : product.unit,
    );
    formData.append(
      `items[${index}][rate]`,
      parseFloat(
        product?.sellingPrice || product.rate,
      ).toFixed(2),
    );
    formData.append(
      `items[${index}][discount]`,
      product.discountValue != 0
        ? product.discountValue
          ? Number(product.discountValue).toFixed(2)
          : product.discount
        : '0',
    );
    formData.append(
      `items[${index}][tax]`,
      (
        (product.sellingPrice ?? product.rate) *
        (parseFloat(product.tax?.taxRate ?? product.tax * 2) / 100)
      ).toFixed(2),
    );
    formData.append(
      `items[${index}][taxInfo]`,
      JSON.stringify(product.tax ?? product.tax.taxInfo),
    );
    formData.append(
      `items[${index}][amount]`,
      (
        parseFloat(product.sellingPrice ?? product.rate) -
        parseFloat(product.discountValue ?? product.discount) +
        parseFloat(product.tax?.taxRate ?? product.tax)
      ).toFixed(2),
    );
    formData.append(`items[${index}][discountType]`, product?.discountType);
    formData.append(`items[${index}][isRateFormUpadted]`, 'false');
    formData.append(
      `items[${index}][form_updated_discounttype]`,
      product?.discountType?.toString(),
    );
    formData.append(
      `items[${index}][form_updated_discount]`,
      product.discountValue != 0
        ? (product.discountValue && !isNaN(Number(product.discountValue))
          ? Number(product.discountValue).toFixed(2)
          : product.discount)
        : '0'
    );
    formData.append(
      `items[${index}][form_updated_rate]`,
      product.sellingPrice || product.rate,
    );
    formData.append(
      `items[${index}][form_updated_tax]`,
      product.tax?.taxRate
        ? product.tax.taxRate.toString()
        : product.tax.toString(),
    );
  });

  return formData;
}

// Define your input type
type CustomerDataInput = {
  name: string;
  email: string;
  phone: string;
  website: string;
  notes: string;
  billingAddressname: string;
  billingAddressaddressLine1: string;
  billingAddressaddressLine2: string;
  billingAddresscity: string;
  billingAddresscountry: string;
  billingAddressstate: string;
  billingAddresspincode: string;
  shippingAddressName: string;
  shippingAddressAddress1: string;
  shippingAddressAddress2: string;
  shippingAddressCity: string;
  shippingAddressState: string;
  shippingAddressCountry: string;
  shippingAddressPincode: string;
  bankDetailsbankName: string;
  bankDetailsbranch: string;
  bankDetailsaccountHolderName: string;
  bankDetailsaccountNumber: string;
  bankDetailsIFSC: string;
  [key: string]: any;
};

// Transformation function
export function CustomerFormData(
  CustomerData: CustomerDataInput,
  imageData: any,
): FormData {
  const formData = new FormData();

  if (imageData && typeof imageData != 'string') {
    formData.append('image', {
      name: imageData?.name ? imageData?.name : 'image.png',
      type: imageData?.type ? imageData?.type : 'image/jpeg',
      uri: imageData?.uri ?? imageData ?? 'null',
    });
  }
  // Add basic fields
  formData.append('name', CustomerData.name);
  formData.append('email', CustomerData.email);
  formData.append('phone', CustomerData.phone);
  formData.append('website', CustomerData.website);
  formData.append('notes', CustomerData.notes);
  // Add billing address
  formData.append('billingAddress[name]', CustomerData.billingAddressname);
  formData.append(
    'billingAddress[addressLine1]',
    CustomerData.billingAddressaddressLine1,
  );
  formData.append(
    'billingAddress[addressLine2]',
    CustomerData.billingAddressaddressLine2,
  );
  formData.append('billingAddress[city]', CustomerData.billingAddresscity);
  formData.append(
    'billingAddress[country]',
    CustomerData.billingAddresscountry,
  );
  formData.append('billingAddress[state]', CustomerData.billingAddressstate);
  formData.append(
    'billingAddress[pincode]',
    CustomerData.billingAddresspincode,
  );

  // Add shipping address
  formData.append('shippingAddress[name]', CustomerData.shippingAddressName);
  formData.append(
    'shippingAddress[addressLine1]',
    CustomerData.shippingAddressAddress1,
  );
  formData.append(
    'shippingAddress[addressLine2]',
    CustomerData.shippingAddressAddress2,
  );
  formData.append('shippingAddress[city]', CustomerData.shippingAddressCity);
  formData.append(
    'shippingAddress[country]',
    CustomerData.shippingAddressCountry,
  );
  formData.append('shippingAddress[state]', CustomerData.shippingAddressState);
  formData.append(
    'shippingAddress[pincode]',
    CustomerData.shippingAddressPincode,
  );

  // Add bank details
  formData.append('bankDetails[bankName]', CustomerData.bankDetailsbankName);
  formData.append('bankDetails[branch]', CustomerData.bankDetailsbranch);
  formData.append(
    'bankDetails[accountHolderName]',
    CustomerData.bankDetailsaccountHolderName,
  );
  formData.append(
    'bankDetails[accountNumber]',
    CustomerData.bankDetailsaccountNumber,
  );
  formData.append('bankDetails[IFSC]', CustomerData.bankDetailsIFSC);

  return formData;
}

interface FormDataProduct {
  [key: string]: string | number | File; // Extend with specific types if needed
}

export function ProductFormData(
  CustomerData: FormDataProduct,
  imageData: any,
): FormData {
  const formData = new FormData();

  // Add basic fields
  if (typeof imageData !== 'string') {
    formData.append('images', {
      name: imageData?.name ? imageData?.name : 'image.png',
      type: imageData?.type ? imageData?.type : 'image/jpeg',
      uri: imageData?.uri ?? imageData,
    });
  }
  formData.append('type', CustomerData.type);
  formData.append('name', CustomerData.name);
  formData.append('sku', CustomerData.sku);
  formData.append('category', CustomerData.category);
  formData.append('sellingPrice', CustomerData.sellingPrice);
  formData.append('purchasePrice', CustomerData.purchasePrice);
  formData.append('units', CustomerData.units);
  formData.append(
    'discountType',
    CustomerData.discountType === 'fixed' ? 2 : 3,
  );
  formData.append('discountValue', CustomerData.discountValue);
  formData.append('barcode', CustomerData.barcode);
  formData.append('alertQuantity', CustomerData.alertQuantity);
  formData.append('tax', CustomerData.tax);
  formData.append('productDescription', '');
  return formData;
}

export function convertFormdataExpense(expenseData: any, imageData: any) {
  const formData = new FormData();
  // reference, amount, description, attachment, status, expenseDate, expenseId, paymentMode, _id
  formData.append('images', {
    name: imageData?.name ? imageData?.name : 'image.png',
    type: imageData?.type ? imageData?.type : 'image/jpeg',
    uri: imageData?.uri,
  });
  formData.append('reference', expenseData.reference);
  formData.append('amount', expenseData.amount);
  formData.append('description', expenseData.description);
  formData.append('status', expenseData.status);
  formData.append('expenseDate', expenseData.expenseDate);
  formData.append('paymentMode', expenseData.paymentMode);
  formData.append('_id', expenseData._id);
  return formData;
}


export function ProfileFormData(
  ProfileData: CustomerDataInput,
  imageData: any,
): FormData {
  const formData = new FormData();

  formData.append('image', {
    name: imageData?.name ? imageData?.name : 'image.png',
    type: imageData?.type ? imageData?.type : 'image/jpeg',
    uri: imageData?.uri ?? imageData ?? 'null',
  });

  formData.append('firstName', ProfileData.firstName);
  formData.append('lastName', ProfileData.lastName);
  formData.append('DOB', ProfileData.DOB);
  formData.append('email', ProfileData.email);
  formData.append('mobileNumber', ProfileData.mobileNumber);
  formData.append('gender', ProfileData.gender);

  return formData;
}