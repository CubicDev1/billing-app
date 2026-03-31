import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { RoundCheckBox, TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { getMethod, postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { flex1, flexRow, mh15, mt15, mv15, mv5 } from '../../utils/theme/commonStyles';
import { requiredValidation } from '../../utils/validationConfig';
import { Data } from './vendorsScreen';
import { useDispatch } from 'react-redux';
import * as TYPES from '../../action/ActionType';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export type addVendorProps = {
    navigation: StackNavigationProp<RootStackParamList, 'AddVendor'>;
    route: RouteProp<RootStackParamList, 'AddVendor'>;
}

type RootStackParamList = {
    AddVendor: { vendorsDatas?: Data };
};

type FormData = {
    balance: string;
    balanceType: string;
    vendor_email: string;
    vendor_name: string;
    vendor_phone: string;
};

const AddVendor = (props: addVendorProps) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [isChecked, setIsChecked] = useState('');
    const dispatch = useDispatch();
    const toast = useToast();
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        trigger,
        getValues,
    } = useForm<FormData>();

    useEffect(() => {
        const vendorData = route.params?.vendorsDatas;
        if (vendorData) {
            const { vendor_name, vendor_email, vendor_phone, balance, balanceType } = vendorData;
            setValue('vendor_name', vendor_name);
            setValue('vendor_email', vendor_email);
            setValue('vendor_phone', vendor_phone);
            setValue('balance', String(balance)); // Convert to string if it is a number
            setValue('balanceType', balanceType);
            setIsChecked(balanceType);
        }
    }, [route.params, setValue]);

    const handleDebitClick = () => {
        setIsChecked('Debit');
        setValue('balanceType', 'Debit');
    };

    const handleCreditClick = () => {
        setIsChecked('Credit');
        setValue('balanceType', 'Credit');
    };

    const handleCancelBtnClick = () => {
        setIsActiveBtn(false);
        navigation.navigate(screenName.VendorsScreen as never);
    };

    const addVendor = async () => {
        const isValid = await trigger();

        const phoneNumber = getValues().vendor_phone;
        const email = getValues().vendor_email;

        if (!isValid || isChecked === '') {
            if (email && !/\S+@\S+\.\S+/.test(email)) {
                toast.show("Email is invalid", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                return;
            }
            if (phoneNumber && phoneNumber.length !== 10) {
                toast.show("Phone number must be 10 digits'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                return;
            }
            toast.show("Please fill all the fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }
        console.log("add vendor formdata", getValues());
        const vendorData = route.params?.vendorsDatas;

        if (vendorData) {
            putMethod(
                `${ApiUrl.editVendor}/${vendorData._id}`, // Assuming there's an endpoint to update units with an ID
                getValues(),
                async (response: any) => {
                    if (response.code == 200) {
                        setIsActiveBtn(true);
                        handleNavigate();
                        toast.show("Vendor Updated Successfully'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        toast.show(response.data.message, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log(error);
                    toast.show("Error in updating vendor", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        } else {
            postMethod(
                ApiUrl.addVendor,
                getValues(),
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        handleNavigate();
                        toast.show("Vendor Added Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        console.log(response);
                        toast.show("response.data.message", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log(error);
                    toast.show("error.data.message", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        }
    };

    const handleNavigate = () => {
        getMethod(
            ApiUrl.dropDownVendor,
            success => {
                if (success.code === 200) {
                    //console.log('Successfully got vendor list', success.data);
                    dispatch({ type: TYPES.VENDOR_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get vendor list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching vendor list:', error);
            }
        );
        navigation.navigate(screenName.VendorsScreen as never);
    }

    const isEditMode = !!route.params?.vendorsDatas;

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={isEditMode ? 'Edit Vendor' : labels.addVendor} />
                            </View>
                            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              extraHeight={Platform.OS === 'ios' ? 90 : 75}
            >
                                <View style={{ paddingBottom: '50%' }}>
                                    <View style={{ marginVertical: 15 }}>
                                        <View style={[flexRow]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{'Name'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'vendor_name'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterName}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        maxLength={30}
                                                    // error={errors['vendor_name']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('Name'),
                                                }}
                                            />
                                        </View>
                                        {errors.vendor_name && (
                                            <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                {errors.vendor_name.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]}>{'Email'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'vendor_email'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterEmailAddress}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                    // error={errors['vendor_email']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /\S+@\S+\.\S+/,
                                                        message: 'Email is invalid',
                                                    },
                                                }}
                                            />
                                        </View>
                                        {errors.vendor_email && (
                                            <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                {errors.vendor_email.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.phoneNumber}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'vendor_phone'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterPhoneNumber}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        maxLength={10}
                                                        keyboardType={'numeric'}
                                                        textColor={colors.black}
                                                    // error={errors['vendor_phone']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: 'Phone number is required',
                                                    minLength: {
                                                        value: 10,
                                                        message: 'Phone number must be 10 digits',
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message: 'Phone number must be 10 digits',
                                                    },
                                                }}
                                            />
                                        </View>
                                        {errors.vendor_phone && (
                                            <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                {errors.vendor_phone.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow, mt15]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.closingBalance}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'balance'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterBalanceAmount}
                                                        value={value}
                                                        keyboardType={'numeric'}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        maxLength={8}
                                                    // error={errors['balance']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation(labels.closingBalance),
                                                }}
                                            />
                                        </View>
                                        {errors.balance && (
                                            <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                {errors.balance.message}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={[flexRow]}>
                                       <Text style={[commonStyles.h14blackOne600,mv5]} >{'Mode'}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
                                        <RoundCheckBox
                                            title={labels.debit}
                                            onChange={handleDebitClick}
                                            borderColor={isChecked === 'Debit' ? colors.primary : colors.greyFour}
                                            backgroundColor={isChecked === 'Debit' ? colors.primary : 'transparent'}
                                            textColor={isChecked === 'Debit' ? colors.primary : colors.blackTwo}
                                        />
                                        <RoundCheckBox
                                            title={labels.credit}
                                            onChange={handleCreditClick}
                                            borderColor={isChecked === 'Credit' ? colors.primary : colors.greyFour}
                                            backgroundColor={isChecked === 'Credit' ? colors.primary : 'transparent'}
                                            textColor={isChecked === 'Credit' ? colors.primary : colors.blackTwo}
                                        />
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                        <View style={styles.bottomButtonsContainer}>
                            <OnboardingButton
                                width={160}
                                title={labels.cancel}
                                onChange={handleCancelBtnClick}
                                backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                                color={isActiveBtn ? colors.white : colors.blackOne}
                            />
                            <OnboardingButton
                                width={160}
                                title={isEditMode ? 'Update' : 'Add'}
                                onChange={addVendor}
                                backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                                color={isActiveBtn ? colors.blackOne : colors.white}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        // position: 'absolute',
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
        justifyContent: 'center',
    },
});

export default AddVendor;
