import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ToastAndroid,
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
import { addedProductData, productsData } from '../../utils/data/invoiceData';
import { DevWidth } from '../../utils/device';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import {
  alignItemCenter,
  alignItemStart,
  alignSelfCenter,
  flex1,
  flexRow,
  justifyBetween,
  justifyCenter,
  justifyStart,
  m10,
  m5,
  mb15,
  mb5,
  mh10,
  mh15,
  mh5,
  ml10,
  ml15,
  mr5,
  mt10,
  mt15,
  mt5,
  mv10,
  mv5,
  p10,
} from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import {
  AddBankDetails,
  AddSignature,
  AddTax,
} from '../settings/settingsComponent';
import { getMethod, postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { CustomTextInput } from '../../components/commonInputFields';
import { requiredValidation } from '../../utils/validationConfig';
import { CommonDatePicker } from '../../components/CommonDatePicker';
import { Dropdown } from 'react-native-element-dropdown';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import {
  CalculateDiscount,
  CalculatePrice,
  CalculateTaxTotal,
  CalculationTotal,
} from '../../utils/Calculation';
import { convertToFormData } from '../../utils/FormDataFunc';
import { AddInvoiceData, UpdateInvoiceData } from '../../userCall/ApiUser';
import moment from 'moment';
import { astToReact } from 'react-native-svg/lib/typescript/xml';
import { useDispatch, useSelector } from 'react-redux';
import * as TYPES from '../../action/ActionType';
import { useToast } from 'react-native-toast-notifications';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { currencySymbol } from '../../constant/constApi';
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// types.ts
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
  taxInfo: any;
  discount: any;
  rate: number;
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

export interface ProductListProps {
  addedProduct: Product[];
  openTaxModal: () => void;
}

type formkeys = {
  referenceNo: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  invoiceNumber: string;
  bank: string;
  payment_method: string;
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
  signatureImage: string;
  signatureName: string;
};

const AddInvoiceScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const invoiceDetails = route && route.params && route.params.invoiceDetails;
  const CustomerName = route && route.params && route?.params?.CustomerName;
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [termsCondition, setTermsCondition] = useState<string>('');
  const [isActiveBtn, setIsActiveBtn] = useState<boolean>(false);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(
    null,
  );
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

  // const [selectedSignature, setSelectedSignature] = useState(signature[0]?.name);
  const [addBankDetailsModal, setAddBankDetailsModal] =
    useState<boolean>(false);
  const [addTaxModal, setAddTaxModal] = useState<boolean>(false);
  const [editProductModal, setEditProductModal] = useState<boolean>(false);
  const [invNo, setInvNo] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDateType, setSelectedDateType] = useState<
    'invoiceDate' | 'dueDate' | null
  >(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [paymentModal, setPaymentModal] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<string | null>(null);
  const [paymenttype, setPaymenttype] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isFocus1, setIsFocus1] = useState<boolean>(false);
  const [isFocusBank, setIsFocusBank] = useState<boolean>(false);
  const [dropDownBank, setDropDownBank] = useState<string | null>(null);
  const [dropDownSignature, setDropDownSignature] = useState<string | null>(
    null,
  );
  const [SignImage, setSignImage] = useState<string | null>(null);
  const [OpenSignature, SetOpenSignature] = useState<boolean>(false);
  const [isFocusSignature, setIsFocusSignature] = useState<boolean>(false);
  const [addedProduct, setAddedProduct] = useState<any[]>([]);
  const [total, setTotal] = useState<any>(0);
  const [editName, setEditName] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [taxTotal, setTaxTotal] = useState<any>(0);
  const [discountTotal, setDiscountTotal] = useState<any>(0);
  const listDataClient = useSelector((state: any) => state.Reducer);
  const customerList = useSelector((state: any) => state.Reducer.customer);
  const productList = useSelector((state: any) => state.Reducer.product);
  console.log("product lists from invoice", productList)
  const taxList = useSelector((state: any) => state.Reducer.tax);
  const bankList = useSelector((state: any) => state.Reducer.bank);
  const signatureList = useSelector((state: any) => state.Reducer.signature);
  const isFocused = useIsFocused();
  const toast = useToast();

  useEffect(() => {
    if (isFocused) {
      getAddInvoiceData();
      console.log('listDataClient', listDataClient);

      if (invoiceDetails) {
        getEditInvoiceData();
      }
      if (CustomerName) {
        handleDropdownChange(CustomerName);
        setEditName(true);
      }
    }
  }, [isFocused]);
  useEffect(() => {
    doCalculation();
  }, [addedProduct])

  const getEditInvoiceData = () => {
    setInvNo(invoiceDetails?.invoiceNumber.replace(/\s+/g, ''));
    console.log('invoiceDetails', invoiceDetails);

    handleDropdownChange(invoiceDetails.customerId);
    setValue('referenceNo', invoiceDetails?.referenceNo);
    setValue(
      'invoiceDate',
      moment(invoiceDetails?.invoiceDate).format('YYYY-MM-DD'),
    );
    setValue('dueDate', moment(invoiceDetails?.dueDate).format('YYYY-MM-DD'));
    setValue('payment_method', invoiceDetails?.payment_method);
    setPaymenttype(invoiceDetails?.payment_method);
    setDropDownBank(invoiceDetails?.bank?.bankName);
    setValue('bank', invoiceDetails?.bank?._id);
    const parsedItems = invoiceDetails.items.map((item: { taxInfo: string }) => {
      item.sellingPrice = parseFloat(item.rate);
      item.discountValue = parseFloat(item.discount);
      item._id = item.productId;
      if (typeof item.taxInfo === 'string') {
        try {
          item.tax = JSON.parse(item.taxInfo);
          item.taxInfo = JSON.parse(item.taxInfo);
        } catch (error) {
          console.error('Error parsing taxInfo:', error);
        }
      }
      return item;
    });
    console.log('parsedItems', parsedItems);

    setValue('notes', invoiceDetails?.notes ?? '');
    setNotes(invoiceDetails?.notes ?? "");
    setTermsCondition(invoiceDetails?.terms_conditions);
    setValue(
      'sign_type',
      invoiceDetails?.sign_type == 'manualSignature'
        ? 'manualSignature'
        : 'eSignature',
    );
    setValue('invoiceNumber', invoiceDetails?.invoiceNumber);
    setValue('terms_conditions', invoiceDetails?.terms_conditions ?? "");
    setValue('taxableAmount', invoiceDetails?.tax);
    setValue('TotalAmount', invoiceDetails?.TotalAmount);
    setValue('vat', invoiceDetails?.vat);
    setValue('totalDiscount', invoiceDetails?.totalDiscount);
    setValue('roundOff', invoiceDetails?.roundOff);
    setValue('isRecurring', invoiceDetails?.isRecurring);
    setValue('recurringCycle', invoiceDetails?.recurringCycle);
    setValue('signatureName', invoiceDetails?.signatureName);
    setValue('signatureImage', invoiceDetails?.signatureImage);
    setTaxTotal(Number(invoiceDetails?.vat));
    setDiscountTotal(Number(invoiceDetails?.totalDiscount));
    setTotal(Number(invoiceDetails?.taxableAmount));
    handleDropdownSignature(invoiceDetails?.signatureId);
    setSelectedSignature(
      invoiceDetails?.sign_type == 'manualSignature'
        ? 'Manual Signature'
        : 'E-Signature',
    );
    setSignImage(invoiceDetails?.signatureImage);
    setAddedProduct(parsedItems);
  };

  const getAddInvoiceData = () => {
    if (!invoiceDetails) {
      getMethod(
        ApiUrl.getInvoiceNumber,
        success => {
          if (success.code === 200) {
            console.log('Successfully got Invoice Number', success.data);
            setValue('invoiceNumber', success.data);
            //removewhitespace and set value
            setInvNo(success.data.replace(/\s/g, ''));
          } else {
            console.log('Failed to get Invoice Number:', success.message);
          }
        },
        error => {
          console.log('Error fetching Invoice Number:', error);
        },
      );
    }
  };

  const handleDateConfirm = (date: any) => {
    const formattedDate =
      date.dateString || new Date(date.date).toISOString().split('T')[0];
    if (selectedDateType === 'invoiceDate') {
      setValue('invoiceDate', formattedDate);
    } else if (selectedDateType === 'dueDate') {
      setValue('dueDate', formattedDate);
    }
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const showDatePickerModal = (type: 'invoiceDate' | 'dueDate') => {
    setSelectedDateType(type);
    setShowDatePicker(true);
  };

  const handleDropdownChange = (item: {
    name: string;
    id: number;
    _id: string;
  }) => {
    setDropdownValue(item.name);
    setValue('customerId', item._id);
    setIsDropdownVisible(false);
  };

  const handlePaymentDropdownChange = (item: { name: string }) => {
    setPaymenttype(item.name);
    setValue('payment_method', item.name);
    setPaymentModal(false);
  };

  const handleDropdownBank = (item: { bankName: string; _id: string }) => {
    setDropDownBank(item.bankName);
    setValue('bank', item._id);
    setIsFocusBank(false);
  };

  const handleDropdownSignature = (item: {
    signatureName: string;
    name: string;
    _id: string;
    signatureImage: string;
  }) => {
    if (typeof item === 'string') {
      setSignImage('');
      return;
    }
    setSignImage(item?.signatureImage);
    setDropDownSignature(item?.name ?? item?.signatureName);
    setValue('signatureId', item?._id);
    setValue('signatureImage', '')
    setIsFocusSignature(false);
  };

  const handleSaveBtnClick = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.show("Please fill all mandatory fields", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
      return;
    } else if (!dropdownValue || !dropDownBank || !selectedSignature) {
      toast.show("Please fill all mandatory fields", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
      return;
    }
    setValue(
      'TotalAmount',
      checkBox
        ? Math.round(total - discountTotal + taxTotal)
        : total - discountTotal + taxTotal,
    );
    setValue('isRecurring', 'false');
    setValue('roundOff', checkBox ? 'true' : 'false');
    // setValue('notes', notes ?? "");
    // setValue('terms_conditions', termsCondition);
    setValue('vat', taxTotal);
    setValue('taxableAmount', total);
    setValue('totalDiscount', discountTotal);
    console.log('values', getValues());
    const formData = convertToFormData(getValues(), addedProduct);
    console.log("formdata values form add vendor", formData)
    // return;
    doChangeSpinnerFlag(true);
    if (formData && !invoiceDetails && formData instanceof FormData) {
      try {
        postMethod(
          ApiUrl.addInvoice,
          formData,
          (success: { code: number; message: any; }) => {
            doChangeSpinnerFlag(false);
            if (success.code === 200) {
              console.log('Successfully Data expense', success);
              navigation.goBack();
              toast.show("Added Invoice Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            } else {
              console.log('Failed Data expense', success);
              toast.show("Failed to add Invoice", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
          },
          error => {
            doChangeSpinnerFlag(false);
            console.log('Error Adding Invoice:', error);
            if (error.data.message === 'request.items is not iterable') {
              toast.show("Please Add Items", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
              return
            }
            toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
          }
        );
      }
      catch (error) {
        doChangeSpinnerFlag(false);
        console.log('Error Adding Invoice:', error);
      }
      return;
    } else {
      // UpdateInvoiceData(formData, invoiceDetails?._id, navigation);
      try {
        putMethod(
          ApiUrl.updateInvoice + invoiceDetails?._id,
          formData,
          (success: { code: number; message: any; }) => {
            doChangeSpinnerFlag(false);
            if (success.code === 200) {
              console.log('Successfully UpdateInvoiceData', success);
              navigation.goBack();
              toast.show("Updated Invoice Successfully'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            } else {
              console.log('Failed UpdateInvoiceData', success);
              toast.show("Failed to Update Invoice'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
          },
          (error: any) => {
            doChangeSpinnerFlag(false);
            console.log('Error UpdateInvoiceData1:', JSON.stringify(error));
            // toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
          }
        );
      }
      catch (error: any) {
        doChangeSpinnerFlag(false);
        console.log('Error UpdateInvoiceData2:', error);
        // toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
      }
      return;
    }
  };

  const handleCancelBtnClick = () => {
    navigation.goBack();
  };

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

  const openModal = () => {
    setAddBankDetailsModal(true);
  };
  const openTaxModal = (item: object) => {
    setAddTaxModal(true);
    setEditItem(item);
  };

  const openEditProductModal = () => {
    setEditProductModal(true);
  };

  const closeModal = () => {
    setAddBankDetailsModal(false);
    setAddTaxModal(false);
    setEditProductModal(false);
    SetOpenSignature(false);
  };
  const addSaveSignature = (data: any) => {
    SetOpenSignature(false);
    setSignImage(data);
    setValue('signatureImage', data);
  };

  const addSaveBtn = () => {
    closeModal();
  };

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
      invoiceDate: '',
      dueDate: '',
      customerId: '',
      invoiceNumber: '',
      bank: '',
      payment_method: '',
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
      signatureName: '',
      signatureImage: '',
    },
  });

  const handleCheckBox = () => {
    setCheckBox(!checkBox);
  };

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

  const deleteItem = (item: any) => {
    if (invoiceDetails) {
      const data = addedProduct.filter((i: any) => i?.productId !== item?.productId);
      setAddedProduct(data);
    }
    else {
      const data = addedProduct.filter((i: any) => i._id !== item._id);
      setAddedProduct(data);
    }
  };

  // const calculateAmount = (item: any) => {
  //   const sellingPrice = (Number(item?.sellingPrice) || Number(item?.rate)) * Number(item?.quantity);
  //   const discountValue = Number(item?.discountValue) || Number(item?.discount);
  //   const taxRate = Number(item?.tax?.taxRate) || Number(item?.taxInfo?.taxRate);
  //   const amount = sellingPrice - discountValue;
  //   const taxItem = (amount * taxRate) / 100;
  //   console.log( "Calculated amount"+ sellingPrice+ " s "+ discountValue+ ' d '+ taxRate+ ' t '+ amount+ ' a ' + taxItem + ' ti '  )
  //   //Calculated amount500 s 20 d NaN t 480 a NaN ti
  //   return amount + taxItem;
  // };

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
    (
      <View style={[{ backgroundColor: colors.greyOne, borderRadius: 8, width: '100%' }, mb5]}>
        <View style={[flexRow, justifyBetween, m10]}>
          <Text style={[commonStyles.h18BlackOne700, {}]}>{item.name}</Text>
          <Text style={[commonStyles.h18BlackOne700, {}]}>{currencySymbol}{getItemTotal(item).toFixed(2)}</Text>
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
          <View style={[p10]}>
            <Text style={[commonStyles.h12blackTwo600]}>Qty*Rate</Text>
            <Text style={[commonStyles.h12blackTwo600, mt5]} >Discount & Tax</Text>
          </View>
          <View style={[p10]}>
            <Text style={[commonStyles.h12blackTwo600]}>
              {item.quantity} x {item.sellingPrice ?? item?.rate}
            </Text>
            <Text style={[commonStyles.h12blackTwo600, mt5]} >
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
      </View>
    )
  );

  return (
    <Fragment>
      <SafeAreaView style={getTopNotchStyle(true)} />

      <SafeAreaView style={getMainContainerStyle(false)}>
        <View style={[flex1]}>
          <View style={[flex1, { backgroundColor: colors.white, }]}>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              extraHeight={Platform.OS === 'ios' ? 90 : 75}
            >
            

              <View style={[flex1, mt10, mh15,]}>
                <TopHeader headerText={invoiceDetails ? labels.editInvoice : labels.addInvoice} searchIcon={false} />
                <View style={[commonStyles.smallCard, mv10]} >

                  <Text style={[commonStyles.h12RedTwo500, mh10]}
                  >{`Invoice no: #INV${invNo}`}</Text>
                </View>

                <View style={[mv10]}>
                  <View style={[flexRow, justifyBetween]}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[commonStyles.h14blackOne600, mv5]} >
                        {'Customer Name'}
                      </Text>
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
                          disable={editName}
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
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                      {errors.customerId.message}
                    </Text>
                  )}
                  <View style={[flexRow]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {'Reference Number'}
                    </Text>
                  </View>
                  <View style={[styles.input]}>
                    <Controller
                      name={'referenceNo'}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CustomTextInput
                          placeholder={labels.enterReferenceNumber}
                          value={value}
                          onChangeText={onChange}
                          textColor={colors.black}
                          keyboardType="numeric"
                          maxLength={30}
                        />
                      )}
                    // rules={{
                    //   required: requiredValidation('Reference Number'),
                    // }}
                    />
                  </View>
                  {errors.referenceNo && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                      {errors.referenceNo.message}
                    </Text>
                  )}
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                      <View style={[flexRow]}>
                        <Text style={[commonStyles.h14blackOne600, mv5]} >
                          {'Invoice Date'}
                        </Text>
                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => showDatePickerModal('invoiceDate')}
                        style={[styles.input, flexRow, { width: 160 }]}>
                        <Controller
                          name={'invoiceDate'}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <CustomTextInput
                              placeholder={labels.invoiceDate}
                              value={value}
                              onChangeText={onChange}
                              editable={false}
                            />
                          )}
                          rules={{
                            required: 'Invoice Date is required'
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
                      {errors.invoiceDate && (
                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                          {errors.invoiceDate.message}
                        </Text>
                      )}
                    </View>

                    <View style={{ flexDirection: 'column' }}>
                      <View style={[flexRow,]}>
                        <Text style={[commonStyles.h14blackOne600, mv5]} >
                          {'Due Date'}
                        </Text>
                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => showDatePickerModal('dueDate')}
                        style={[styles.input, flexRow, { width: 160 }]}>
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
                          <CustomIcon
                            name="calendar"
                            size={16}
                            color={colors.grey}
                            type="Feather"
                          />
                        </View>
                      </TouchableOpacity>
                      {errors.dueDate && (
                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                          {errors.dueDate.message}
                        </Text>
                      )}
                    </View>
                  </View>
                  <CommonDatePicker
                showDatePickerSingle={showDatePicker}
                onCancelSingle={handleDateCancel}
                onConfirmSingle={handleDateConfirm}
              />
                  <View style={[flexRow,]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {'Payment Method'}
                    </Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>

                  <View >
                    <Controller
                      name="payment_method"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CommonDropDownPicker
                          ListData={paymentMethodList}
                          dropdownValue={paymenttype}
                          handleDropdownChange={handlePaymentDropdownChange}
                          isFocus={isFocus1}
                          setIsFocus={setIsFocus1}
                          labelField="name"
                          valueField="name"
                          placeholder={labels.select}
                        />
                      )}
                      rules={{
                        required: 'Payment Method is required',
                      }}
                    />

                  </View>
                  {errors.payment_method && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                      {errors.payment_method.message}
                    </Text>
                  )}
                </View>
                {addedProduct && addedProduct.length > 0 ? (
                  <View>
                    <View style={flexRow}>
                      <Text style={[commonStyles.h14blackOne600, mv5]} >
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
                            navigation.navigate(screenName.ProductScreen, {
                              fromScreen: labels.invoice,
                              listData: productList.filter(
                                (item: any) => !addedProduct.some((i: any) => i._id === item._id)
                              ),
                              handlereturnData: handlereturnData,
                            } as any)
                          }>
                          <Text style={[commonStyles.h12Primary400]}>Add Item</Text>
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
                        <Text style={[commonStyles.h18BlackOne700, {}]}>Total</Text>
                        <Text style={[commonStyles.h18BlackOne700, {}]}>{currencySymbol}{((Number(total) || 0) - (Number(discountTotal) || 0) + (Number(taxTotal) || 0)).toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <CustomNavigateBox
                    name="Add Product"
                    label={labels.products}
                    onNavigate={() =>
                      navigation.navigate(screenName.ProductScreen, {
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
                {/* <View style={[flexRow, mt15]}>
<Text style={[commonStyles.h14blackOne600,mv5]} >
 {'Select Bank'}
 </Text>
 <Text style={[commonStyles.h14Danger400]}> *</Text>
 </View> */}
                <View style={[flexRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                  <View style={[flexRow,]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'Select Bank'}</Text>
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
                        placeholder={labels.select}
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
                <View >
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
                  // rules={{
                  //   required: 'Notes is required',
                  // }}
                  />

                </View>
                {/* {errors.notes && (
            <Text style={{ color: colors.danger,  marginLeft: 10 }}>
              {errors.notes.message}
            </Text>
          )} */}
                <View >
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
                  // rules={{
                  //   required: 'Terms Conditions is required',
                  // }}
                  />

                </View>
                {/* {errors.terms_conditions && (
            <Text style={{ color: colors.danger,  marginLeft: 10 }}>
              {errors.terms_conditions.message}
            </Text>
          )} */}
                <View style={mv10}>
                  <Text style={commonStyles.h14blackOne600} >Invoice Summary</Text>
                  <View
                    style={[
                      {
                        height: 170,
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
                        <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{(total)}</Text>
                      </View>
                      <View style={[flexRow, justifyBetween, mt10]}>
                        <Text style={[commonStyles.h14blackTwo500]}>Discount</Text>
                        <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{(discountTotal)}</Text>
                      </View>
                      <View style={[flexRow, justifyBetween, mt10]}>
                        <Text style={[commonStyles.h14blackTwo500]}>Tax</Text>
                        <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{taxTotal}</Text>
                      </View>
                      <View style={[flexRow, justifyBetween, alignItemCenter, mt5]}>
                        <View style={[flexRow, justifyCenter, mt10]}>
                          <Text style={[commonStyles.h14blackTwo500, mr5]} >Round Off</Text>
                          <MultiSelectOption
                            selectedColor={colors.primary}
                            unselectedColor={colors.danger}
                            isSelected={checkBox}
                            onSelect={handleCheckBox}
                          />
                        </View>
                        <Text style={[commonStyles.h14blackTwo500]}>
                          {currencySymbol}{''}
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
                          height={330}
                          color={colors.greyEight}
                          dashGap={4}
                        />
                      </View>
                      <View style={[flexRow, justifyBetween]}>
                        <Text style={[commonStyles.h18BlackOne700, {}]}>Total</Text>
                        <Text style={[commonStyles.h18BlackOne700, {}]}>
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
                <View style={[flexRow,]}>
                  <Text style={[commonStyles.h14blackOne600, mv5]} >
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
                    {errors.signatureName && (
                      <Text style={{ color: colors.danger, marginLeft: 10 }}>
                        {errors.signatureName.message}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View>
                    <View style={[styles.input]}>
                      <Controller
                        name={'signatureName'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomTextInput
                            placeholder={labels.signatureName}
                            value={value}
                            onChangeText={onChange}
                            textColor={colors.black}
                            maxLength={30}
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
                )}
                {SignImage && (
                  <View style={mv10}>
                    <Text style={commonStyles.h14blackOne600} >Signature</Text>
                    <View style={{ padding: 2, borderWidth: 1, borderRadius: 5 }}>
                      <Image
                        source={{ uri: SignImage }}
                        style={{ height: 80, width: '100%', resizeMode: 'contain' }}
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={[flexRow, justifyBetween, mt10, mh10]}>
                <OnboardingButton
                  width={160}
                  title={labels.cancel}
                  onChange={handleCancelBtnClick}
                  backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                  color={isActiveBtn ? colors.white : colors.blackOne}
                />
                <OnboardingButton
                  width={160}
                  title={labels.saveChanges}
                  onChange={handleSaveBtnClick}
                  backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                  color={isActiveBtn ? colors.blackOne : colors.white}
                />
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
    ...flexRow,
    ...justifyBetween,
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
    ...flexRow,
    ...justifyBetween,
  },
  shippingAddress: {
    marginTop: 15,
  },
  buttonRow: {
    ...flexRow,
    ...justifyBetween,
    marginTop: 30,
  },
});
export default AddInvoiceScreen;