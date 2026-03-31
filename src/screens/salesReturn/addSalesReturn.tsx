import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import {
  CustomNavigateBox,
  CustomTextInputField,
  MultiLineTextBox,
  MultiSelectOption,
  RadioBtn,
  TopHeader,
} from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { addedProductData } from '../../utils/data/invoiceData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import {
  alignItemCenter,
  alignSelfCenter,
  flex1,
  flexRow,
  justifyBetween,
  justifyCenter,
  justifyStart,
  m10,
  mb5,
  mh10,
  mh15,
  ml10,
  ml15,
  mr5,
  mt10,
  mt15,
  mt5,
  mv10,
  mv15,
  mv5,
  p10,
} from '../../utils/theme/commonStyles';
import {
  AddBankDetails,
  AddSignature,
  AddTax,
} from '../settings/settingsComponent';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { useSelector } from 'react-redux';
import { CommonDatePicker } from '../../components/CommonDatePicker';
import moment from 'moment';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { CustomTextInput } from '../../components/commonInputFields';
import {
  CalculateDiscount,
  CalculatePrice,
  CalculateTaxTotal,
  CalculationTotal,
} from '../../utils/Calculation';
import { convertToFormData } from '../../utils/FormDataFunc';
import {
  AddSalesReturnData,
  UpdateSalesReturnData,
} from '../../userCall/ApiUser';
import { requiredValidation } from '../../utils/validationConfig';
import { useToast } from 'react-native-toast-notifications';
import { currencySymbol } from '../../constant/constApi';
import { commonStyles, getTopNotchStyle, getMainContainerStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type addSalesReturnProps = {};
type formkeys = {
  referenceNo: string;
  credit_note_date: string;
  due_date: string;
  customerId: string;
  credit_note_id: string;
  bank: string;
  payment_method: string;
  notes: string;
  termsAndCondition: string;
  signatureId: string;
  sign_type: string;
  taxableAmount: string;
  discountType: string;
  discount: string;
  tax: string;
  TotalAmount: string;
  vat: string;
  totalDiscount: string;
  roundOff: string;
  isRecurring: string;
  recurringCycle: string;
  signatureName: string;
  signatureImage: string;
};
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  isDeleted: boolean;
  __v: number;
}

export interface Unit {
  _id: string;
  id: string;
  name: string;
  symbol: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  isDeleted: boolean;
  __v: number;
}

export interface Tax {
  _id: string;
  name: string;
  taxRate: string;
  status: boolean;
  type: string;
  userId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id: string;
  type: string;
  name: string;
  sku: string;
  category: Category;
  sellingPrice: number;
  purchasePrice: number;
  discountValue: number;
  units: Unit;
  discountType: string;
  barcode: string;
  alertQuantity: number;
  tax: Tax;
  productDescription: string;
  images: string[];
  userId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  quantity: number;
}

const AddSalesReturn = ({ route }: any) => {
  const { isAddedProductAvailable, salesReturnData } = route.params;
  const navigation = useNavigation();
  const [termsCondition, setTermsCondition] = useState('');
  const [selectedSignature, setSelectedSignature] = useState<string | null>('');
  const [checkBox, setCheckBox] = useState(false);
  const [isActiveBtn, setIsActiveBtn] = useState(false);
  const [notes, setNotes] = useState('');
  const [addBankDetailsModal, setAddBankDetailsModal] = useState(false);
  const [addTaxModal, setAddTaxModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDateType, setSelectedDateType] = useState<
    'creditDate' | 'dueDate' | null
  >(null);
  const [dropdownValue, setDropdownValue] = useState<string | null>(null);
  const [paymenttype, setPaymenttype] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isFocus1, setIsFocus1] = useState<boolean>(false);
  const [isFocusBank, setIsFocusBank] = useState<boolean>(false);
  const [dropDownBank, setDropDownBank] = useState<string | null>(null);
  const [dropDownSignature, setDropDownSignature] = useState<string | null>(
    null,
  );
  const [isFocusSignature, setIsFocusSignature] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [paymentModal, setPaymentModal] = useState<boolean>(false);
  const [addedProduct, setAddedProduct] = useState<any[]>([]);
  const [total, setTotal] = useState<any>(0);
  const [taxTotal, setTaxTotal] = useState<any>(0);
  const [discountTotal, setDiscountTotal] = useState<any>(0);
  const [SignImage, setSignImage] = useState<any>(null);
  const [OpenSignature, SetOpenSignature] = useState<boolean>(false);
  const [creditNoteId, setCreditNoteid] = useState<string>('');
  const customerList = useSelector((state: any) => state.Reducer.customer);
  const productList = useSelector((state: any) => state.Reducer.product);
  const taxList = useSelector((state: any) => state.Reducer.tax);
  const bankList = useSelector((state: any) => state.Reducer.bank);
  const signatureList = useSelector((state: any) => state.Reducer.signature);
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
      credit_note_date: '',
      due_date: '',
      customerId: '',
      credit_note_id: '',
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
    },
  });
  useEffect(() => {
    getAddInvoiceData();
    console.log('listDataClient', salesReturnData ?? '');

    if (salesReturnData) {
      getEditInvoiceData();
    }
  }, []);

  const getAddInvoiceData = () => {
    if (!salesReturnData) {
      getMethod(
        ApiUrl.getCreditNoteNumber,
        success => {
          if (success.code === 200) {
            console.log('Successfully got CreditNote Number', success.data);
            setValue('credit_note_id', success.data);
            //removewhitespace and set value
            setCreditNoteid(success.data.replace(/\s/g, ''));
          } else {
            console.log('Failed to get CreditNote Number:', success.message);
          }
        },
        error => {
          console.log('Error fetching CreditNote Number:', error);
        },
      );
    }
  };

  const getEditInvoiceData = () => {
    console.log('invoiceDetails>>>>>>>>>', salesReturnData);

    setCreditNoteid(salesReturnData?.credit_note_id);
    console.log('salesReturnData', salesReturnData?.customerId?.name);

    handleDropdownChange(salesReturnData.customerInfo);
    setValue('referenceNo', salesReturnData?.referenceNo);
    setValue(
      'credit_note_date',
      moment(salesReturnData?.credit_note_date).format('YYYY-MM-DD'),
    );
    setValue(
      'due_date',
      moment(salesReturnData?.due_date).format('YYYY-MM-DD'),
    );
    setValue('payment_method', salesReturnData?.paymentMode);
    setPaymenttype(salesReturnData?.payment_method);
    setDropDownBank(salesReturnData?.bankName);
    setDropDownBank(bankList.find((bank: any) => bank._id === salesReturnData?.bank)?.bankName ?? '');
    setValue('bank', salesReturnData?.bank);
    const parsedItems = salesReturnData.items.map((item: { taxInfo: string }) => {
      item.sellingPrice = parseFloat(item.rate);
      item.discountValue = parseFloat(item.discount);
      item._id = item.productId;
      item.taxInfo = productList.find((product: any) => product._id === item.productId)?.tax;
      item.tax = productList.find((product: any) => product._id === item.productId)?.tax;
      item.discountType = productList.find((product: any) => product._id === item.productId)?.discountType;
      return item;
    });

    setValue('notes', salesReturnData?.notes);
    setNotes(salesReturnData?.notes);
    setTermsCondition(salesReturnData?.termsAndCondition);
    setValue(
      'sign_type',
      salesReturnData?.sign_type == 'manualSignature'
        ? 'manualSignature'
        : 'eSignature',
    );
    setValue('notes', salesReturnData?.notes ?? '');
    setNotes(salesReturnData?.notes ?? "");
    setValue('credit_note_id', salesReturnData?.credit_note_id);
    setValue('termsAndCondition', salesReturnData?.termsAndCondition);
    setValue('taxableAmount', salesReturnData?.tax);
    setValue('TotalAmount', salesReturnData?.TotalAmount);
    setValue('vat', salesReturnData?.vat);
    setValue('totalDiscount', salesReturnData?.totalDiscount);
    setValue('roundOff', salesReturnData?.roundOff);
    setValue('isRecurring', salesReturnData?.isRecurring);
    setValue('recurringCycle', salesReturnData?.recurringCycle);
    setTaxTotal(Number(salesReturnData?.vat));
    setDiscountTotal(Number(salesReturnData?.totalDiscount));
    setTotal(Number(salesReturnData?.taxableAmount));
    handleDropdownSignature(salesReturnData?.signatureId);
    setSignImage(salesReturnData?.signatureImage);
    if (salesReturnData?.sign_type != 'manualSignature')
      setValue('signatureName', salesReturnData?.signatureName);
    setSelectedSignature(
      salesReturnData?.sign_type == 'manualSignature'
        ? 'Manual Signature'
        : 'E-Signature',
    );
    setAddedProduct(parsedItems);
  };

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


  const handleSignatureSelect = (status: string) => {
    setValue(
      'sign_type',
      status == 'Manual Signature' ? 'manualSignature' : 'eSignature',
    );
    setSelectedSignature(status);
    if (status !== 'Manual Signature') {
      SetOpenSignature(true);
    }
  };

  const handleSaveBtnClick = async () => {
    setIsActiveBtn(true);
    const isValid = await trigger();
    if (!isValid) {
      toast.show("Please fill all mandatory fields", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
      return;

    }
    else if (!dropdownValue || !dropDownBank || !selectedSignature) {
      toast.show("Please fill all mandatory fields", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
      return;
    }
    setIsActiveBtn(true);
    setValue('TotalAmount', checkBox ? Math.round(total - discountTotal + taxTotal) : total - discountTotal + taxTotal);
    setValue('isRecurring', 'false');
    setValue('roundOff', checkBox ? 'true' : 'false');
    // setValue('notes', notes);
    // setValue('termsAndCondition', termsCondition);
    setValue('vat', taxTotal);
    setValue('taxableAmount', total);
    setValue('totalDiscount', discountTotal);
    const formData = convertToFormData(getValues(), addedProduct);
    console.log('formdata from sales', formData)
    if (formData && !salesReturnData && formData instanceof FormData) {
      AddSalesReturnData(formData, navigation);
      return;
    } else {
      UpdateSalesReturnData(formData, salesReturnData?._id, navigation);
      return;
    }
    // navigation.navigate(screenName.SalesReturnDetails as never)
  };
  const handleCancelBtnClick = () => {
    navigation.goBack();
  };

  const handleCheckBox = () => {
    setCheckBox(!checkBox);
  };

  const openModal = () => {
    setAddBankDetailsModal(true);
  };
  const openTaxModal = (item: object) => {
    setAddTaxModal(true);
    setEditItem(item);
  };

  const closeModal = () => {
    setAddBankDetailsModal(false);
    setAddTaxModal(false);
    SetOpenSignature(false);
  };

  const addSaveBtn = () => {
    closeModal();
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

  const addSaveSignature = (data: any) => {
    SetOpenSignature(false);
    setSignImage(data);
    setValue('signatureImage', data);
  };

  const handleDateConfirm = (date: any) => {
    const formattedDate =
      date.dateString || new Date(date.date).toISOString().split('T')[0];
    if (selectedDateType === 'creditDate') {
      setValue('credit_note_date', formattedDate);
    } else if (selectedDateType === 'dueDate') {
      setValue('due_date', formattedDate);
    }
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };
  const showDatePickerModal = (type: 'creditDate' | 'dueDate') => {
    setSelectedDateType(type);
    setShowDatePicker(true);
  };

  const handleDropdownChange = (item: {
    name: string;
    id: number;
    _id: string;
  }) => {
    console.log('item', item);
    setDropdownValue(item.name);
    setValue('customerId', item._id);
    setIsDropdownVisible(false);
  };


  const handleDropdownBank = (item: { bankName: string; _id: string }) => {
    console.log('item', item);
    setDropDownBank(item?.bankName);
    setValue('bank', item?._id);
    setIsFocusBank(false);
  };

  const handleDropdownSignature = (item: {
    signatureName: string;
    name: string;
    _id: string;
    signatureImage: string;
  }) => {
    console.log('item in dropdown signatire', item);
    setSignImage(item?.signatureImage);
    setDropDownSignature(item?.name ?? item?.signatureName);
    setValue('signatureId', item?._id);
    setIsFocusSignature(false);
  };

  const signature = [
    {
      id: 1,
      name: 'Manual Signature',
    },
    {
      id: 2,
      name: 'E-Signature',
    },
  ];

  const paymentMethodList = [
    {
      id: 1,
      name: 'Cash',
    },
    {
      id: 2,
      name: 'Bank',
    },
    {
      id: 3,
      name: 'Cheque',
    },
    {
      id: 4,
      name: 'Online',
    },
  ];

  const deleteItem = (item: any) => {
    if (salesReturnData) {
      const data = addedProduct.filter((i: any) => i.productId !== item.productId);
      setAddedProduct(data);
      return;
    } else {
      const data = addedProduct.filter((i: any) => i._id !== item._id);
      setAddedProduct(data);
    }
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
    <View style={[{ backgroundColor: colors.greyOne, borderRadius: 8, width: '100%' }, mb5]}>
      <View style={[flexRow, justifyBetween, m10]}>
        <Text style={[commonStyles.h18BlackOne700,{}]}>{productList.find((i: any) => i._id === item?.productId)?.name}</Text>
        <Text style={[commonStyles.h18BlackOne700,{}]}>{currencySymbol}{getItemTotal(item).toFixed(2)}</Text>
      </View>
      <View style={[alignItemCenter]}>
        <DashedLine
          height={300}
          color={colors.greyTwo}
          dashLength={10}
          dashGap={0}
        />
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


  return (
    <Fragment>
      <SafeAreaView style={getTopNotchStyle(true)} />

      <SafeAreaView style={getMainContainerStyle(false)}>
        <View style={[flex1]}>

          <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
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
                <View style={mv15}>
                  <TopHeader headerText={salesReturnData ? labels.editSalesReturn : labels.addSalesReturn} />
                  <View style={[commonStyles.smallCard,mv10]} >
                   <Text style={[commonStyles.h12RedTwo500,mh10]} >
                      Sales Return ID : #{creditNoteId}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    flexRow,
                    { flexDirection: 'row', justifyContent: 'space-between' },
                  ]}>
                  <View style={{ flexDirection: 'row' }}>
                   <Text style={[commonStyles.h14blackOne600,mv5]} >{'Customer'}</Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  <TouchableOpacity
                    style={{}}
                    onPress={() =>
                      navigation.navigate(screenName.AddCustomersScreen as never)
                    }>
                    <Text style={{ color: colors.primary }}>Add New</Text>
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
                        placeholder={labels.select}
                      />
                    )}
                    rules={{
                      required: 'Customer Name is required',
                    }}
                  />
                </View>
                {errors.customerId && (
                  <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                    {errors.customerId.message}
                  </Text>
                )}
                <View style={[flexRow, mt10]}>
                 <Text style={[commonStyles.h14blackOne600,mv5]} >
                    {'Sales Return Date'}
                  </Text>
                  <Text style={[commonStyles.h14Danger400]}> *</Text>
                </View>
                <TouchableOpacity
                  onPress={() => showDatePickerModal('creditDate')}
                  style={[styles.input, flexRow]}>
                  <Controller
                    name={'credit_note_date'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomTextInput
                        placeholder={labels.selectDate}
                        value={value}
                        onChangeText={onChange}
                        // error={errors['credit_note_date']?.message}
                        editable={false}
                      />
                    )}
                    rules={{
                      required: 'Sales return Date is required'
                    }}
                  />
                  <View style={[alignSelfCenter]}>
                    <CustomIcon
                      name="calendar"
                      size={16}
                      color={colors.grey}
                      type="Feather"
                    />
                  </View>
                </TouchableOpacity>
                {errors.credit_note_date && (
                  <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                    {errors.credit_note_date.message}
                  </Text>
                )}
                <View style={[flexRow, mt10]}>
                 <Text style={[commonStyles.h14blackOne600,mv5]} >
                    {'Due Date'}
                  </Text>
                  <Text style={[commonStyles.h14Danger400]}> *</Text>
                </View>
                <TouchableOpacity
                  onPress={() => showDatePickerModal('dueDate')}
                  style={[styles.input, flexRow]}>
                  <Controller
                    name={'due_date'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomTextInput
                        placeholder={labels.selectDate}
                        value={value}
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
                    <CustomIcon
                      name="calendar"
                      size={16}
                      color={colors.grey}
                      type="Feather"
                    />
                  </View>
                </TouchableOpacity>
                {errors.due_date && (
                  <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                    {errors.due_date.message}
                  </Text>
                )}
                {addedProduct && addedProduct.length > 0 ? (
                  <View>
                    <View style={flexRow}>
                     <Text style={[commonStyles.h14blackOne600,mv5]} >
                        {labels.products}
                      </Text>
                      <Text style={[commonStyles.h14Danger400]}>*</Text>
                    </View>
                    <View
                      style={[
                        {
                          borderWidth: 1,
                          borderColor: colors.greyTwo,
                          borderRadius: 8,
                        },
                      ]}>
                      <View
                        style={[
                          flexRow,
                          justifyBetween,
                          alignItemCenter,
                          mv10,
                          mh10,
                        ]}>
                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                          <CustomIcon
                            color={colors.blackTwo}
                            name="chevron-small-up"
                            size={14}
                            type="Entypo"
                          />
                          <Text style={[commonStyles.h14BlackTwo400]}>
                            {labels.products}({addedProduct.length})
                          </Text>
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
                          }>
                          <Text style = {[commonStyles.h12Primary400]}>Add Item</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={[alignItemCenter, justifyCenter, {}]}>
                        <FlatList
                          data={addedProduct}
                          renderItem={renderItem}
                          keyExtractor={item => item?._id?.toString() ?? item?.key}
                        />
                      </View>
                      <View style={[alignItemCenter, mv10]}>
                        <DashedLine
                          height={320}
                          color={colors.greyTwo}
                          dashLength={10}
                          dashGap={5}
                        />
                      </View>

                      <View style={[flexRow, justifyBetween, m10]}>
                        <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                        <Text style={[commonStyles.h18BlackOne700,{}]}>{currencySymbol}{((Number(total) || 0) - (Number(discountTotal) || 0) + (Number(taxTotal) || 0)).toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <CustomNavigateBox
                    name="Add Product"
                    label={labels.products}
                    onNavigate={() =>
                      (navigation as any).navigate(screenName.ProductScreen, {
                        fromScreen: labels.invoice,
                        listData: productList.filter(
                          (item: any) => !addedProduct.some((i: any) => i._id === item._id)
                        ),
                        handlereturnData: handlereturnData,
                      } as any)
                    }
                    color={colors.primary}
                  />
                )}
                <View style={[flexRow, mt10]}>
                 <Text style={[commonStyles.h14blackOne600,mv5]} >
                    {'Select Bank'}
                  </Text>
                  <Text style={[commonStyles.h14Danger400]}> *</Text>
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
                  <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
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
                <View style={mv10}>
                 <Text style={commonStyles.h14blackOne600}>Invoice Summary</Text>
                  <View
                    style={[
                      {
                        // height: 165,
                        width: '100%',
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.greyTwo,
                        borderRadius: 8,
                      },
                      mv10,
                    ]}>
                    <View style={[mh10, mv10]}>
                      <View style={[flexRow, justifyBetween]}>
                        <Text style={[commonStyles.h14blackTwo500]}>Amount</Text>
                        <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{total?.toFixed(2)}</Text>
                      </View>
                      <View style={[flexRow, justifyBetween, mt10]}>
                        <Text style={[commonStyles.h14blackTwo500]}>Discount</Text>
                        <Text style={[commonStyles.h14blackTwo500]}>
                          {' '}
                          {currencySymbol}{discountTotal?.toFixed(2)}
                        </Text>
                      </View>
                      <View style={[flexRow, justifyBetween, mt10]}>
                        <Text style={[commonStyles.h14blackTwo500]}>Tax</Text>

                        <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{taxTotal?.toFixed(2)}</Text>
                      </View>
                      <View style={[flexRow, justifyBetween, alignItemCenter, mt5]}>
                        <View style={[flexRow, justifyCenter, mt10]}>
                          <Text style={[commonStyles.h14blackTwo500,mr5]} >Round Off</Text>
                          <MultiSelectOption
                            selectedColor={colors.primary}
                            unselectedColor={colors.danger}
                            isSelected={checkBox}
                            onSelect={handleCheckBox}
                          />
                        </View>
                        <Text style={[commonStyles.h14blackTwo500]}>
                          {currencySymbol}
                          {checkBox
                            ? (
                              Math.round(total - discountTotal + taxTotal) -
                              (total - discountTotal + taxTotal)
                            ).toFixed(2)
                            : '0'}
                        </Text>
                      </View>
                      <View style={[alignSelfCenter, mv10]}>
                        <DashedLine
                          height={300}
                          color={colors.greyEight}
                          dashGap={4}
                        />
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
                 <Text style={commonStyles.h14blackOne600}>Signature</Text>
                  <View style={[flexRow, justifyBetween, alignItemCenter]}>
                    {signature.map(item => {
                      return (
                        <View
                          style={[
                            flexRow,
                            mv10,
                            {
                              height: 40,
                              width: '48%',
                              borderWidth: 1,
                              borderColor:
                                selectedSignature === item.name
                                  ? colors.primary
                                  : colors.grey,
                              borderRadius: 8,
                            },
                            alignItemCenter,
                            justifyStart,
                          ]}
                          key={item.id}>
                          <View style={ml15}>
                            <RadioBtn
                              key={item.id}
                              selected={selectedSignature === item.name}
                              onPress={() => handleSignatureSelect(item.name)}
                            />
                          </View>
                          <Text
                            style={[
                              ml10,
                              {
                                color:
                                  selectedSignature === item.name
                                    ? colors.primary
                                    : colors.grey,
                              },
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                {selectedSignature && (<>

                  <View style={[flexRow, mt15]}>
                   <Text style={[commonStyles.h14blackOne600,mv5]} >
                      {'Select Signature'}
                    </Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  {selectedSignature == 'Manual Signature' ? (
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
                              placeholder={labels.select}
                            />
                          )}
                          rules={{
                            required: 'Signature is required',
                          }}
                        />

                      </View>
                      {errors.signatureId && (
                        <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                          {errors.signatureId.message}
                        </Text>
                      )}
                    </View>
                  ) : (
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
                          />
                        )}
                        rules={{
                          required: requiredValidation('signatureName'),
                        }}
                      />
                    </View>
                  )}
                  {SignImage && (
                    <View style={mv10}>
                     <Text style={commonStyles.h14blackOne600} >Signature</Text>
                      <View style={{ padding: 2, borderWidth: 1, borderRadius: 5 }}>
                        <Image
                          source={{ uri: SignImage }}
                          style={{ height: 100, width: '100%', resizeMode: 'contain' }}
                        />
                      </View>
                    </View>
                  )}
                </>)}
                <View style={[flexRow, justifyBetween, mt10]}>
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
              </View>
            </KeyboardAwareScrollView>
            <CustomModal
              children={<AddBankDetails onSave={addSaveBtn} onCancel={closeModal} />}
              visible={addBankDetailsModal}
              onClose={closeModal}
              height={'80%'}
            />
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
            <CustomModal
              children={
                <AddSignature onSave={addSaveSignature} onCancel={closeModal} />
              }
              visible={OpenSignature}
              onClose={closeModal}
              height={'70%'}
            />
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

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

export default AddSalesReturn;