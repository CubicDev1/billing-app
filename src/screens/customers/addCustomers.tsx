import React, { Fragment, useEffect, useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MultiLineTextBox, MultiSelectOption, TabBar, TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, mt10, mh10, mv15, alignItemCenter, mt15, flexRow, justifyBetween, mv10, p10, justifyCenter, mv5 } from '../../utils/theme/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../utils/screenNames';
import { UploadImageCard } from '../products/uploadImageCard';
import { Controller, useForm } from 'react-hook-form';
import { OnboardingButton } from '../../components/commonButton';
import { DevWidth } from '../../utils/device';
import DashedLine, { DashedLines } from '../../components/dashedLine';
import { CustomTextInput } from '../../components/commonInputFields';
import { requiredValidation } from '../../utils/validationConfig';
import { getMethod, postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { CustomerFormData } from '../../utils/FormDataFunc';
import { useDispatch } from 'react-redux';
import * as TYPES from '../../action/ActionType';
import { useToast } from "react-native-toast-notifications";
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface BillingAddress {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface ShippingAddress {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface BankDetails {
    bankName: string;
    branch: string;
    accountHolderName: string;
    accountNumber: string;
    IFSC: string;
}

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    website: string;
    image: string;
    notes: string;
    status: string;
    billingAddress: BillingAddress;
    shippingAddress: ShippingAddress;
    bankDetails: BankDetails;
    userId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    invoices: any[]; // You can replace 'any' with a specific type if needed
    balance: number;
    noOfInvoices: number;
}

interface AddCustomersProps {
    route: any;
    customerData: Customer;
}

type FormData = {
    append(arg0: string, arg1: string): unknown;
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
};

const AddCustomersScreen: React.FC<AddCustomersProps> = (props) => {
    // const AddCustomersScreen = (props: addCustomersProps) => {
    const navigation = useNavigation();
    const customerData = props?.route?.params?.customerData ?? null;
    console.log('customerData', customerData ?? null);
    const dispatch = useDispatch();
    const [selectedImages, setSelectedImages] = useState();
    const [selectedTab, setSelectedTab] = useState(labels.basicDetails);
    const [notes, setNotes] = useState('');
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [checkBox, setCheckBox] = useState(false);
    const [imageData, setImageData] = useState<string | ArrayBuffer | null>('');
    const tabs = [
        { label: labels.basicDetails },
        { label: labels.address },
        { label: labels.bankDetails },
    ];

    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
    };

    const handlePrevBtnClick = () => {
        setIsActiveBtn(true);
        setSelectedTab(labels.basicDetails);
    };

    const handlePrevTwoBtnClick = () => {
        setIsActiveBtn(true);
        setSelectedTab(labels.address);
    }

    const handleSaveChangesBtnClick = () => {
        setIsActiveBtn(true);
        // navigation.navigate(screenName.CustomerDetails as never)
    }

    const handleNextBtnClick = async () => {
        // setIsActiveBtn(false);
        const isValid = await trigger();
        if (!isValid) {
            console.log('Please fill in all fields correctly');
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
        }
        else {
            setSelectedTab(labels.bankDetails);
        }
    };

    const { control, getValues, setValue, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            website: '',
            notes: '',
            billingAddressname: '',
            billingAddressaddressLine1: '',
            billingAddressaddressLine2: '',
            billingAddresscity: '',
            billingAddressstate: '',
            billingAddresscountry: '',
            billingAddresspincode: '',
            shippingAddressName: '',
            shippingAddressAddress1: '',
            shippingAddressAddress2: '',
            shippingAddressCity: '',
            shippingAddressState: '',
            shippingAddressCountry: '',
            shippingAddressPincode: '',
            bankDetailsbankName: '',
            bankDetailsbranch: '',
            bankDetailsaccountHolderName: '',
            bankDetailsaccountNumber: '',
            bankDetailsIFSC: '',
        }
    });

    useEffect(() => {
        if (customerData) {
            console.log('customerData', customerData);
            setValue('name', customerData.name);
            setValue('email', customerData.email);
            setValue('phone', customerData.phone);
            setValue('website', customerData.website);
            setValue('notes', customerData.notes);
            setValue('billingAddressname', customerData.billingAddress.name);
            setValue('billingAddressaddressLine1', customerData.billingAddress.addressLine1);
            setValue('billingAddressaddressLine2', customerData.billingAddress.addressLine2);
            setValue('billingAddresscity', customerData.billingAddress.city);
            setValue('billingAddressstate', customerData.billingAddress.state);
            setValue('billingAddresscountry', customerData.billingAddress.country);
            setValue('billingAddresspincode', customerData.billingAddress.pincode);
            setValue('shippingAddressName', customerData.shippingAddress.name);
            setValue('shippingAddressAddress1', customerData.shippingAddress.addressLine1);
            setValue('shippingAddressAddress2', customerData.shippingAddress.addressLine2);
            setValue('shippingAddressCity', customerData.shippingAddress.city);
            setValue('shippingAddressState', customerData.shippingAddress.state);
            setValue('shippingAddressCountry', customerData.shippingAddress.country);
            setValue('shippingAddressPincode', customerData.shippingAddress.pincode);
            setValue('bankDetailsbankName', customerData.bankDetails.bankName);
            setValue('bankDetailsbranch', customerData.bankDetails.branch);
            setValue('bankDetailsaccountHolderName', customerData.bankDetails.accountHolderName);
            setValue('bankDetailsaccountNumber', customerData.bankDetails.accountNumber);
            setValue('bankDetailsIFSC', customerData.bankDetails.IFSC);
            // setImageData(defaultProfileImage);
            setSelectedImages(customerData.image);
        }
    }, []);

    const toast = useToast();

    const addCustomer = async () => {
        const isValid = await trigger();
        console.log(isValid, 'isValid', imageData);

        if (!isValid) {
            console.log('Please fill in all fields correctly');
            toast.show("Please fill in all fields correctly'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }
        const formatData = CustomerFormData(getValues(), imageData);
        console.log(formatData, "formatData");
        console.log(typeof formatData);
        if (!customerData) {
            postMethod(
                ApiUrl.addCustomer,
                formatData,
                async (response: any) => {
                    if (response && response.data) {
                        console.log("Successfully added customer", response.data);
                        toast.show("Successfully added customer'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        handleNavigation()
                    } else {
                        console.log("Error in adding customer", response);
                        toast.show("Failed to add customer", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log("Error in adding customer", error);
                    toast.show("error.data.message[0]", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }

            );
            return
        }
        else {
            putMethod(
                ApiUrl.updateCustomer + customerData._id,
                formatData,
                async (success: { code: number; message: any; }) => {
                    if (success.code == 200) {
                        console.log('Successfully UpdateCustomersScreen', success);
                        toast.show("Edited customer successfully'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        handleNavigation()
                        return
                    } else {
                        console.log('Failed UpdateCustomersScreen', success);
                        toast.show("Failed to edit customer", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    console.log('Error UpdateCustomersScreen:', error);
                    toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        }
    }

    const handleNavigation = () => {
        getMethod(
            ApiUrl.dropDownCustomer,
            success => {
                if (success.code == 200) {
                    dispatch({ type: TYPES.CUSTOMER_LIST, payload: success.data })
                }
            },
            error => {
                console.log(error);
            }
        );
        navigation.navigate(screenName.CustomersScreen as never);
    }
    const handleCopyText = () => {
        setCheckBox(!checkBox);
        // Get the current address values
        if (!checkBox) {
            const addressValues = getValues([
                'billingAddressname',
                'billingAddressaddressLine1',
                'billingAddressaddressLine2',
                'billingAddresscity',
                'billingAddressstate',
                'billingAddresscountry',
                'billingAddresspincode',
            ]);
            setValue('shippingAddressName', addressValues[0]);
            setValue('shippingAddressAddress1', addressValues[1]);
            setValue('shippingAddressAddress2', addressValues[2]);
            setValue('shippingAddressCity', addressValues[3]);
            setValue('shippingAddressState', addressValues[4]);
            setValue('shippingAddressCountry', addressValues[5]);
            setValue('shippingAddressPincode', addressValues[6]);
        }
        else {
            setValue('shippingAddressName', '');
            setValue('shippingAddressAddress1', '');
            setValue('shippingAddressAddress2', '');
            setValue('shippingAddressCity', '');
            setValue('shippingAddressState', '');
            setValue('shippingAddressCountry', '');
            setValue('shippingAddressPincode', '');
        }

        console.log('Address copied');
    };
    const handleImage = (picData: any) => {
        console.log('Image clicked', picData);
        setImageData(picData);
        setSelectedImages(picData?.uri)
    };

    const basicDetails = () => {
        return (
            <Fragment>
                <SafeAreaView style={getTopNotchStyle(true)} />

                <SafeAreaView style={getMainContainerStyle(false)}>
                    <View style={[flex1]}>

                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            enableAutomaticScroll={true}
                            extraHeight={Platform.OS === 'ios' ? 90 : 75}
                        >
                            <View style={[mv15,]}>
                                <UploadImageCard
                                    title={labels.customerImage}
                                    sizeInfo={'Size should be below 4 MB'}
                                    initialImage={selectedImages ?? imageData}
                                    imageTag={handleImage}
                                    onUpload={() => { }}
                                    onDelete={() => { }} />
                            </View>
                            <View style={[]}>
                                <View style={[mv10]}>
                                    <View style={[flexRow]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Name'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name={'name'}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.enterName}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                    // error={errors['name']?.message}
                                                    maxLength={30}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('Name'),
                                            }}
                                        />
                                    </View>
                                    {errors.name && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.name.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow,]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Email'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name={'email'}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.email}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                // error={errors['email']?.message}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation("Email"),
                                                validate: {
                                                    isValidEmail: (value) => {
                                                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                        return emailPattern.test(value) || 'Email is not valid';
                                                    }
                                                }
                                            }}
                                        />
                                    </View>
                                    {errors.email && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.email.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow,]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Phone'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name={'phone'}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.phone}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    keyboardType='numeric'
                                                    textColor={colors.black}
                                                    // error={errors['phone']?.message}
                                                    maxLength={10}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('Phone'),
                                            }}
                                        />
                                    </View>
                                    {errors.phone && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.phone.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow,]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Website'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name={'website'}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.website}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                // error={errors['website']?.message}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('Website'),
                                            }}
                                        />
                                    </View>
                                    {errors.website && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.website.message}
                                        </Text>
                                    )}
                                    <View style={[]} >
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

                                    </View>
                                </View>
                                <View style={[mv15, { bottom: 0 }]}>
                                    <OnboardingButton
                                        width={DevWidth / 1.1}
                                        title={labels.next}
                                        onChange={async () => {
                                            const isValid = await trigger();
                                            if (!isValid) {
                                                console.log('Please fill in all fields correctly');
                                                toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                                            }
                                            else {
                                                setSelectedTab(labels.address)
                                            }
                                        }}
                                        backgroundColor={colors.primary}
                                        color={colors.white}
                                    />
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }

    const address = () => {
        return (
                 <KeyboardAwareScrollView
                          showsVerticalScrollIndicator={false}
                          keyboardShouldPersistTaps="handled"
                          enableAutomaticScroll={true}
                          extraHeight={Platform.OS === 'ios' ? 90 : 75}
                        >
                <Text style={[commonStyles.h16BlackOne700]}>{labels.billingAddress}</Text>
                <View style={[alignItemCenter, mt10, justifyCenter]}>
                    <DashedLine height={DevWidth / 1.1} color={colors.greyTwo} dashLength={5} dashGap={0} />
                </View>
                <View style={[flexRow]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'Name'}</Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                </View>
                <View style={styles.input}>
                    <Controller
                        name='billingAddressname'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <CustomTextInput
                                placeholder={labels.name}
                                value={value}
                                onChangeText={onChange}
                                textColor={colors.black}
                            // error={errors['billingAddressname']?.message}
                            />
                        )}
                        rules={{
                            required: 'Name is required',
                        }}
                    />
                </View>
                {errors.billingAddressname && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                        {errors.billingAddressname.message}
                    </Text>
                )}
                <View style={[flexRow,]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'AddressLine 1'}</Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                </View>
                <View style={styles.input}>
                    <Controller
                        name='billingAddressaddressLine1'
                        control={control}

                        render={({ field: { onChange, value } }) => (
                            <CustomTextInput
                                placeholder={labels.addressLine1}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        rules={{
                            required: 'Address Line1 is required',
                        }}
                    />
                </View>
                {errors.billingAddressaddressLine1 && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                        {errors.billingAddressaddressLine1.message}
                    </Text>
                )}
                <View style={[flexRow,]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'AddressLine 2'}</Text>
                </View>
                <View style={styles.input}>
                    <Controller
                        name="billingAddressaddressLine2"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <CustomTextInput
                                placeholder={labels.addressLine2}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        rules={{
                            required: 'Address Line2 is required',
                        }}
                    />
                </View>
                {errors.billingAddressaddressLine2 && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                        {errors.billingAddressaddressLine2.message}
                    </Text>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'City'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='billingAddresscity'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.enterCity}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                                rules={{
                                    required: 'City is required',
                                }}
                            />
                        </View>
                        {errors.billingAddresscity && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.billingAddresscity.message}
                            </Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'State'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='billingAddressstate'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.enterState}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                                rules={{
                                    required: 'State is required',
                                }}
                            />
                        </View>
                        {errors.billingAddressstate && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.billingAddressstate.message}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'Country'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='billingAddresscountry'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.country}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                                rules={{
                                    required: 'Country is required',
                                }}
                            />
                        </View>
                        {errors.billingAddresscountry && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.billingAddresscountry.message}
                            </Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'Pincode'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='billingAddresspincode'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.enterPincode}
                                        value={value}
                                        keyboardType='numeric'
                                        onChangeText={onChange}
                                        maxLength={6}
                                    />
                                )}
                                rules={{
                                    required: 'Pincode is required',
                                }}
                            />
                        </View>
                        {errors.billingAddresspincode && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.billingAddresspincode.message}
                            </Text>
                        )}
                    </View>
                </View>
                <Pressable style={[mt15, p10, {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.primaryOne,
                    borderRadius: 10,
                    height: 50,
                    backgroundColor: '#FAF8FF',
                    marginVertical: 15
                }]}
                    onPress={() => handleCopyText()}>
                    <MultiSelectOption selectedColor={colors.primary} unselectedColor={colors.danger} isSelected={checkBox} onSelect={handleCopyText} />

                    <Text style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: colors.blackTwo,
                    }} > Shipping & Billing Address are same
                    </Text>
                </Pressable>
                <Text style={[commonStyles.h16BlackOne700, styles.shippingAddress]} >{labels.shippingAddress}</Text>
                <View style={[mt10, mv10]}>
                    <DashedLines color={colors.greyTwo} totalLengthPercentage={90} dashThickness={1} dashGap={0} />
                    {/* <DashedLine height={330} color={colors.greyTwo} dashLength={5} dashGap={0} /> */}
                </View>
                <View style={[flexRow]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'Name'}</Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                </View>
                <View style={styles.input}>
                    <Controller
                        name='shippingAddressName'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <CustomTextInput
                                placeholder={labels.name}
                                value={value}
                                onChangeText={onChange}
                                textColor={colors.black}
                                maxLength={30}
                            />
                        )}
                        rules={{
                            required: 'Name is required',
                        }}
                    />
                </View>
                {errors.shippingAddressName && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                        {errors.shippingAddressName.message}
                    </Text>
                )}
                <View style={[flexRow,]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'AddressLine 1'}</Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                </View>
                <View style={styles.input}>
                    <Controller
                        name='shippingAddressAddress1'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <CustomTextInput
                                placeholder={labels.addressLine1}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        rules={{
                            required: 'Address Line1 is required',
                        }}
                    />
                </View>
                {errors.shippingAddressAddress1 && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                        {errors.shippingAddressAddress1.message}
                    </Text>
                )}
                <View style={[flexRow,]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]} >{'AddressLine 2'}</Text>
                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                </View>
                <View style={styles.input}>
                    <Controller
                        name='shippingAddressAddress2'
                        control={control}

                        render={({ field: { onChange, value } }) => (
                            <CustomTextInput
                                placeholder={labels.addressLine2}
                                value={value}
                                onChangeText={onChange}

                            />
                        )}
                        rules={{
                            required: 'Address Line2 is required',
                        }}
                    />
                </View>
                {errors.shippingAddressAddress2 && (
                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                        {errors.shippingAddressAddress2.message}
                    </Text>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'City'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='shippingAddressCity'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.enterCity}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                                rules={{
                                    required: 'City is required',
                                }}
                            />
                        </View>
                        {errors.shippingAddressCity && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.shippingAddressCity.message}
                            </Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'State'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='shippingAddressState'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.enterState}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                                rules={{
                                    required: 'State is required',
                                }}
                            />
                        </View>
                        {errors.shippingAddressState && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.shippingAddressState.message}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'Country'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='shippingAddressCountry'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.country}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                                rules={{
                                    required: 'Country is required',
                                }}
                            />
                        </View>
                        {errors.shippingAddressCountry && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.shippingAddressCountry.message}
                            </Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[flexRow,]}>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'Pincode'}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={[styles.input, { width: DevWidth / 2.4 }]}>
                            <Controller
                                name='shippingAddressPincode'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.enterPincode}
                                        value={value}
                                        onChangeText={onChange}
                                        keyboardType='numeric'
                                        maxLength={6}
                                    />
                                )}
                                rules={{
                                    required: 'Pincode is required',
                                }}
                            />
                        </View>
                        {errors.shippingAddressPincode && (
                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                {errors.shippingAddressPincode.message}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.buttonRow}>
                    <OnboardingButton
                        width={DevWidth / 2.4}
                        title={labels.prev}
                        onChange={handlePrevBtnClick}
                        backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                        color={isActiveBtn ? colors.white : colors.blackOne}
                    />
                    <OnboardingButton
                        width={DevWidth / 2.4}
                        title={labels.next}
                        // onChange={handleNextBtnClick}
                        onChange={async () => {
                            const isValid = await trigger();
                            if (isValid) {
                                setSelectedTab(labels.bankDetails)


                            }
                            else {
                                console.log('Please fill in all fields correctly');
                                toast.show("Please fill in all fields correctly'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                            }
                        }}
                        // onChange={async () => {
                        // const isValid = await trigger();
                        // if (imageData == '' || !isValid) {
                        // console.log('Please fill in all fields correctly');
                        // toast.show('Please fill in all fields correctly'), {
                        // type: "success",
                        // placement: "bottom",
                        // duration: 500,
                        // successColor: colors.green,
                        // animationType: "zoom-in",
                        // };
                        // }
                        // else {
                        // handleNextBtnClick
                        // }
                        // }}
                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                        color={isActiveBtn ? colors.blackOne : colors.white}
                    />
                </View>
            </KeyboardAwareScrollView >
        )
    }


    const bankDetails = () => {
        return (
            <View style={{ flex: 1 }}>
                {/* <KeyboardAScrollView contentContainerStyle={{ paddingBottom: 80 }}> */}
                     <KeyboardAwareScrollView
                     style={{paddingBottom:80}}
                                  showsVerticalScrollIndicator={false}
                                  keyboardShouldPersistTaps="handled"
                                  enableAutomaticScroll={true}
                                  extraHeight={Platform.OS === 'ios' ? 90 : 75}
                                >
                    <View style={[mt15]}>
                        <Text style={[commonStyles.h16BlackOne700]}>{labels.bankDetails}</Text>
                        <View style={[alignItemCenter, mt10, justifyCenter]}>
                            <DashedLine height={DevWidth / 1.1} color={colors.greyTwo} dashLength={5} dashGap={0} />
                        </View>
                        <View style={[]}>
                            <View style={[]}>
                                <View style={[mv10]}>
                                    <View style={[flexRow]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Bank Name'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name={'bankDetailsbankName'}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.bankName}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('Bank Name'),
                                            }}
                                        />
                                    </View>
                                    {errors.bankDetailsbankName && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.bankDetailsbankName.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow,]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Branch'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name={'bankDetailsbranch'}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.branch}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('Branch'),
                                            }}
                                        />
                                    </View>
                                    {errors.bankDetailsbranch && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.bankDetailsbranch.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow,]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Account Holder Name'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name='bankDetailsaccountHolderName'
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.accountHolderName}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('Account Holder Name'),
                                            }}
                                        />
                                    </View>
                                    {errors.bankDetailsaccountHolderName && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.bankDetailsaccountHolderName.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow,]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'Account Number'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name='bankDetailsaccountNumber'
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.accountNumber1}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    keyboardType='numeric'
                                                    textColor={colors.black}
                                                    maxLength={17}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('Account Number'),
                                            }}
                                        />
                                    </View>
                                    {errors.bankDetailsaccountNumber && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.bankDetailsaccountNumber.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow,]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{'IFSC '}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name='bankDetailsIFSC'
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder={labels.ifsc}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('IFSC'),
                                            }}
                                        />
                                    </View>
                                    {errors.bankDetailsIFSC && (
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                            {errors.bankDetailsIFSC.message}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                <View style={[flexRow, justifyBetween, { position: 'absolute', width: '100%', bottom: 0 }]}>
                    <OnboardingButton
                        width={155}
                        title={labels.prev}
                        onChange={handlePrevTwoBtnClick}
                        backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                        color={isActiveBtn ? colors.white : colors.blackOne}
                    />
                    <OnboardingButton
                        width={155}
                        title={labels.saveChanges}
                        onChange={addCustomer}
                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                        color={isActiveBtn ? colors.blackOne : colors.white}
                    />
                </View>
            </View>
        )
    }


    return (
        <View style={[flex1, { backgroundColor: colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[flex1, mt10, mh10]}>
                    <TopHeader headerText={customerData ? labels.editCustomer : labels.addCustomer} searchIcon={false} />
                    <View style={[mv10, mh10, { justifyContent: 'space-evenly' }]}>
                        <TabBar tabs={tabs} activeTab={selectedTab} onTabPress={handleTabPress} borderRadius={20} width={110} />
                        {selectedTab === labels.basicDetails && basicDetails()}
                        {selectedTab === labels.address && address()}
                        {selectedTab === labels.bankDetails && bankDetails()}
                    </View>
                </View>
            </ScrollView>
        </View>
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
export default AddCustomersScreen;