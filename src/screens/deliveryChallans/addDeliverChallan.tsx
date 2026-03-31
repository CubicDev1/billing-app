import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomNavigateBox, CustomTextInputField, MultiLineTextBox, MultiSelectOption, RadioBtn, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { addedProductData } from '../../utils/data/invoiceData';
import { DevWidth } from '../../utils/device';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, justifyCenter, justifyStart, m10, m15, m5, mb5, mh10, mh15, ml10, ml15, mr5, mt10, mt15, mt5, mv10, mv5, p10 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { AddBankDetails, AddSignature, AddTax } from '../settings/settingsComponent';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { CalculationTotal, CalculateDiscount, CalculateTaxTotal, CalculatePrice } from '../../utils/Calculation';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { CustomTextInput } from '../../components/commonInputFields';
import { requiredValidation } from '../../utils/validationConfig';
import { convertToFormData } from '../../utils/FormDataFunc';
import { AddDeliverChallanData, UpdateDeliveryChallanData } from '../../userCall/ApiUser';
import { CommonDatePicker } from '../../components/CommonDatePicker';
import { useToast } from 'react-native-toast-notifications';
import { currencySymbol } from '../../constant/constApi';
import ProductsList from '../products/productsList';
import { commonStyles, getTopNotchStyle, getMainContainerStyle } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type addDeliverChallanProps = {

}

type deliveryAddress = {
    name: string;
    state: string;
    pincode: string;
    country: string;
    city: string;
    // addressLine2: string;
    addressLine1: string;
}

type formkeys = {
    customerId: string;
    deliveryChallanDate: string;
    referenceNo: string;
    bank: string;
    notes: string;
    terms_conditions: string;
    signatureId: string;
    sign_type: string;
    taxableAmount: string;
    TotalAmount: string;
    vat: string;
    totalDiscount: string;
    roundOff: string;
    isRecurring: string;
    recurringCycle: string;
    deliveryChallanNumber: string;
    dueDate: string;
    signatureName: string,
    signatureImage: string,
};

const AddDeliverChallanScreen = ({ route }: any) => {
    const deliveryChallanDetails = route.params?.deliveryChallanDetails;
    console.log("delivery challan details", deliveryChallanDetails);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [notes, setNotes] = useState('');
    const [termsCondition, setTermsCondition] = useState('');
    const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
    const [checkBox, setCheckBox] = useState(false);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [editProductModal, setEditProductModal] = useState(false);
    const [addBankDetailsModal, setAddBankDetailsModal] = useState(false);
    const [deliveryChallanId, setDeliveryChallanId] = useState<string>('');
    const [dropDownBank, setDropDownBank] = useState<string | null>(null);
    const [paymenttype, setPaymenttype] = useState<string | null>(null);
    const [addedProduct, setAddedProduct] = useState<any[]>([]);
    const [total, setTotal] = useState<any>(0);
    const [taxTotal, setTaxTotal] = useState<any>(0);
    const [discountTotal, setDiscountTotal] = useState<any>(0);
    const [dropdownValue, setDropdownValue] = useState<string | null>(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [dropDownSignature, setDropDownSignature] = useState<string | null>(null);
    const [isFocusSignature, setIsFocusSignature] = useState<boolean>(false);
    const [addTaxModal, setAddTaxModal] = useState(false);
    const [billingAddress, setBillingAddress] = useState();
    const [selectedDateType, setSelectedDateType] = useState<'deliveryChallanDate' | 'dueDate' | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [isFocusBank, setIsFocusBank] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [SignImage, setSignImage] = useState<any>(null);
    const [OpenSignature, SetOpenSignature] = useState<boolean>(false);
    const customerList = useSelector((state: any) => state.Reducer.customer);
    const productList = useSelector((state: any) => state.Reducer.product);
    const taxList = useSelector((state: any) => state.Reducer.tax);
    const bankList = useSelector((state: any) => state.Reducer.bank);
    const signatureList = useSelector((state: any) => state.Reducer.signature);
    const vendorList = useSelector((state: any) => state.Reducer.vendor);
    const [editItem, setEditItem] = useState<any>(null);
    const ProcutsList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.product);
    const UnitsList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.units);

    const toast = useToast();

    //console.log("customers list", customerList)

    const { control,
        getValues,
        setValue,
        handleSubmit,
        reset,
        trigger,
        formState: { errors }, } = useForm<formkeys>({
            defaultValues: {
                deliveryChallanDate: '',
                referenceNo: '',
                bank: '',
                notes: '',
                terms_conditions: '',
                signatureId: '',
                sign_type: '',
                taxableAmount: '',
                TotalAmount: '',
                vat: '',
                totalDiscount: '',
                roundOff: '',
                isRecurring: '',
                recurringCycle: '',
                dueDate: '',
                signatureName: '',
                signatureImage: '',
            }
        });

    useEffect(() => {
        getDeliveryChallanData();

        if (deliveryChallanDetails) {
            getEditDeliveryChallanData();
        }
    }, []);

    const getEditDeliveryChallanData = () => {
        console.log(deliveryChallanDetails, "deliveryChallanDetails")
        setDeliveryChallanId(deliveryChallanDetails?.deliveryChallanNumber)
        //console.log("purchaseReturnId in edit", deliveryChallanDetails?.deliveryChallanNumber)
        handleDropdownChange(deliveryChallanDetails.customerId)
        setValue('referenceNo', deliveryChallanDetails?.referenceNo)
        setValue('deliveryChallanDate', moment(deliveryChallanDetails?.deliveryChallanDate).format('YYYY-MM-DD'))
        setValue('dueDate', moment(deliveryChallanDetails?.dueDate).format('YYYY-MM-DD'))
        setPaymenttype(deliveryChallanDetails?.payment_method)
        setDropDownBank(bankList.find((bank: any) => bank._id === deliveryChallanDetails?.bank)?.bankName ?? '');
        setValue('bank', deliveryChallanDetails?.bank);
        const parsedItems = deliveryChallanDetails.items.map((item: { taxInfo: string; }) => {
            item.sellingPrice = parseFloat(item.rate);
            item.discountValue = parseFloat(item.discount);
            item._id = item.productId;
            item.taxInfo = ProcutsList.find((product: any) => product._id === item.productId)?.tax;
            item.tax = ProcutsList.find((product: any) => product._id === item.productId)?.tax;
            item.discountType = ProcutsList.find((product: any) => product._id === item.productId)?.discountType;
            return item;
        });

        setValue('deliveryChallanNumber', deliveryChallanDetails?.deliveryChallanNumber)
        setValue('notes', deliveryChallanDetails?.notes)
        setValue('terms_conditions', deliveryChallanDetails?.terms_conditions ?? deliveryChallanDetails?.termsAndCondition ?? "");
        setNotes(deliveryChallanDetails?.notes ?? "");
        setTermsCondition(deliveryChallanDetails?.terms_conditions);
        setValue('sign_type', deliveryChallanDetails?.sign_type == 'manualSignature' ? "manualSignature" : "eSignature")
        // setValue('terms_conditions', deliveryChallanDetails?.terms_conditions)
        setValue('taxableAmount', deliveryChallanDetails?.tax)
        setValue('TotalAmount', deliveryChallanDetails?.TotalAmount)
        setValue('vat', deliveryChallanDetails?.vat)
        setValue('totalDiscount', deliveryChallanDetails?.totalDiscount)
        setValue('roundOff', deliveryChallanDetails?.roundOff)
        setValue('isRecurring', deliveryChallanDetails?.isRecurring)
        setValue('recurringCycle', deliveryChallanDetails?.recurringCycle)
        setTaxTotal(Number(deliveryChallanDetails?.vat))
        setDiscountTotal(Number(deliveryChallanDetails?.totalDiscount))
        setTotal(Number(deliveryChallanDetails?.taxableAmount))
        handleDropdownSignature(deliveryChallanDetails?.signatureId)
        setSelectedSignature(deliveryChallanDetails?.sign_type == 'manualSignature' ? "Manual Signature" : "E-Signature")
        setSignImage(deliveryChallanDetails?.signatureImage)
        setAddedProduct(parsedItems);
    }

    useEffect(() => {
        doCalculation();
    }, [addedProduct])

    const getDiscountAmount = (item: any) => {
        const sellingPrice = parseFloat(item?.sellingPrice) * parseFloat(item?.quantity ?? 0);
        const discountValue = item.discountType == "3" ? parseFloat(item.discountValue) :
            (sellingPrice * parseFloat(item?.discountValue ?? 0)) / 100;
        return discountValue;
    }

    const doCalculation = () => {
        let total = 0;
        let discountTotal = 0;
        let taxTotal = 0;

        addedProduct.map((item: any) => {
            const sellingPrice = parseFloat(item?.sellingPrice) * parseFloat(item?.quantity ?? 0);
            const discountValue = item.discountType == "3" ? parseFloat(item.discountValue) :
                (sellingPrice * parseFloat(item?.discountValue ?? 0)) / 100;
            const taxRate = parseFloat(item?.tax?.taxRate);
            const amount = sellingPrice - discountValue;
            const taxItem = (amount * taxRate) / 100;
            total += sellingPrice;
            discountTotal += discountValue;
            taxTotal += taxItem;
        })
        setTotal(total);
        setDiscountTotal(discountTotal);
        setTaxTotal(taxTotal);
    }

    const getDeliveryChallanData = () => {
        if (!deliveryChallanDetails) {
            getMethod(
                ApiUrl.getDeliveryChallanNo,
                success => {
                    if (success.code == 200) {
                        //console.log('Successfully getDeliveryChallanNo', success.data);
                        setValue('deliveryChallanNumber', success.data);
                        setDeliveryChallanId(success.data.replace(/\s/g, ''));
                    } else {
                        //console.log('Failed to getDeliveryChallanNo:', success.message);
                    }
                },
                error => {
                    //console.log('Error fetching getDeliveryChallanNo:', error);
                }
            );
        }
    }

    const handleDropdownChange = (item: { name: string, id: number, _id: string }) => {
        console.log("handleDropdownChange", item);
        setDropdownValue(item?.name);
        setValue('customerId', item?._id);
        setIsDropdownVisible(false);
        const fiteredData = customerList.filter((data: { _id: string; }) => data?._id === (item?._id || deliveryChallanDetails?.customerId?._id));
        console.log('fiteredData', fiteredData);
        setBillingAddress(fiteredData[0]);
    };

    const handleDropdownSignature = (item: {
        signatureName: string; name: string, _id: string, signatureImage: string
    }) => {
        setDropDownSignature(item?.name ?? item?.signatureName);
        setSignImage(item?.signatureImage);
        setValue('signatureId', item?._id);
        setIsFocusSignature(false);
    };

    const showDatePickerModal = (type: 'deliveryChallanDate' | 'dueDate') => {
        setSelectedDateType(type);
        setShowDatePicker(true);
    };

    const handleSaveBtnClick = async () => {
        const isValid = await trigger();
        //console.log(isValid);
        if (!isValid) {
            //console.log('its not valid')

            toast.show("Please fill all mandatory fields'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return
        }
        else if (!dropdownValue || !dropDownBank || !selectedSignature) {
            console.log('its dropdown', dropdownValue, dropDownBank, selectedSignature)
            toast.show('Please fill all mandatory fields'), {
                type: "success",
                placement: "bottom",
                duration: 500,
                //successColor: 'colors.green,'
                animationType: "zoom-in",
            };

            return
        }
        setIsActiveBtn(true);
        setValue('TotalAmount', checkBox ? Math.round(total - discountTotal + taxTotal) : total - discountTotal + taxTotal);
        setValue('isRecurring', 'false');
        setValue('roundOff', checkBox ? 'true' : 'false');
        // setValue('notes', notes);
        // setValue('terms_conditions', termsCondition);
        setValue('vat', taxTotal);
        setValue('taxableAmount', total);
        setValue('totalDiscount', discountTotal);
        //console.log('values', getValues());
        //console.log(addedProduct, 'addedProduct');
        //console.log(dropdownValue, 'dropdownValue');
        //console.log(selectedSignature, 'selectedSignature');
        //console.log(dropDownBank, 'dropdownBank');

        const formData = convertToFormData(getValues(), addedProduct, billingAddress);

        formData.append("termsAndCondition", getValues('terms_conditions'));
        console.log("formdata values form add vendor", formData)
        //console.log('billing address==>', billingAddress)
        //console.log(formData, "formData from add vendor");

        if (formData && !deliveryChallanDetails && formData instanceof FormData) {
            AddDeliverChallanData(formData, navigation);
            console.log("this is add vendor")
            return
        }
        else {
            console.log("this is edit vendor", deliveryChallanDetails, formData instanceof FormData)
            UpdateDeliveryChallanData(formData, deliveryChallanDetails?._id, navigation);
            return
        }
    };

    const handleDateCancel = () => {
        setShowDatePicker(false);
    };

    const handleDateConfirm = (date: any) => {
        const formattedDate = date.dateString || new Date(date.date).toISOString().split('T')[0];
        if (selectedDateType === 'deliveryChallanDate') {
            setValue('deliveryChallanDate', formattedDate);
        }
        else if (selectedDateType === 'dueDate') {
            setValue('dueDate', formattedDate);
        }
        setShowDatePicker(false);
    };

    const handleDropdownBank = (item: { bankName: string; _id: string }) => {
        setDropDownBank(item.bankName);
        setValue('bank', item._id);
        setIsFocusBank(false);
    };

    const EditProduct = (item: any) => {
        const index = addedProduct.findIndex(
            (product: any) => product._id === item._id,
        )
        addedProduct[index] = item;
        console.log('addedProduct', item);
        setAddedProduct([...addedProduct]);
        // doCalculation();
        closeModal();
    };

    const handlereturnData = (data: any) => {
        setAddedProduct([...addedProduct, ...data]);
        // doCalculation();
    };

    const deleteItem = (item: any) => {
        console.log("delete item", item);
        console.log("added product", addedProduct);
        let Deletedata;
        if (deliveryChallanDetails) {
            Deletedata = addedProduct.filter((i: any) => i?.productId !== item?.productId);
        }
        else {
            Deletedata = addedProduct.filter((i: any) => i._id !== item._id);
        }
        setAddedProduct(Deletedata);

    }

    const calculateAmount = (item: any) => {
        const sellingPrice =
            (Number(item?.sellingPrice) || Number(item?.rate)) * Number(item?.quantity);
        // const discountValue = Number(item?.discountValue) || Number(item?.discount);
        const discountValue = Number(item?.discountValue) || Number(item?.discount) || 0
        const taxRate =
            item?.tax?.taxRate !== undefined
                ? Number(item?.tax?.taxRate)
                : item?.taxInfo?.taxRate !== undefined
                    ? Number(item?.taxInfo?.taxRate)
                    : 0; // Fallback to 0 if taxRate is undefined
        const amount = sellingPrice - discountValue;
        const taxItem = (amount * taxRate) / 100;

        console.log(
            `Calculated amount: Selling Price = ${sellingPrice}, Discount = ${discountValue}, Tax Rate = ${taxRate}, Amount = ${amount}, Tax Item = ${taxItem}`
        );

        return amount + taxItem;
    };

    const getItemTotal = (item: any) => {
        const sellingPrice = parseFloat(item?.sellingPrice) * parseFloat(item?.quantity ?? 0);
        const discountValue = item.discountType == "3" ? parseFloat(item.discountValue) :
            (sellingPrice * parseFloat(item?.discountValue ?? 0)) / 100;
        const taxRate = parseFloat(item?.tax?.taxRate);
        const amount = sellingPrice - discountValue;
        const taxItem = (amount * taxRate) / 100;
        return amount + taxItem;
    }

    const renderItem = ({ item }: { item: any }) => (
        //console.log('item', item),

        <View style={[{ backgroundColor: colors.greyOne, borderRadius: 8, width: '100%' }, mb5]}>
            <View style={[flexRow, justifyBetween, m10]}>
                <Text style={[commonStyles.h18BlackOne700,{}]}>{productList.find((i: any) => i._id === (item?.productId ?? item?._id))?.name}</Text>
                <Text style={[commonStyles.h18BlackOne700,{}]}>{currencySymbol}{getItemTotal(item).toFixed(2)}</Text>
            </View>
            <View style={[alignItemCenter]}>
                <DashedLine height={300} color={colors.greyTwo} dashLength={10} dashGap={0} />
            </View>
            <View style={[flexRow, alignItemCenter, justifyBetween]}>
                <View style={[flexRow, alignItemCenter, justifyBetween]}>
                    <View style={[p10]}>
                        <Text style={[commonStyles.h12blackTwo600]}>Qty*Rate</Text>
                        <Text style={[commonStyles.h12blackTwo600,mt5]} >Discount & Tax</Text>
                    </View>
                    <View style={[p10]}>
                        <Text style={[commonStyles.h12blackTwo600]}>
                            {item.quantity} x {item.sellingPrice ?? item?.rate}
                        </Text>
                        <Text style={[commonStyles.h12blackTwo600,mt5]} >
                            {getDiscountAmount(item)}{' '}
                            ({item?.tax?.taxRate}%)
                        </Text>
                    </View>
                </View>
                <View style={[flexRow, alignItemCenter, justifyBetween]}>
                    <TouchableOpacity style={[p10]} onPress={() => openTaxModal(item)}>
                        <CustomIcon
                            color={colors.blackTwo}
                            name="edit"
                            size={14}
                            type="Feather"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[p10]} onPress={() => deleteItem(item)}>
                        <CustomIcon
                            color={colors.blackTwo}
                            name="delete-forever-outline"
                            size={18}
                            type="MaterialCommunityIcons"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const openTaxModal = (item: object) => {
        setAddTaxModal(true);
        setEditItem(item);
    };

    const openModal = () => {
        setAddBankDetailsModal(true);
    };

    const openEditProductModal = () => {
        setEditProductModal(true);
    };
    const closeModal = () => {
        setAddBankDetailsModal(false);
        setEditProductModal(false);
        SetOpenSignature(false);
        setAddTaxModal(false);
    };

    const addSaveSignature = (data: any) => {
        SetOpenSignature(false);
        setSignImage(data)
        setValue('signatureImage', data)
    }

    const handleSignatureSelect = (status: string) => {
        setValue('sign_type', status == "Manual Signature" ? "manualSignature" : "eSignature");
        setSelectedSignature(status);
        if (status !== "Manual Signature") {
            SetOpenSignature(true);
        }
    };

    const handleCancelBtnClick = () => {
        navigation.goBack();
    };

    const handleCheckBox = () => {
        setCheckBox(!checkBox);
    }

    const signature = [
        {
            id: 1,
            name: 'Manual Signature',
        },
        {
            id: 2,
            name: 'E-Signature',
        },
    ]

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>

                    <View style={[flex1, { backgroundColor: colors.white }]}>
                               <KeyboardAwareScrollView
                                          showsVerticalScrollIndicator={false}
                                          keyboardShouldPersistTaps="handled"
                                          enableAutomaticScroll={true}
                                          extraHeight={Platform.OS === 'ios' ? 90 : 75}
                                        >
                            <CommonDatePicker
                                showDatePickerSingle={showDatePicker}
                                onCancelSingle={handleDateCancel}
                                onConfirmSingle={handleDateConfirm}
                            />
                            <View style={[flex1, mh10]}>
                                <TopHeader headerText={labels.addDeliveryChallan} searchIcon={false} />
                                                                    <View style={[commonStyles.smallCard,mv10]} >

                                   <Text style={[commonStyles.h12RedTwo500,mh10]} >{`Delivery Challan Id : ${deliveryChallanId}`}</Text>
                                </View>
                                <View style={[flexRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                       <Text style={[commonStyles.h14blackOne600,mv5]} >{'Customer Name'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <TouchableOpacity style={{}} onPress={() => navigation.navigate(screenName.AddVendor as never)}>
                                        <Text style={{ color: colors.primary, }}>Add New</Text>
                                    </TouchableOpacity>
                                </View>
                                <View >
                                    <Controller
                                        name="customerId"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <CommonDropDownPicker
                                                ListData={customerList}
                                                dropdownValue={dropdownValue}
                                                handleDropdownChange={handleDropdownChange}
                                                isFocus={isFocus}
                                                setIsFocus={setIsFocus}
                                                labelField="name"
                                                valueField="name"
                                                placeholder={labels.customerName}
                                            />
                                        )}
                                        rules={{
                                            required: 'Customer Name is required',
                                        }}
                                    />
                                </View>
                                {errors.customerId && (
                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                        {errors.customerId.message}
                                    </Text>
                                )}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{'Delivery Challan Date'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => showDatePickerModal('deliveryChallanDate')} style={[styles.input, { width: 160 }, flexRow]}>
                                            <Controller
                                                name={'deliveryChallanDate'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.deliveryChalanDate}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        editable={false}
                                                    />
                                                )}
                                                rules={{
                                                    required: 'Date is required'
                                                }}
                                            />
                                            <View style={[alignSelfCenter]}>
                                                <CustomIcon name='calendar' size={16} color={colors.grey} type='Feather' />
                                            </View>
                                        </TouchableOpacity>
                                        {errors.deliveryChallanDate && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.deliveryChallanDate.message}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{'Due Date'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => showDatePickerModal('dueDate')} style={[styles.input, { width: 160 }, flexRow]}>
                                            <Controller
                                                name={'dueDate'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.dueDate}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        editable={false}
                                                    />
                                                )}
                                                rules={{
                                                    required: 'Due Date is required'
                                                }}
                                            />
                                            <View style={[alignSelfCenter]}>
                                                <CustomIcon name='calendar' size={16} color={colors.grey} type='Feather' />
                                            </View>
                                        </TouchableOpacity>
                                        {errors.dueDate && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.dueDate.message}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View style={[flexRow]}>
                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.referenceNumber}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                <View style={styles.input}>
                                    <Controller
                                        name={'referenceNo'}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <CustomTextInput
                                                placeholder={labels.referenceNumber}
                                                value={value}
                                                onChangeText={onChange}
                                                textColor={colors.black}
                                                keyboardType='number-pad'
                                                maxLength={15}
                                            />
                                        )}
                                        rules={{
                                            required: requiredValidation("Reference Number"),
                                        }}
                                    />
                                </View>
                                {errors.referenceNo && (
                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                        {errors.referenceNo.message}
                                    </Text>
                                )}
                                {
                                    addedProduct && addedProduct.length > 0 ? (
                                        console.log(addedProduct, "addproductrs"),

                                        <View>
                                            <View style={flexRow}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.products}</Text>
                                                <Text style={[commonStyles.h14Danger400]}>*</Text>
                                            </View>
                                            <View style={[{ borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 8 }]}>
                                                <View style={[flexRow, justifyBetween, alignItemCenter, mv10, mh10]}>
                                                    <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                                        <CustomIcon color={colors.blackTwo} name='chevron-small-up' size={14} type='Entypo' />
                                                        <Text style={[commonStyles.h14BlackTwo400]}>{labels.products}({addedProduct.length})</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            (navigation as any).navigate(screenName.ProductScreen, {
                                                                fromScreen: labels.invoice,
                                                                listData: productList.filter(
                                                                    (item: any) => !addedProduct.some((i: any) => i._id === item._id)
                                                                ),
                                                                handlereturnData: handlereturnData,
                                                            } as any)
                                                        }
                                                    >
                                                        <Text style = {[commonStyles.h12Primary400]}>Add Item</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[alignItemCenter, justifyCenter, {}]}>
                                                    <FlatList
                                                        data={addedProduct}
                                                        renderItem={renderItem}
                                                        keyExtractor={(item) => item?._id?.toString() ?? item?.key}
                                                    />
                                                </View>
                                                <View style={[alignItemCenter, mv10]}>
                                                    <DashedLine height={320} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                </View>


                                                <View style={[flexRow, justifyBetween, m10]}>
                                                    <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                                                    <Text style={[commonStyles.h18BlackOne700,{}]}>{currencySymbol}{((Number(total) || 0) - (Number(discountTotal) || 0) + (Number(taxTotal) || 0)).toFixed(2)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={[mt10]}>
                                            <CustomNavigateBox name='Add Product' label={labels.products} onNavigate={() => (navigation as any).navigate(screenName.ProductScreen, {
                                                fromScreen: labels.invoice,
                                                listData: productList.filter(
                                                    (item: any) => !addedProduct.some((i: any) => i._id === item._id)
                                                ),
                                                handlereturnData: handlereturnData,
                                            } as any)} color={colors.primary} />
                                        </View>
                                    )
                                }
                                <View>
                                    <View style={[flexRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{'Select Bank'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <TouchableOpacity style={{}} onPress={openModal}>
                                            <Text style={{ color: colors.primary, }}>Add New</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View >
                                        <Controller
                                            name="bank"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CommonDropDownPicker
                                                    ListData={bankList}
                                                    dropdownValue={dropDownBank}
                                                    handleDropdownChange={handleDropdownBank}
                                                    isFocus={isFocusBank}
                                                    setIsFocus={setIsFocusBank}
                                                    labelField="bankName"
                                                    valueField="bankName"
                                                    placeholder={labels.bankName}
                                                />
                                            )}
                                            rules={{
                                                required: 'Bank Name is required',
                                            }}
                                        />
                                    </View>
                                    {errors.bank && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.bank.message}
                                        </Text>
                                    )}

                                    <Controller
                                        name="notes"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <MultiLineTextBox
                                                placeHolder={labels.notes}
                                                label={labels.notes}
                                                value={value}
                                                onChangeValue={onChange}
                                                multiline={true}
                                                keyboardType="default"
                                                height={100}
                                                maxLength={200}
                                                disable={false}
                                                error={errors['notes']?.message}
                                            />
                                        )}
                                        rules={{
                                            required: 'Notes is required',
                                        }}
                                    />
                                    <Controller
                                        name="terms_conditions"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <MultiLineTextBox
                                                placeHolder={labels.terms}
                                                label={labels.termsConditions}
                                                value={value}
                                                onChangeValue={onChange}
                                                multiline={true}
                                                keyboardType="default"
                                                height={100}
                                                maxLength={200}
                                                disable={false}
                                                error={errors['terms_conditions']?.message}
                                            />
                                        )}
                                        rules={{
                                            required: 'Terms & Conditions is required',
                                        }}
                                    />
                                </View>
                                <View style={mv10}>
                                   <Text style={commonStyles.h14blackOne600} >Invoice Summary</Text>
                                    <View style={[{ width: '100%', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 8 }, mv10]}>
                                        <View style={[mh10, mv10]}>
                                            <View style={[flexRow, justifyBetween]}>
                                                <Text style={[commonStyles.h14blackTwo500]}>Amount</Text>
                                                <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{total.toFixed(2)}</Text>
                                            </View>
                                            <View style={[flexRow, justifyBetween, mt10]}>
                                                <Text style={[commonStyles.h14blackTwo500]}>Discount</Text>
                                                <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{discountTotal.toFixed(2)}</Text>
                                            </View>
                                            <View style={[flexRow, justifyBetween, mt10]}>
                                                <Text style={[commonStyles.h14blackTwo500]}>Tax</Text>
                                                <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{taxTotal?.toFixed(2)}</Text>
                                            </View>
                                            <View style={[flexRow, justifyBetween, alignItemCenter, mt5]}>
                                                <View style={[flexRow, justifyCenter, mt10]}>
                                                    <Text style={[commonStyles.h14blackTwo500,mr5]} >Round Off</Text>
                                                    <MultiSelectOption selectedColor={colors.primary} unselectedColor={colors.danger} isSelected={checkBox} onSelect={handleCheckBox} />
                                                </View>
                                                <Text style={[commonStyles.h14blackTwo500]}>
                                                    {' '}
                                                    {currencySymbol}{' '}
                                                    {checkBox
                                                        ? (
                                                            Math.round(total - discountTotal + taxTotal) -
                                                            (total - discountTotal + taxTotal)
                                                        ).toFixed(2)
                                                        : '0'}
                                                </Text>
                                            </View>
                                            <View style={[alignSelfCenter, mv10]}>
                                                <DashedLine height={300} color={colors.greyEight} dashGap={4} />
                                            </View>
                                            <View style={[flexRow, justifyBetween]}>
                                                <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                                                <Text style={[commonStyles.h18BlackOne700,{}]}>
                                                    {checkBox
                                                        ? Math.round(total - discountTotal + taxTotal)
                                                        : (total - discountTotal + taxTotal).toFixed(2)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={mv10}>
                                   <Text style={commonStyles.h14blackOne600} >Signature</Text>
                                    <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                        {
                                            signature.map((item) => {
                                                return (
                                                    <View style={[flexRow, mv10, { height: 40, width: '48%', borderWidth: 1, borderColor: selectedSignature === item.name ? colors.primary : colors.grey, borderRadius: 8 }, alignItemCenter, justifyStart]} key={item.id}>
                                                        <View style={ml15}>
                                                            <RadioBtn
                                                                key={item.id}
                                                                selected={selectedSignature === item.name}
                                                                onPress={() => handleSignatureSelect(item.name)}
                                                            />
                                                        </View>
                                                        <Text style={[ml10, { color: selectedSignature === item.name ? colors.primary : colors.grey }]}>{item.name}</Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                                <View style={[flexRow, mt15]}>
                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{'Select Signature'}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                {(selectedSignature == "Manual Signature") ?
                                    <View>
                                        <View >
                                            <Controller
                                                name="signatureId"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CommonDropDownPicker
                                                        ListData={signatureList}
                                                        dropdownValue={dropDownSignature}
                                                        handleDropdownChange={handleDropdownSignature}
                                                        isFocus={isFocusSignature}
                                                        setIsFocus={setIsFocusSignature}
                                                        labelField="signatureName"
                                                        valueField="signatureName"
                                                        placeholder={labels.signatureName}
                                                    />
                                                )}
                                                rules={{
                                                    required: 'Signature is required',
                                                }}
                                            />

                                        </View>
                                        {errors.signatureId && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.signatureId.message}
                                            </Text>
                                        )}
                                    </View>
                                    :
                                    <View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'signatureName'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.signatureName}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('signatureName'),
                                                }}
                                            />
                                        </View>
                                        {errors.signatureName && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.signatureName.message}
                                            </Text>
                                        )}
                                    </View>
                                }
                                {SignImage &&
                                    <View style={mv10}>
                                       <Text style={commonStyles.h14blackOne600} >Signature</Text>
                                        <View style={{ padding: 2, borderWidth: 1, borderRadius: 5 }}>
                                            <Image
                                                source={{ uri: SignImage }}
                                                style={{ height: 100, width: '100%', resizeMode: 'contain' }}
                                            />
                                        </View>
                                    </View>
                                }
                            </View>
                            <View style={[flexRow, justifyBetween, mt10, mh10]}>
                                <OnboardingButton
                                    width={160}
                                    title={labels.cancel}
                                    onChange={handleCancelBtnClick}
                                    backgroundColor={colors.greySeven}
                                    color={colors.blackOne}
                                />
                                <OnboardingButton
                                    width={160}
                                    title={labels.saveChanges}
                                    onChange={handleSaveBtnClick}
                                    backgroundColor={colors.primary}
                                    color={colors.white}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                        <CustomModal children={<AddBankDetails onSave={closeModal} onCancel={closeModal} />} visible={addBankDetailsModal} onClose={closeModal} height={'80%'} />
                        <CustomModal
                            children={
                                <AddTax
                                    data={editItem}
                                    onSave={EditProduct}
                                    onCancel={closeModal}
                                    taxData={taxList}
                                />
                            }
                            visible={addTaxModal}
                            onClose={closeModal}
                            height={'80%'}
                        />
                        <CustomModal children={<AddSignature onSave={addSaveSignature} onCancel={closeModal} />} visible={OpenSignature} onClose={closeModal} height={'70%'} />

                    </View>

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 15,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        // flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingBottom: 5,
        marginBottom: 5
    },
    formContainer: {
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shippingAddress: {
        marginTop: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
});

export default AddDeliverChallanScreen