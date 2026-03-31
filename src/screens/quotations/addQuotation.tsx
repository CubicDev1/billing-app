import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { TopHeader, CustomTextInputField, CustomNavigateBox, MultiLineTextBox, MultiSelectOption, RadioBtn } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, mt10, mh10, mv10, flexRow, justifyBetween, alignItemCenter, justifyCenter, mb5, mh15, mt5, alignSelfCenter, justifyStart, ml10, ml15, mr5, m10, mt15, p10, mv5 } from '../../utils/theme/commonStyles';
import { Controller, useForm } from 'react-hook-form';
import DashedLine from '../../components/dashedLine';
import { addedProductData } from '../../utils/data/invoiceData';
import CustomIcon from '../../utils/icons';
import { screenName } from '../../utils/screenNames';
import { useNavigation } from '@react-navigation/native';
import { OnboardingButton } from '../../components/commonButton';
import { DevWidth } from '../../utils/device';
import { ModalTopText } from '../inventory/stockDetails';
import CustomModal from '../../components/commonModal';
import { useDispatch, useSelector } from 'react-redux';
import { AddBankDetails, AddSignature, AddTax } from '../settings/settingsComponent';
import { convertToFormData } from '../../utils/FormDataFunc';
import { AddQuotationData, UpdateQuotationData } from '../../userCall/ApiUser';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import moment from 'moment';
import { CommonDatePicker } from '../../components/CommonDatePicker';
import { CalculationTotal, CalculateDiscount, CalculateTaxTotal, CalculatePrice } from '../../utils/Calculation';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { CustomTextInput } from '../../components/commonInputFields';
import { requiredValidation } from '../../utils/validationConfig';
import * as TYPES from '../../action/ActionType';
import { useToast } from 'react-native-toast-notifications';
import { currencySymbol } from '../../constant/constApi';
import { commonStyles, getTopNotchStyle, getMainContainerStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type addQuotationProps = {

}

type formkeys = {
    referenceNo: string,
    quotation_date: string,
    due_date: string,
    customerId: string,
    quotation_id: string,
    bank: string,
    payment_method: string,
    notes: string,
    termsAndCondition: string,
    signatureId: string,
    sign_type: string,
    taxableAmount: string,
    discountType: string,
    discount: string,
    tax: string,
    TotalAmount: string,
    vat: string,
    totalDiscount: string,
    roundOff: string,
    isRecurring: string,
    recurringCycle: string,
    signatureName: string,
    signatureImage: string,
}

const AddQuotationScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const quotationDetails = route?.params?.quotationDetails;
    console.log("quotation details>>>>", quotationDetails)
    const [notes, setNotes] = useState('');
    const [termsCondition, setTermsCondition] = useState('');
    const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
    const [checkBox, setCheckBox] = useState(false);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [editProductModal, setEditProductModal] = useState(false);
    const [addBankDetailsModal, setAddBankDetailsModal] = useState(false);
    const [addTaxModal, setAddTaxModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [selectedDateType, setSelectedDateType] = useState<'quotation_date' | 'dueDate' | null>(null);
    const [dropdownValue, setDropdownValue] = useState<string | null>(null);
    const [paymenttype, setPaymenttype] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [isFocus1, setIsFocus1] = useState<boolean>(false);
    const [isFocusBank, setIsFocusBank] = useState<boolean>(false);
    const [dropDownBank, setDropDownBank] = useState<string | null>(null);
    const [dropDownSignature, setDropDownSignature] = useState<string | null>(null);
    const [isFocusSignature, setIsFocusSignature] = useState<boolean>(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [paymentModal, setPaymentModal] = useState<boolean>(false);
    const [addedProduct, setAddedProduct] = useState<any[]>([]);
    const [total, setTotal] = useState<any>(0);
    const [subTotal, setSubTotal] = useState<any>(0);
    const [taxTotal, setTaxTotal] = useState<any>(0);
    const [discountTotal, setDiscountTotal] = useState<any>(0);
    const [SignImage, setSignImage] = useState<any>(null);
    const [OpenSignature, SetOpenSignature] = useState<boolean>(false);
    const [quotationId, setQuotationid] = useState<string>('');
    const customerList = useSelector((state: any) => state.Reducer.customer);
    const productList = useSelector((state: any) => state.Reducer.product);
    const taxList = useSelector((state: any) => state.Reducer.tax);
    const bankList = useSelector((state: any) => state.Reducer.bank);
    const signatureList = useSelector((state: any) => state.Reducer.signature);
    const [editItem, setEditItem] = useState<any>(null);
    const toast = useToast();

    const {
        control,
        getValues,
        setValue,
        handleSubmit,
        trigger,
        reset,
        formState: { errors },
    } = useForm<formkeys>({
        defaultValues: {
            referenceNo: '',
            quotation_date: '',
            due_date: '',
            customerId: '',
            quotation_id: '',
            bank: '',
            payment_method: '',
            notes: '',
            termsAndCondition: '',
            signatureId: '',
            sign_type: '',
            taxableAmount: '',
            discountType: '',
            discount: '',
            tax: '',
            TotalAmount: '',
            vat: '',
            totalDiscount: '',
            roundOff: '',
            isRecurring: '',
            recurringCycle: '',
            signatureName: '',
            signatureImage: '',
        }
    });

    useEffect(() => {
        getAddQuotationData();
        console.log('listDataClient',);

        if (quotationDetails) {
            getEditQuotationData();
        }
    }, [])

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

    const getItemTotal = (item: any) => {
        const sellingPrice = parseFloat(item?.sellingPrice) * parseFloat(item?.quantity ?? 0);
        const discountValue = item.discountType == "3" ? parseFloat(item.discountValue) :
            (sellingPrice * parseFloat(item?.discountValue ?? 0)) / 100;
        const taxRate = parseFloat(item?.tax?.taxRate);
        const amount = sellingPrice - discountValue;
        const taxItem = (amount * taxRate) / 100;
        return amount + taxItem;
    }

    const getAddQuotationData = () => {
        if (!quotationDetails) {
            getMethod(
                ApiUrl.getQuotationId,
                success => {
                    if (success.code === 200) {
                        console.log('Successfully  getQuotationId', success.data);
                        setValue('quotation_id', success.data);
                        //removewhitespace and set value
                        setQuotationid(success.data.replace(/\s/g, ''));
                    } else {
                        console.log('Failed to getQuotationId:', success.message);
                    }
                },
                error => {
                    console.log('Error fetching getQuotationId:', error);
                }
            );
        }
    }

    const getEditQuotationData = () => {
        console.log('quotationDetails>>>>>>>>>', quotationDetails);

        setQuotationid(quotationDetails?.quotation_id)
        console.log('quotationDetails', quotationDetails?.customerId?.name);

        handleDropdownChange(quotationDetails.customerInfo)
        setValue('referenceNo', quotationDetails?.referenceNo)
        setValue('quotation_date', moment(quotationDetails?.quotation_date).format('YYYY-MM-DD'))
        setValue('due_date', moment(quotationDetails?.due_date).format('YYYY-MM-DD'))
        setValue('payment_method', quotationDetails?.paymentMode)
        setDropDownBank(bankList.find((bank: any) => bank._id === quotationDetails?.bank)?.bankName ?? '');
        setValue('bank', quotationDetails?.bank);
        const parsedItems = quotationDetails.items.map((item: { taxInfo: string }) => {
            item.sellingPrice = parseFloat(item.rate);
            item.discountValue = parseFloat(item.discount);
            item._id = item.productId;
            item.taxInfo = productList.find((product: any) => product._id === item.productId)?.tax;
            item.tax = productList.find((product: any) => product._id === item.productId)?.tax;
            item.discountType = productList.find((product: any) => product._id === item.productId)?.discountType;
            return item;
        });

        setValue('notes', quotationDetails?.notes)
        setNotes(quotationDetails?.notes)
        setTermsCondition(quotationDetails?.termsAndCondition)
        setValue('sign_type', quotationDetails?.sign_type == 'manualSignature' ? "manualSignature" : "eSignature")
        setValue('quotation_id', quotationDetails?.quotation_id)
        setValue('termsAndCondition', quotationDetails?.termsAndCondition)
        setValue('taxableAmount', quotationDetails?.tax)
        setValue('TotalAmount', quotationDetails?.TotalAmount)
        setValue('vat', quotationDetails?.vat)
        setValue('totalDiscount', quotationDetails?.totalDiscount)
        setValue('roundOff', quotationDetails?.roundOff)
        setValue('isRecurring', quotationDetails?.isRecurring)
        setValue('recurringCycle', quotationDetails?.recurringCycle)
        setTaxTotal(Number(quotationDetails?.vat))
        setDiscountTotal(Number(quotationDetails?.totalDiscount))
        setTotal(Number(quotationDetails?.taxableAmount))
        handleDropdownSignature(quotationDetails?.signatureId)
        if (quotationDetails?.sign_type == 'eSignature') {
            setValue('signatureName', quotationDetails?.signatureName)
            setSignImage(quotationDetails?.signatureImage)
        }
        setAddedProduct(parsedItems);
        setSelectedSignature(quotationDetails?.sign_type == 'manualSignature' ? "Manual Signature" : "E-Signature")
    }

    const handleDropdownChange = (item: { name: string, id: number, _id: string }) => {
        console.log('item>>>', item);
        // setDropdownValue(item.name);
        // setValue('customerId', item?._id);
        {
            quotationDetails ? setDropdownValue(quotationDetails?.customerId?.name) : setDropdownValue(item.name);
        }

        {
            quotationDetails ? setValue('customerId', quotationDetails?.customerId?._id) : setValue('customerId', item._id);
        }
        setIsDropdownVisible(false);
    };

    const handleDropdownSignature = (item: {
        signatureName: string; name: string, _id: string, signatureImage: string
    }) => {
        console.log('item in dropdown signatire', item);
        setSignImage(item?.signatureImage);
        setDropDownSignature(item?.name ?? item?.signatureName);
        setValue('signatureId', item?._id);
        setIsFocusSignature(false);
    };

    const openModal = () => {
        setAddBankDetailsModal(true);
    };

    const handleSignatureSelect = (status: string) => {
        setValue('sign_type', status == "Manual Signature" ? "manualSignature" : "eSignature");
        setSelectedSignature(status);
        if (status !== "Manual Signature") {
            SetOpenSignature(true);
        }
    };

    const handleSaveBtnClick = async () => {
        setIsActiveBtn(true);

        const isValid = await trigger();
        console.log('Validation result:', isValid);

        if (!isValid) {
            console.log('Validation errors:', errors);
            toast.show("Please fill all mandatory fields'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        if (!dropdownValue || !dropDownBank || !selectedSignature) {
            toast.show("Please fill all mandatory fields'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        setValue(
            'TotalAmount',
            checkBox
                ? Math.round((total || 0) - (discountTotal || 0) + (taxTotal || 0))
                : (total || 0) - (discountTotal || 0) + (taxTotal || 0)
        );
        setValue('isRecurring', 'false');
        setValue('roundOff', checkBox ? 'true' : 'false');
        // setValue('notes', notes || '');
        // setValue('termsAndCondition', termsCondition || '');
        setValue('vat', taxTotal || 0);
        setValue('taxableAmount', total || 0);
        setValue('totalDiscount', discountTotal || 0);

        console.log('Form Values:', getValues());
        console.log('Dropdown Values:', { dropdownValue, dropDownBank, selectedSignature });
        console.log('Added Products:', addedProduct);

        const formData = convertToFormData(getValues(), addedProduct);
        console.log('Form Data:', formData);

        if (formData && formData instanceof FormData) {
            if (!quotationDetails) {
                AddQuotationData(formData, navigation);
            } else {
                UpdateQuotationData(formData, quotationDetails?._id, navigation);
            }
        } else {
            toast.show("Error processing the form. Please try again.", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
        }
    };


    const handleCancelBtnClick = () => {
        navigation.goBack();
    };

    const openTaxModal = (item: object) => {
        setAddTaxModal(true);
        setEditItem(item);
    };

    const handleCheckBox = () => {
        setCheckBox(!checkBox);
    }

    const openEditProductModal = () => {
        setEditProductModal(true);
    };

    const formKeys = {
        referenceNumber: 'referenceNumber',
        invoiceDate: 'invoiceDate',
        dueDate: 'dueDate',
        customerName: 'customerName',
        selectBank: 'selectBank',
        paymentMethod: 'paymentMethod',
        selectSignature: 'selectSignature',
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

    const closeModal = () => {
        getMethod(
            ApiUrl.dropDownBank,
            success => {
                if (success.code === 200) {
                    dispatch({ type: TYPES.BANK_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get Bank list:', success.message);
                    toast.show("unable to fetch bank list'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                toast.show("unable to fetch bank list", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                //console.log('Error fetching Bank list:', error);
            }
        );
        setAddBankDetailsModal(false);
        setEditProductModal(false);
        setAddTaxModal(false);
    };

    const closeBankModal = () => {

        setAddBankDetailsModal(false);
        setEditProductModal(false);
        setAddTaxModal(false);
    }

    const deleteItem = (item: any) => {
        if (quotationDetails) {
            const data = addedProduct.filter((i: any) => i.productId !== item.productId);
            setAddedProduct(data);
            return
        }
        else {
            const data = addedProduct.filter((i: any) => i._id !== item._id);
            setAddedProduct(data);
        }
    }

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
    const renderItem = ({ item }: { item: any }) => (
        console.log('item', item),

        <View style={[{ backgroundColor: colors.greyOne, borderRadius: 8, width: '100%' }, mb5]}>
            <View style={[flexRow, justifyBetween, m10]}>
                <Text style={[commonStyles.h18BlackOne700,{}]}>{productList.find((i: any) => i._id === (item?.productId ?? item?._id))?.name}</Text>
                <Text style={[commonStyles.h18BlackOne700,{}]}>{currencySymbol}{getItemTotal(item).toFixed(2)}</Text>
            </View>
            <View style={[alignItemCenter]}>
                <DashedLine height={300} color={colors.greyTwo} dashLength={10} dashGap={0} />
            </View>
            <View style={[flexRow, alignItemCenter, justifyBetween]}>
                <View style={[p10]}>
                    <Text style={[commonStyles.h12blackTwo600]}>Qty*Rate</Text>
                    <Text style={[commonStyles.h12blackTwo600,mt5]}>Discount & Tax</Text>
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
        </View >
    );

    const handleDateConfirm = (date: any) => {
        const formattedDate = date.dateString || new Date(date.date).toISOString().split('T')[0];
        if (selectedDateType === 'quotation_date') {
            setValue('quotation_date', formattedDate);
        } else if (selectedDateType === 'dueDate') {
            setValue('due_date', formattedDate);
        }
        setShowDatePicker(false);
    };

    const handleDateCancel = () => {
        setShowDatePicker(false);
    };

    const handleDropdownBank = (item: { bankName: string, _id: string }) => {
        //console.log('item bank issue', item);
        setDropDownBank(item.bankName);
        setValue('bank', item._id);
        setIsFocusBank(false);
    };

    const addSaveSignature = (data: any) => {
        SetOpenSignature(false);
        setSignImage(data)
        setValue('signatureImage', data)
    }

    const showDatePickerModal = (type: 'quotation_date' | 'dueDate') => {
        setSelectedDateType(type);
        setShowDatePicker(true);
    };

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
                                date={selectedDateType == 'quotation_date' ? true : undefined}
                                minDate={selectedDateType == 'quotation_date' ? undefined : true}
                            />
                            <View style={[flex1, mt10, mh10]}>
                                <TopHeader headerText={labels.addQuotations} searchIcon={false} />
                                <View style={[commonStyles.smallCard,mv10]}>
                                   <Text style={[commonStyles.h12RedTwo500,mh10]} >Quotation Id : {quotationId}</Text>
                                </View>
                                <View style={[flexRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                       <Text style={[commonStyles.h14blackOne600,mv5]} >{'Customer Name'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <TouchableOpacity style={{}} onPress={() => navigation.navigate(screenName.AddCustomersScreen as never)}>
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

                                <View style={[flexRow, justifyBetween]}>
                                    <View>
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{'Quotation Date'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => showDatePickerModal('quotation_date')} style={[styles.input, flexRow, { width: 160 }]}>
                                            <Controller
                                                name={'quotation_date'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.quotationDate}
                                                        value={value}
                                                        textColor={colors.black}
                                                        onChangeText={onChange}
                                                        // error={errors['quotation_date']?.message}
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
                                        {errors.quotation_date && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.quotation_date.message}
                                            </Text>
                                        )}
                                    </View>
                                    <View>
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{'Validity'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => showDatePickerModal('dueDate')} style={[styles.input, flexRow, { width: 160 }]} >
                                            <Controller
                                                name={'due_date'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={'Validity'}
                                                        value={value}
                                                        textColor={colors.black}
                                                        onChangeText={onChange}
                                                        // error={errors['due_date']?.message}
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
                                        {errors.due_date && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.due_date.message}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                {
                                    addedProduct && addedProduct.length > 0 ? (
                                        //console.log(addedProduct, "addproductrs"),

                                        <View style={[mt10]}>
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
                                        <CustomNavigateBox name='Add Product' label={labels.products} onNavigate={() => (navigation as any).navigate(screenName.ProductScreen, {
                                            fromScreen: labels.invoice,
                                            listData: productList.filter(
                                                (item: any) => !addedProduct.some((i: any) => i._id === item._id)
                                            ),
                                            handlereturnData: handlereturnData,
                                        } as any)} color={colors.primary} />
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
                                        name="termsAndCondition"
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
                                                error={errors['termsAndCondition']?.message}
                                            />
                                        )}
                                        rules={{
                                            required: 'Terms Conditions is required',
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
                                                    <Text style={[commonStyles.h14blackTwo500,mr5]}>Round Off</Text>
                                                    <MultiSelectOption selectedColor={colors.primary} unselectedColor={colors.danger} isSelected={checkBox} onSelect={handleCheckBox} />
                                                </View>
                                                <Text style={[commonStyles.h14blackTwo500]}>
                                                    {currencySymbol}{checkBox
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
                                                    {currencySymbol}{checkBox
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
                                {selectedSignature && (<>

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
                                                        required: 'signature Name is required',
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
                                                        error={errors['signatureName']?.message}
                                                        maxLength={30}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('signatureName'),
                                                }}
                                            />
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
                                </>)}
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
                        <CustomModal children={<AddBankDetails onSave={closeBankModal} onCancel={closeModal} />} visible={addBankDetailsModal} onClose={closeModal} height={'80%'} />
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
        // paddingHorizontal: 15,
        // paddingBottom: 20,
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

export default AddQuotationScreen;