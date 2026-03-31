import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { OnboardingButton } from '../../components/commonButton';
import { TabBar, TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, bg_color_white, flex1, flexRow, justifyBetween, justifyCenter, mh15, mt10, mt15, mv15, mv5 } from '../../utils/theme/commonStyles';
import { alphabetValidation, emailValidation, numericValidation, passwordValidation, requiredValidation } from '../../utils/validationConfig';
import { UploadImageCard } from '../products/uploadImageCard';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { ProfileFormData } from '../../utils/FormDataFunc';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getTopNotchStyle, getMainContainerStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type accountSettingsProps = {}

export interface ProfileData {
    DOB: string
    _id: string
    addressInformation: AddressInformation
    createdAt: string
    email: string
    fcmToken: string
    firstName: string
    fullname: string
    gender: string
    image: string
    isDeleted: boolean
    lastName: string
    mobileNumber: string
    requestForDelete: boolean
    role: string
    status: string
    updatedAt: string
    userId: string
    userName: string
}

export interface AddressInformation {
    address: string
    city: string
    country: string
    postalcode: string
    state: string
}

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    gender: string;
    DOB: string;
    image: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const AccountSettings = (props: accountSettingsProps) => {
    const [profileView, setProfileView] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(labels.basicDetails);
    const navigation = useNavigation();
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showOldPassword, setShowOldPassword] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [gender, setGender] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState(false);
    const [imageData, setImageData] = useState<any>(null);
    const [genderModal, setGenderModal] = useState(false);
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
        getProfile();
    }, []);

    useEffect(() => {
        console.log('profileView', profileView);

        if (profileView) {
            setValue('firstName', profileView.firstName);
            setValue('lastName', profileView.lastName);
            setValue('email', profileView.email);
            setValue('mobileNumber', profileView.mobileNumber);
            setValue('gender', profileView.gender);
            setValue('DOB', profileView.DOB);
            setValue('image', profileView.image);
            setGender(profileView.gender);
        }
    }, [profileView]);

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const getProfile = () => {
        setLoading(true);
        getMethod(
            ApiUrl.settingsProfile,
            success => {
                if (success.code === 200) {
                    setProfileView(success.data);
                    setLoading(false);
                    console.log('Successfully got settings profile', success.data);
                } else {
                    console.log('Failed from settings profile', success.message);
                    setLoading(false);
                }
            },
            error => {
                console.log('Error fetching unit list:', error);
                setLoading(false);
            }
        );
    };

    const updateProfile: SubmitHandler<FormData> = async (formData) => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        if (selectedTab === labels.basicDetails) {
            const formatData = ProfileFormData(getValues(), imageData ?? getValues().image);
            console.log(formatData, 'formatData');

            const { firstName, lastName, DOB, email, mobileNumber, image, gender } = formData;
            putMethod(
                ApiUrl.updateProfile,
                formatData,
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        toast.show("profile Updated successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        navigation.goBack();
                    } else {
                        toast.show("Failed to update profile", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    toast.show("Error in updating profile", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        } else {
            const { oldPassword, newPassword } = formData;
            postMethod(
                ApiUrl.changepassword,
                { oldPassword, newPassword },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        navigation.navigate(screenName.SettingsScreen as never);
                        toast.show("Password Changed", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        toast.show("Could not Change already exist", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log(error);
                    toast.show(error.data?.message ?? "Unable to change password", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        }
    };

    if (loading) {
        return (
            <View style={[flex1, bg_color_white, justifyCenter, alignItemCenter]}>
                <LoadingIndicator />
            </View>
        );
    }
    const DateInputField = ({ label, value, onPress }) => {
        return (
            <View style={{ marginVertical: 10 }}>
                <View style={[flexRow]}>
                   <Text style={[commonStyles.h14blackOne600,mv5]} >{label}</Text>
                    <Text style={{ color: 'red' }}> *</Text>
                </View>
                <TouchableOpacity onPress={onPress} style={styles.input}>
                    <Text style={{ color: colors.black }}>{value}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const tabs = [
        { label: labels.basicDetails },
        { label: labels.changePassword },
    ];

    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
        setIsActiveBtn(false); // Reset isActiveBtn when tab changes
    };

    const handleGenderChange = (item: { value: string }) => {
        setGender(item.value);
        setValue('gender', item.value);
        setGenderModal(false);
    };

    const GenderList = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
    ]

    const handleImage = (picData: any) => {
        console.log('Image clicked', picData);
        setImageData(picData);
    };

    const matchPasswords = (confirmPassword, getValues) => {
        const newPassword = getValues('newPassword'); // Retrieve newPassword value
        return confirmPassword === newPassword || 'Passwords do not match';
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                           <KeyboardAwareScrollView
                                      showsVerticalScrollIndicator={false}
                                      keyboardShouldPersistTaps="handled"
                                      enableAutomaticScroll={true}
                                      extraHeight={Platform.OS === 'ios' ? 90 : 75}
                                    >
                            <View style={[flex1, mh15]}>
                                <View style={[mv15]}>
                                    <TopHeader headerText={labels.accountsettings} />
                                </View>
                                 <View style={[commonStyles.bottomWidth,mv5]} />
                                <View style={[mv15]}>
                                    <TabBar tabs={tabs} activeTab={selectedTab} onTabPress={handleTabPress} borderRadius={50} width={'45%'} />
                                </View>

                                <View style={{ paddingBottom: '30%' }}>
                                    {selectedTab === labels.basicDetails && (
                                        <View>
                                            <UploadImageCard imageTag={handleImage} imgTrue={false} title={labels.customerImage} sizeInfo={labels.sizeOfImg1} onUpload={() => { }} onDelete={() => { }} initialImage={profileView?.image} showDeleteButton={false} />
                                            <View style={[flexRow]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.firstName}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                            <View style={[styles.input, mt10]}>
                                                <Controller
                                                    name={'firstName'}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomTextInput
                                                            placeholder={labels.enterFirstName}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            error={errors['firstName']?.message}
                                                        />
                                                    )}
                                                    rules={{
                                                        required: requiredValidation('first name'),
                                                        validate: alphabetValidation
                                                    }}
                                                />
                                            </View>
                                            {errors.firstName && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.firstName.message}
                                                </Text>
                                            )}
                                            <View style={[flexRow, mt15]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.lastName}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                            <View style={styles.input}>
                                                <Controller
                                                    name={'lastName'}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomTextInput
                                                            placeholder={labels.enterLastName}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            error={errors['lastName']?.message}
                                                        />
                                                    )}
                                                    rules={{
                                                        required: requiredValidation('last name'),
                                                        validate: alphabetValidation
                                                    }}
                                                />
                                            </View>
                                            {errors.lastName && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.lastName.message}
                                                </Text>
                                            )}
                                            <View style={[flexRow, mt15]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.email}</Text>
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
                                                            error={errors['email']?.message}
                                                        />
                                                    )}
                                                    rules={{
                                                        required: requiredValidation('email'),
                                                        validate: emailValidation
                                                    }}
                                                />

                                            </View>
                                            {errors.email && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.email.message}
                                                </Text>
                                            )}
                                            <View style={[flexRow, mt15]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.mobileNumber}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                            <View style={styles.input}>
                                                <Controller
                                                    name={'mobileNumber'}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomTextInput
                                                            placeholder={labels.mobileNumber}
                                                            value={value}
                                                            maxLength={10}
                                                            keyboardType='number-pad'
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            error={errors['mobileNumber']?.message}

                                                        />
                                                    )}
                                                    rules={{
                                                        required: requiredValidation('mobile number'),
                                                        validate: numericValidation

                                                    }}
                                                />
                                            </View>
                                            {errors.mobileNumber && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.mobileNumber.message}
                                                </Text>
                                            )}
                                            <View style={[flexRow, mt15]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.gender}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                            <View >
                                                <Controller
                                                    name="gender"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CommonDropDownPicker
                                                            ListData={GenderList}
                                                            dropdownValue={gender}
                                                            handleDropdownChange={handleGenderChange}
                                                            isFocus={isFocus}
                                                            setIsFocus={setIsFocus}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder={labels.gender}
                                                        />
                                                    )}
                                                    rules={{
                                                        required: 'Gender is required',
                                                    }}
                                                />
                                            </View>
                                            {errors.gender && (
                                                <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                    {errors.gender.message}
                                                </Text>
                                            )}

                                            <Controller
                                                name="DOB"
                                                control={control}
                                                defaultValue=""
                                                render={({ field: { onChange, value } }) => (
                                                    <DateInputField
                                                        label="Date"
                                                        value={value ? new Date(value).toLocaleDateString() : date.toLocaleDateString()}
                                                        onPress={() => setIsDatePickerOpen(true)}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('DOB'),
                                                }}
                                            />
                                            {errors.DOB && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.DOB.message}
                                                </Text>
                                            )}
                                            <DatePicker
                                                modal
                                                open={isDatePickerOpen}
                                                date={date}
                                                maximumDate={new Date()}
                                                mode="date"
                                                onConfirm={(selectedDate) => {
                                                    setIsDatePickerOpen(false);
                                                    setDate(selectedDate);
                                                    setValue('DOB', selectedDate.toISOString());
                                                }}
                                                onCancel={() => setIsDatePickerOpen(false)}
                                            />
                                        </View>
                                    )}
                                    {selectedTab === labels.changePassword && (
                                        <View>
                                            <View style={[flexRow]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.oldPassword}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                            <View style={styles.input1}>
                                                <Controller
                                                    name={'oldPassword'}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomTextInput
                                                            placeholder={labels.enterOldPassword}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            // error={errors['oldPassword']?.message}
                                                            secureTextEntry={showOldPassword}
                                                        />
                                                    )}
                                                    rules={{
                                                        required: requiredValidation('Old password'),
                                                    }}
                                                />
                                                <TouchableOpacity style={[alignSelfCenter]} onPress={toggleOldPasswordVisibility}>
                                                    <CustomIcon
                                                        name={!showOldPassword ? 'eye' : 'eye-off'}
                                                        size={16}
                                                        color={colors.grey}
                                                        type="Feather"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {errors.oldPassword && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.oldPassword.message}
                                                </Text>
                                            )}
                                            <View style={[flexRow, mt15]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.newPassword}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                            <View style={styles.input1}>
                                                <Controller
                                                    name={'newPassword'}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomTextInput
                                                            placeholder={labels.enterNewPassword}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            // error={errors['newPassword']?.message}
                                                            secureTextEntry={showNewPassword}
                                                        />
                                                    )}
                                                    rules={{
                                                        required: requiredValidation('New password'),
                                                        validate: passwordValidation
                                                    }}
                                                />
                                                <TouchableOpacity style={[alignSelfCenter]} onPress={toggleNewPasswordVisibility}>
                                                    <CustomIcon
                                                        name={!showNewPassword ? 'eye' : 'eye-off'}
                                                        size={16}
                                                        color={colors.grey}
                                                        type="Feather"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {errors.newPassword && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.newPassword.message}
                                                </Text>
                                            )}
                                            <View style={[flexRow, mt15]}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.confirmPassword}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                            <View style={styles.input1}>
                                                <Controller
                                                    name={'confirmPassword'}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomTextInput
                                                            placeholder={labels.enterConfirmPassword}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            // error={errors['confirmPassword']?.message}
                                                            secureTextEntry={showConfirmPassword}

                                                        />
                                                    )}
                                                    rules={{
                                                        required: requiredValidation('Confirm password'),
                                                        validate: (value) => matchPasswords(value, getValues), // Pass the function with getValues


                                                    }}
                                                />
                                                <TouchableOpacity style={[alignSelfCenter]} onPress={toggleConfirmPasswordVisibility}>
                                                    <CustomIcon
                                                        name={!showConfirmPassword ? 'eye' : 'eye-off'}
                                                        size={16}
                                                        color={colors.grey}
                                                        type="Feather"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {errors.confirmPassword && (
                                                <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                    {errors.confirmPassword.message}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>

                            </View>
                            {(selectedTab === labels.basicDetails || selectedTab === labels.changePassword) && (
                                <View style={styles.bottomButtonsContainer}>
                                    <OnboardingButton
                                        width={DevWidth / 2.3}
                                        title={labels.cancel}
                                        onChange={() => navigation.goBack()}
                                        backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                                        color={isActiveBtn ? colors.white : colors.blackOne}
                                    />
                                    <OnboardingButton
                                        width={DevWidth / 2.3}
                                        title={labels.saveChanges}
                                        onChange={handleSubmit(updateProfile)}
                                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                                        color={isActiveBtn ? colors.blackOne : colors.white}
                                    />
                                </View>
                            )}
                        </KeyboardAwareScrollView>
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
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        justifyContent: 'center',
    },
    input1: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        justifyContent: 'space-between',
        flexDirection: 'row'

    },
    modalItem: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        marginHorizontal: 20,
    },
});

export default AccountSettings;
