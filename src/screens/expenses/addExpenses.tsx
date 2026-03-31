import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { OnboardingButton } from '../../components/commonButton';
import { TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { getMethod, postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import {
  alignSelfCenter,
  flex1,
  flexRow,
  justifyBetween,
  mh15,
  mt10,
  mt15,
  mv15,
  mv5,
  ph10,
} from '../../utils/theme/commonStyles';
import { requiredValidation } from '../../utils/validationConfig';
import { UploadImageCard } from '../products/uploadImageCard';
import { Expenses } from './expensesScreen';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { CommonDatePicker } from '../../components/CommonDatePicker';
import { useToast } from 'react-native-toast-notifications';
import moment from 'moment';
import { commonStyles, getTopNotchStyle, getMainContainerStyle } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type FormData = {
  reference: string;
  amount: string;
  expenseId: string;
  paymentMode: string;
  expenseDate: string;
  status: string;
  attachment: string | ArrayBuffer | null;
  description: string;
  _id: string;
};

type RootStackParamList = {
  AddExpenses: { expensesDatas?: Expenses };
};

type AddExpensesProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddExpenses'>;
  route: RouteProp<RootStackParamList, 'AddExpenses'>;
};

const AddExpenses = (props: AddExpensesProps) => {
  const navigation = useNavigation();
  const [isActiveBtn, setIsActiveBtn] = useState(false);
  const [expenseId, setExpenseId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownDiscount, setDropdownDiscount] = useState<string | null>(null);
  const [isFocusDiscount, setIsFocusDiscount] = useState<boolean>(false);
  const [isFocusStatus, setIsFocusStatus] = useState<boolean>(false)
  const [dropdownStatus, setDropdownStatus] = useState<string | null>(null);
  const route = useRoute();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const focused = useIsFocused();

  const handleImageUpload = (uploadedImage: string | ArrayBuffer | null) => {
    console.log('uploadedImage', uploadedImage);
    setImage(uploadedImage);
    setSelectedImage(uploadedImage as string);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormData>();

  useEffect(() => {
    if (focused) {
      setSelectedImage(null);
      const expensesDatas = route.params?.expensesDatas?.expenseDetails;
      if (expensesDatas) {
        setIsEditing(true);
        const {
          attachment,
          paymentMode,
          amount,
          reference,
          expenseDate,
          status,
          description,
          expenseId,
          _id,
        } = expensesDatas;
        setValue('reference', reference);
        setValue('amount', amount);
        setValue('_id', _id);
        setValue('paymentMode', paymentMode); // Prefill payment mode
        setValue('expenseDate', moment(expenseDate).format('YYYY-MM-DD'));
        setDate(new Date(expenseDate)); // Prefill date
        setValue('status', status); // Prefill status
        setValue('description', description);
        setValue('expenseId', expenseId);
        if (Array.isArray(attachment) && attachment.length > 0) {
          setImage(attachment[0]);
        }
        if (typeof attachment === 'string') {
          setImage(attachment);
        }
        setDropdownDiscount(paymentMode); // Set dropdown for payment mode
        setDropdownStatus(status); // Set dropdown for status
      }
      else {
        getVendorsList();
      }
    }
  }, [focused]);

  const handleSaveBtnClick = () => {
    setIsActiveBtn(true);
    navigation.navigate(screenName.ExpensesScreen as never);
  };

  const handleCancelBtnClick = () => {
    setIsActiveBtn(false);
    navigation.goBack();
  };

  const getVendorsList = () => {
    setLoading(true);
    getMethod(
      ApiUrl.getExpenseNo,
      success => {
        if (success.code === 200) {
          setExpenseId(success.data);
          setValue('expenseId', success.data); // Prefill the expenseId
          setLoading(false);
          console.log('Successfully got expenseId', success.data);
        } else {
          console.log('Failed to get expenseId:', success.message);
          setLoading(false);
        }
      },
      error => {
        console.log('Error fetching expenseId:', error);

        setLoading(false);
      },
    );
  };

  const addVendor: SubmitHandler<FormData> = async formData => {
    const isValid = await trigger();
    if (!isValid) {
      toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
      return;
    }
    const {
      reference,
      amount,
      description,
      attachment,
      status,
      expenseDate,
      expenseId,
      paymentMode,
      _id,
    } = formData;
    const postData = new FormData();
    Object.keys(formData).forEach(key => {
      postData.append(key, formData[key as keyof FormData]);
    });
    if (selectedImage) {
      postData.append('attachment', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }
    const expensesDatas = route.params?.expensesDatas;
    if (expensesDatas) {
      putMethod(
        `${ApiUrl.updateExpense}/${expensesDatas.expenseDetails?._id}`, // Assuming there's an endpoint to update units with an ID
        postData,
        async (response: any) => {
          if (response && response.data) {
            setIsActiveBtn(true);
            toast.show("Expense Updated", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            navigation.goBack();
          } else {
            toast.show("Already Exist", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
          }
        },
        error => {
          console.log("Error in updating Expense", error);
          toast.show("Error in updating Expense", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
        },
      );
    } else {
      postMethod(
        ApiUrl.addExpense,
        {
          reference,
          amount,
          description,
          attachment,
          status,
          expenseDate: date.toISOString(),
          expenseId,
          paymentMode,
        },
        async (response: any) => {
          if (response && response.data) {
            setIsActiveBtn(true);
            navigation.navigate(screenName.ExpensesScreen as never);
            toast.show("Expense Added", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
          } else {
            toast.show("Error in adding expense", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
          }
        },
        error => {
          toast.show("Error in adding expense", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
        },
      );
    }
  };

  const DateInputField = ({ label, value, onPress }) => {
    return (
      <View style={{ marginVertical: 10 }}>
        <View style={[flexRow]}>
          <Text style={[commonStyles.h14blackOne600, mv5]} >{label}</Text>
          <Text style={{ color: 'red' }}> *</Text>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.input}>
          <Text style={{ color: colors.black }}>{value}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const PaymentModes = [
    { name: 'Cash', value: 'Cash' },
    { name: 'Cheque', value: 'Cheque' },
  ];

  const PaymentStatus = [
    { name: 'Paid', value: 'Paid' },
    { name: 'Pending', value: 'Pending' },
    { name: 'Cancelled', value: 'Cancelled' },
  ];

  const handleDiscountChange = (item: { name: string; _id: string }) => {
    setDropdownDiscount(item.name);
    setValue('paymentMode', item.name);
    setIsFocusDiscount(false);
  };

  const handleStatusChange = (item: { name: string; _id: string }) => {
    setDropdownStatus(item.name);
    setValue('status', item.name);
    setIsFocusStatus(false);
  };

  const PaymentModeDropdown = ({ setValue, defaultValue }) => {
    const [selectedPaymentMode, setSelectedPaymentMode] = useState(
      defaultValue || '',
    );

    useEffect(() => {
      if (defaultValue) {
        setSelectedPaymentMode(defaultValue);
        setValue('paymentMode', defaultValue);
      }
    }, [defaultValue, setValue]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    const handlePaymentModeChange = mode => {
      setSelectedPaymentMode(mode);
      setValue('paymentMode', mode);
    };

    return (
      <View>
        <TouchableOpacity onPress={toggleDropdown} style={styles.input}>
          <View style={[flexRow, justifyBetween]}>
            <Text style={{ color: colors.black }}>
              {selectedPaymentMode
                ? selectedPaymentMode
                : 'Select a Payment mode'}
            </Text>
            <CustomIcon
              name={isDropdownOpen ? 'chevron-small-up' : 'chevron-small-down'}
              size={16}
              color={colors.grey}
              type="Entypo"
            />
          </View>
        </TouchableOpacity>
        {isDropdownOpen && (
          <View style={{ backgroundColor: 'white', elevation: 1 }}>
            <TouchableOpacity
              onPress={() => handlePaymentModeChange(PaymentModes.CASH)}>
              <View style={[styles.modalItem, flexRow]}>
                <Text style={commonStyles.h14blackOne600}>{PaymentModes.CASH}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePaymentModeChange(PaymentModes.CHEQUE)}>
              <View style={[styles.modalItem, flexRow]}>
                <Text style={commonStyles.h14blackOne600}>{PaymentModes.CHEQUE}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const PaymentStatusDropdown = ({ setValue, defaultValue }) => {
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
      defaultValue || '',
    );

    useEffect(() => {
      if (defaultValue) {
        setSelectedPaymentStatus(defaultValue);
        setValue('status', defaultValue);
      }
    }, [defaultValue, setValue]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    const handlePaymentStatusChange = status => {
      setSelectedPaymentStatus(status);
      setValue('status', status);
    };



    return (
      <View>
        <TouchableOpacity onPress={toggleDropdown} style={styles.input}>
          <View style={[flexRow, justifyBetween]}>
            <Text style={{ color: colors.black }}>
              {selectedPaymentStatus
                ? selectedPaymentStatus
                : 'Select a Payment status'}
            </Text>
            <CustomIcon
              name={isDropdownOpen ? 'chevron-small-up' : 'chevron-small-down'}
              size={16}
              color={colors.grey}
              type="Entypo"
            />
          </View>
        </TouchableOpacity>
        {isDropdownOpen && (
          <View style={{ backgroundColor: 'white', elevation: 1 }}>
            <TouchableOpacity
              onPress={() =>
                handlePaymentStatusChange(PaymentStatus.CANCELLED)
              }>
              <View style={[styles.modalItem, flexRow]}>
                <Text style={commonStyles.h14blackOne600}>{PaymentStatus.CANCELLED}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePaymentStatusChange(PaymentStatus.PAID)}>
              <View style={[styles.modalItem, flexRow]}>
                <Text style={commonStyles.h14blackOne600}>{PaymentStatus.PAID}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePaymentStatusChange(PaymentStatus.PENDING)}>
              <View style={[styles.modalItem, flexRow]}>
                <Text style={commonStyles.h14blackOne600}>{PaymentStatus.PENDING}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const showDatePickerModal = () => {
    // setSelectedDateType(type);
    setShowDatePicker(true);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleDateConfirm = (date: any) => {
    const formattedDate = date.dateString || new Date(date.date).toISOString().split('T')[0];
    setValue('expenseDate', formattedDate);
    // else if (selectedDateType === 'dueDate') {
    //     setValue('dueDate', formattedDate);
    // }
    setShowDatePicker(false);
  };

  return (
    <Fragment>
      <SafeAreaView style={getTopNotchStyle(true)} />

      <SafeAreaView style={getMainContainerStyle(false)}>
        <View style={flex1}>
          <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
            <CommonDatePicker
              showDatePickerSingle={showDatePicker}
              onCancelSingle={handleDateCancel}
              onConfirmSingle={handleDateConfirm}
            />
            <View style={[mv15, ph10]}>
              <TopHeader
                headerText={isEditing ? 'Edit Expense' : labels.addExpense}
              />
            </View>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              extraHeight={Platform.OS === 'ios' ? 90 : 75}
            >
              {/* <KeyboardAScrollView style={[mh15]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}> */}
              <View style={{ paddingBottom: 'auto' }}>
                <View style={{ marginTop: 10 }}>
                  <View style={[flexRow]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {'Expense Id'}
                    </Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  {isEditing ? (
                    <View>
                      <View style={styles.input}>
                        <Text style={[commonStyles.h14BlackTwo400, { fontSize: 12 }]}>
                          {route.params?.expensesDatas?.expenseDetails?.expenseId}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.input}>
                      <Controller
                        name={'expenseId'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomTextInput
                            placeholder={'Enter Id'}
                            value={value}
                            textColor={colors.black}
                            onChangeText={onChange}
                            editable={false} // Make it non-editable
                            error={errors['expenseId']?.message}
                          />
                        )}
                        rules={{
                          required: requiredValidation('Expense id'),
                        }}
                      />
                    </View>
                  )}

                  <View style={[flexRow, mt15]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {labels.referenceNumber}
                    </Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  <View style={styles.input}>
                    <Controller
                      name={'reference'}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CustomTextInput
                          placeholder={labels.referenceNumber}
                          value={value}
                          onChangeText={onChange}
                          textColor={colors.black}
                          keyboardType='numeric'
                          maxLength={30}
                        />
                      )}
                      rules={{
                        required: requiredValidation('Reference '),
                      }}
                    />
                  </View>
                  {errors.reference && (
                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                      {errors.reference.message}
                    </Text>
                  )}
                  <View style={[flexRow, mt15]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {labels.amount}
                    </Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  <View style={styles.input}>
                    <Controller
                      name={'amount'}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CustomTextInput
                          placeholder={'Enter Amount'}
                          value={value}
                          onChangeText={onChange}
                          textColor={colors.black}
                          keyboardType='numeric'
                          maxLength={8}
                        />
                      )}
                      rules={{
                        required: requiredValidation('Amount'),
                      }}
                    />
                  </View>
                  {errors.amount && (
                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                      {errors.amount.message}
                    </Text>
                  )}
                  <View style={[flexRow, mt15]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {labels.paymentMode}
                    </Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  <View >
                    <Controller
                      name="paymentMode"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CommonDropDownPicker
                          ListData={PaymentModes}
                          dropdownValue={dropdownDiscount}
                          handleDropdownChange={handleDiscountChange}
                          isFocus={isFocusDiscount}
                          setIsFocus={setIsFocusDiscount}
                          labelField="name"
                          valueField="name"
                          placeholder={labels.paymentMode}
                        />
                      )}
                      rules={{
                        required: 'Payment Mode is required',
                      }}
                    />
                  </View>
                  {errors.paymentMode && (
                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                      {errors.paymentMode.message}
                    </Text>
                  )}

                  <View style={[flexRow, mt10]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'Date'}</Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  <TouchableOpacity onPress={() => showDatePickerModal()} style={[styles.input, flexRow, justifyBetween]}>
                    <Controller
                      name="expenseDate"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => (
                        <CustomTextInput
                          placeholder={"Select " + labels.expenseDate}
                          value={value}
                          onChangeText={onChange}
                          // error={errors['purchaseDate']?.message}
                          editable={false}
                        />
                      )}
                      rules={{
                        required: requiredValidation('date'),
                      }}
                    />
                    <View style={[alignSelfCenter]}>
                      <CustomIcon name='calendar' size={16} color={colors.grey} type='Feather' />
                    </View>

                  </TouchableOpacity>
                  {errors.expenseDate && (
                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                      {errors.expenseDate.message}
                    </Text>
                  )}
                  {/* <Controller

              render={({ field: { onChange, value } }) => (
                <DateInputField
                  label="Date"
                  value={
                    value
                      ? new Date(value).toLocaleDateString()
                      : date.toLocaleDateString()
                  }
                  onPress={() => setIsDatePickerOpen(true)}
                />
              )}
              rules={{
                required: requiredValidation('date'),
              }}
            /> */}
                  <View style={[flexRow, mt15]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {labels.paymentStatus}
                    </Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                  </View>
                  <View >
                    <Controller
                      name="status"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CommonDropDownPicker
                          ListData={PaymentStatus}
                          dropdownValue={dropdownStatus}
                          handleDropdownChange={handleStatusChange}
                          isFocus={isFocusStatus}
                          setIsFocus={setIsFocusStatus}
                          labelField="name"
                          valueField="name"
                          placeholder={labels.paymentStatus}
                        />
                      )}
                      rules={{
                        required: 'Payment Status is required',
                      }}
                    />
                  </View>
                  {errors.status && (
                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                      {errors.status.message}
                    </Text>
                  )}
                  <View style={[flexRow, mt15]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >
                      {labels.attachment}
                    </Text>
                    {/* <Text style={[commonStyles.h14Danger400]}> *</Text> */}
                  </View>
                  <UploadImageCard
                    title={labels.attachment}
                    sizeInfo={labels.sizeOfImg1}
                    onUpload={handleImageUpload}
                    onDelete={() => setImage(null)}
                    initialImage={image} // Pass the existing image URL here
                  />

                  <View style={[flexRow, justifyBetween, mv15]}>
                    <OnboardingButton
                      width={160}
                      title={labels.cancel}
                      onChange={handleCancelBtnClick}
                      backgroundColor={
                        isActiveBtn ? colors.primary : colors.greySeven
                      }
                      color={isActiveBtn ? colors.white : colors.blackOne}
                    />
                    <OnboardingButton
                      width={160}
                      title={isEditing ? 'Update' : 'Add'}
                      onChange={handleSubmit(addVendor)}
                      backgroundColor={
                        isActiveBtn ? colors.greySeven : colors.primary
                      }
                      color={isActiveBtn ? colors.blackOne : colors.white}
                    />
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>

            {/* <DatePicker
        modal
        open={isDatePickerOpen}
        date={date}
        mode="date"
        onConfirm={selectedDate => {
          setIsDatePickerOpen(false);
          setDate(selectedDate);
          setValue('expenseDate', selectedDate.toISOString());
        }}
        onCancel={() => setIsDatePickerOpen(false)}
      /> */}
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
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: colors.blackOne,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.greyFive,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.greyOne,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
});

export default AddExpenses;
