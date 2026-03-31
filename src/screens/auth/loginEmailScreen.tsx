import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInput } from '../../components/commonInputFields';
// import ResponsePopupCard from '../../components/responsePopupCard';
import { postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { GroupCircle1, SplashScreenImage } from '../../utils/svg';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyAround, justifyCenter, mh15, mv5 } from '../../utils/theme/commonStyles';
import { requiredValidation } from '../../utils/validationConfig';
import { storageKeys, storeData } from '../../utils/async';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getMainContainerStyle, getSubContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type LoginEmailScreenProps = {};

type FormData = {
    email: string;
    password: string;
};

const LoginEmailScreen: React.FC<LoginEmailScreenProps> = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [invalidModalVisible, setInvalidModalVisible] = useState(false);
    const toast = useToast();

    const navigation = useNavigation();

    const {
        handleSubmit,
        control,
        getValues,
        formState: { errors },
        trigger, // Function to manually trigger validation
    } = useForm<FormData>();

    const openSuccessModal = () => {
        setSuccessModalVisible(true);
        setTimeout(() => {
            setSuccessModalVisible(false);
        }, 2000);
    };
    const onLogin: SubmitHandler<FormData> = async (formData) => {
        console.log("formData", formData);

        const isValid = await trigger();
        console.log(isValid, "isvalidss");

        if (!isValid) {
            toast.show("Please enter valid email  ", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            setInvalidModalVisible(true);
            return;
        }
        const { email, password } = getValues();
        console.log("email, password", email, password);

        try {
            postMethod(
                ApiUrl.login,
                { email, password },
                async (response: any) => {
                    if (response && response.data.token) {
                        await storeData(storageKeys.loginDetails, response.data.token);
                        await AsyncStorage.setItem('token', response.data.token);
                        openSuccessModal();
                        toast.show("Login Successful", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        navigation.reset({
                            index: 0,
                            routes: [{ name: screenName.DashboardScreen }],
                        });
                    } else {
                        setInvalidModalVisible(true);
                    }
                },
                (error) => {
                    if (error.code === 403 && error.data && error.data.message) {
                        toast.show(error.data.message, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        setInvalidModalVisible(true);
                    } else {
                        setInvalidModalVisible(true);
                    }
                }
            );
        }
        catch (error) {
            console.log("error", error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const closeModal = () => {
        setSuccessModalVisible(false);
        setInvalidModalVisible(false);
    };

    const handleCheckLogin = () => {
        console.log(getValues(), "getvalue");
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        enableAutomaticScroll={true}
                        extraHeight={Platform.OS === 'ios' ? 90 : 75}
                    >
                        <View style={{ backgroundColor: colors.primary }}>
                            <View style={[flexRow]}>
                                <View style={[flexRow, justifyAround]}>
                                    <View style={[mh15]}>
                                        <GroupCircle1 width={200} height={100} />
                                    </View>

                                    <Image
                                        source={require('../../../assets/images/png/group1.png')}
                                        style={{ height: 320, width: 280 }}
                                    />
                                </View>
                            </View>
                            <View style={[justifyCenter, alignItemCenter, { position: 'absolute', alignSelf: 'center', top: '10%' }]}>
                                <SplashScreenImage width={110} height={80} />
                            </View>
                            <View>
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        height: '100%',
                                        borderTopLeftRadius: 40,
                                        borderTopRightRadius: 40,
                                        width: '100%',
                                        top: 0,
                                    }}>
                                    <View style={{ marginHorizontal: 20 }}>
                                        <View style={{ marginVertical: 30 }}>
                                            <Text style={commonStyles.h28blackOne700}>{labels.welcomeBack}</Text>
                                            <Text style={commonStyles.h16blackTwo400}>{labels.loginMessage}</Text>

                                        </View>
                                        <View style={{ marginVertical: 15 }}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.email}</Text>
                                            <View style={styles.input}>
                                                <Controller
                                                    name={'email'}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomTextInput
                                                            placeholder={labels.emailAddress}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            autoCapitalize="none"
                                                            keyboardType='email-address'
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
                                                <View style={[alignSelfCenter]}>
                                                    <CustomIcon name='email-outline' size={16} color={colors.grey} type='MaterialCommunityIcons' />
                                                </View>
                                            </View>
                                            {errors.email && (
                                                <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                    {errors.email.message}
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.password}</Text>
                                        <View style={styles.input}>
                                            <Controller
                                                name="password"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.password}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        secureTextEntry={showPassword}
                                                        textColor={colors.black}
                                                    // error={errors['password']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation("Password"),
                                                }}
                                            />
                                            <TouchableOpacity style={[alignSelfCenter]} onPress={togglePasswordVisibility}>
                                                <CustomIcon
                                                    name={!showPassword ? 'eye' : 'eye-off'}
                                                    size={16}
                                                    color={colors.grey}
                                                    type="Feather"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {errors.password && (
                                            <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                {errors.password.message}
                                            </Text>
                                        )}
                                        <View style={{ alignItems: 'flex-end', }}>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate(screenName.ForgetPassword as never)
                                            }}>
                                                <Text style={{ fontSize: 15, fontWeight: '400', marginTop: 20, color: colors.blackTwo }}>{labels.forgetPassword} </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{}}>
                                            <OnboardingButton
                                                title={labels.logIn}
                                                onChange={onLogin}
                                                backgroundColor={colors.primary}
                                                color={colors.white}
                                                icon={true}
                                            />
                                        </View>
                                        <View style={{ alignItems: 'center', marginVertical: 10 }}>
                                            <TouchableOpacity onPress={() => {
                                                navigation.goBack();
                                            }}>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.greySix, alignItems: 'center' }}>{labels.back} </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};





export default LoginEmailScreen;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})