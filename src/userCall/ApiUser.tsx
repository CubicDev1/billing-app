import { getMethod, postMethod, putMethod } from "../services/apiService";
import { ApiUrl } from "../services/apiUrl";
import { screenName } from "../utils/screenNames";
import { ToastAndroid } from "react-native";
import * as TYPES from './../action/ActionType';
import { useToast } from "react-native-toast-notifications";
// import { useToast } from "react-native-toast-notifications";



export const AddInvoiceData = (data: any, navigation: any) => {
    // const toast = useToast();
    console.log("DATAAA", typeof data);
    try {
        postMethod(
            ApiUrl.addInvoice,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data expense', success);
                    navigation.navigate(screenName.InvoiceScreen as never)
                    // toast.show("Added Invoice Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed Data expense', success);
                    // toast.show("Failed to add Invoice", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error Adding Invoice:', error);
                if (error.data.message === 'request.items is not iterable') {
                    // toast.show("Please Add Items", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                    return
                }
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error Adding Invoice:', error);
    }
};

export const handleGetInvoiceData = async (id: any) => {
    // const toast = useToast();
    console.log("id", id?._id);
    try {
        const response = await new Promise((resolve, reject) => {
            getMethod(
                ApiUrl.getAllInvoice + `/${id?._id}`,
                (success: { code: number; message: any; }) => {
                    if (success.code === 200) {
                        console.log('Successfully getInvoiceData', success);
                        resolve(success?.data);
                    } else {
                        console.log('Failed getInvoiceData', success);
                        reject(null); // or throw an error
                    }
                },
                error => {
                    console.log('Error getInvoiceData:', error);
                    reject(null); // or throw an error
                }
            );
        });
        return response;
    } catch (error) {
        console.log('Error getInvoiceData:', error);
        return null; // or throw an error
    }
};

export const AddSalesReturnData = (data: any, navigation: any) => {
    console.log("DATAAA", typeof data);
    // const toast = useToast();
    try {
        postMethod(
            ApiUrl.addCreditNote,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data expense', success);
                    navigation.navigate(screenName.SalesReturn as never)
                    // toast.show("Added Sales Return Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    // toast.show("Failed Data expense", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error AddSalesReturnData Invoice:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error AddAddSalesReturnDataing Invoice:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
};

export const UpdateSalesReturnData = (data: any, id: any, navigation: any) => {
    console.log("DATAAA", typeof data);
    // const toast = useToast();
    try {
        putMethod(
            ApiUrl.updateCreditNote + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully UpdateInvoiceData', success);
                    navigation.navigate(screenName.SalesReturn as never)
                    // toast.show("Updated Invoice Successfully'", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed UpdateInvoiceData', success);
                    // toast.show("Failed to update Invoice", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error UpdateSalesReturnData:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error UpdateSalesReturnData:', error);
        // toast.show("error.data.message[0]", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
};

export const UpdateInvoiceData = (data: any, id: any, navigation: any) => {
    console.log("DATAAA", typeof data);
    // const toast = useToast();
    try {
        putMethod(
            ApiUrl.updateInvoice + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully UpdateInvoiceData', success);
                    navigation.navigate(screenName.InvoiceScreen as never)
                    // toast.show("Updated Invoice Successfully'", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed UpdateInvoiceData', success);
                    // toast.show("Failed to Update Invoice'", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error UpdateInvoiceData:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error UpdateInvoiceData:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
};

export const InvoiceCard = () => {
    try {
        getMethod(
            ApiUrl.invoiceCard,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully InvoiceCard', success);
                    // return success.message
                } else {
                    console.log('Failed Invoice Card', success);
                }
            },
            error => {
                console.log('Error Invoice Card:', error);
            }
        );
    }
    catch (error) {
        console.log('Error Invoice Crad:', error);
    }
}

export const AddPurchaseData = (data: any, navigation: any) => {
    console.log("DATAAA", typeof data);
    // const toast = useToast();
    try {
        postMethod(
            ApiUrl.addPurchase,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data added in addPurchase', success);
                    navigation.navigate(screenName.Purchases as never)
                    // toast.show("Added Purchase Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed Data added in addPurchase', success);
                    // toast.show("Failed to add Purchase", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error Adding addPurchase:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error Adding addPurchase:', error);
    }
};

export const UpdatePurchaseData = (data: any, id: any, navigation: any) => {
    console.log("DATAAA", typeof data);
    try {
        putMethod(
            ApiUrl.updatePurchase + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully UpdatePurchaseData', success);
                    navigation.navigate(screenName.Purchases as never)
                } else {
                    console.log('Failed UpdatePurchaseData', success);
                }
            },
            error => {
                console.log('Error UpdatePurchaseData:', error);
            }
        );
    }
    catch (error) {
        console.log('Error UpdatePurchaseData:', error);
    }
};

export const AddPurchaseOrderData = (data: any, navigation: any) => {
    console.log("DATAAA", data);
    try {
        postMethod(
            ApiUrl.addPurchaseOrder,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data added in addPurchaseOrder', success);
                    navigation.navigate(screenName.PurchaseOrderScreen as never)
                } else {
                    console.log('Failed Data added in addPurchaseOrder', success);
                }
            },
            error => {
                console.log('Error Adding addPurchaseOrder:', error);
            }
        );
    }
    catch (error) {
        console.log('Error Adding addPurchaseOrder:', error);
    }
};

export const UpdatePurchaseOrderData = (data: any, id: any, navigation: any) => {
    console.log("DATAAA", data);
    try {
        putMethod(
            ApiUrl.updatePurchaseOrder + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully UpdatePurchaseOrderData', success);
                    navigation.navigate(screenName.PurchaseOrderScreen as never)
                } else {
                    console.log('Failed UpdatePurchaseOrderData', success);
                }
            },
            error => {
                console.log('Error UpdatePurchaseOrderData:', error);
            }
        );
    }
    catch (error) {
        console.log('Error UpdatePurchaseOrderData:', error);
    }
};

export const AddPurchaseReturnData = (data: any, navigation: any) => {
    console.log("DATAAA", data);
    try {
        postMethod(
            ApiUrl.addPurchaseReturn,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data added in AddPurchaseReturnData', success);
                    navigation.navigate(screenName.PurchaseReturn as never)
                } else {
                    console.log('Failed Data added in AddPurchaseReturnData', success);
                }
            },
            error => {
                console.log('Error Adding AddPurchaseReturnData:', error);
            }
        );
    }
    catch (error) {
        console.log('Error Adding addPurchaseOrder:', error);
    }
};

export const UpdatePurchaseReturnData = (data: any, id: any, navigation: any) => {
    console.log("DATAAA", data);
    // const toast = useToast();
    try {
        putMethod(
            ApiUrl.updatePurchaseReturn + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully UpdatePurchaseReturnData', success);
                    navigation.navigate(screenName.PurchaseReturn as never)
                } else {
                    console.log('Failed UpdatePurchaseReturnData', success);
                }
            },
            error => {
                console.log('Error UpdatePurchaseReturnData:', error);
                // toast.show(error?.data?.message?.[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error UpdatePurchaseReturnData:', error);
    }
};

export const AddDeliverChallanData = (data: any, navigation: any) => {
    console.log("DATAAA", data);
    // const toast = useToast();
    try {
        postMethod(
            ApiUrl.addDeliveryChallan,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data added in AddDeliverChallanData', success);
                    navigation.navigate(screenName.DeliverChallanScreen as never)
                    // toast.show("Added Delivery Challan Successfully'", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed Data added in AddDeliverChallanData', success);
                    // toast.show("Failed to add Delivery Challan", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error Adding AddDeliverChallanData:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error Adding AddDeliverChallanData:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
};

export const UpdateDeliveryChallanData = (data: any, id: any, navigation: any) => {
    console.log("DATAAA", data);
    // const toast = useToast();
    try {
        putMethod(
            ApiUrl.updateDeliveryChallan + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully UpdateDeliveryChallanData', success);
                    navigation.navigate(screenName.DeliverChallanScreen as never)
                    // toast.show("Updated Delivery Challan Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed UpdateDeliveryChallanData', success);
                    // toast.show("Failed to update Delivery Challan", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error UpdateDeliveryChallanData:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error UpdateDeliveryChallanData:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
};

export const AddNewProductData = (data: any, navigation: any, dispatch: any) => {
    // const toast = useToast();
    try {
        postMethod(
            ApiUrl.addProduct,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data added in AddNewProductData', success);
                    navigation.navigate(screenName.Products as never)
                    getProductList(dispatch)
                    // toast.show("Added Product Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed Data added in AddNewProductData', success);
                    // toast.show("Failed to add product", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error Adding AddNewProductData:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error: any) {
        console.log('Error Adding AddNewProductData:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
}

const getProductList = (dispatch: any) => {
    getMethod(
        ApiUrl.dropDownProduct,
        success => {
            if (success.code === 200) {
                dispatch({ type: TYPES.PRODUCT_LIST, payload: success.data })
            } else {
            }
        },
        error => {
            
        }
    )
}

export const UpdateProductData = (data: any, id: any, navigation: any) => {
    // const toast = useToast();
    try {
        putMethod(
            ApiUrl.updateProduct + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data added in AddNewProductData', success);
                    navigation.navigate(screenName.Products as never)
                    // toast.show("Updated Product Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed Data added in AddNewProductData', success);
                    // toast.show("Failed to Update Product", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});

                }
            },
            error => {
                console.log('Error UpdateProductData AddNewProductData:', error);
                // toast.show("Error in Update Product", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error UpdateProductData AddNewProductData:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
}

export const AddQuotationData = (data: any, navigation: any) => {
    console.log("DATAAA", typeof data);
    // const toast = useToast();
    try {
        postMethod(
            ApiUrl.addQuotation,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully Data added in AddQuotationData', success);
                    navigation.navigate(screenName.QuotationsScreen as never)
                    // toast.show("Added Quotation Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed Data added in AddQuotationData', success);
                    // toast.show("Failed to add Quotation'", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error Adding AddQuotationData:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error Adding AddQuotationData:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
};

export const UpdateQuotationData = (data: any, id: any, navigation: any) => {
    console.log("DATAAA from quotation", typeof data);
    // const toast = useToast();
    try {
        putMethod(
            ApiUrl.updateQuotation + id,
            data,
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('Successfully UpdateQuotationData', success);
                    navigation.navigate(screenName.QuotationsScreen as never)
                    // toast.show("Updated Quotation Successfully", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                } else {
                    console.log('Failed UpdateQuotationData', success);
                    // toast.show("Failed to update Invoice'", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            error => {
                console.log('Error UpdateQuotationData:', error);
                // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    }
    catch (error) {
        console.log('Error UpdateQuotationData:', error);
        // toast.show(error.data.message[0], {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
    }
};