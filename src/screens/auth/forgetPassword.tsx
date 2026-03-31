import { useNavigation } from '@react-navigation/native';
import React, { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, ScrollView, Text, StyleSheet, TouchableOpacity, View, SafeAreaView, Platform } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInputField } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { H16Primary700, H16blackTwo400, H16greySix700, H28blackOne700, MainContainer, SubContainer, TopNotch } from '../../utils/styledComponents';
import { GroupCircle1, SplashScreenImage } from '../../utils/svg';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyAround, justifyCenter, mh15, mv15 } from '../../utils/theme/commonStyles';
import { postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { requiredValidation } from '../../utils/validationConfig';
import { CustomTextInput } from '../../components/commonInputFields';
import { useToast } from 'react-native-toast-notifications';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type forgetPasswordProps = {

}


const ForgetPassword = (props: forgetPasswordProps) => {

    const navigation = useNavigation()
    const toast = useToast();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    const formKeys = {
        email: 'email',
    }

    const resetPwd = () => {
        postMethod(
            ApiUrl.forgetPassword,
            { email: getValues(formKeys.email) },
            (success: { code: number; message: any; }) => {
                if (success.code == 200) {
                    toast.show(success.data?.message), {
                        type: "success",
                        placement: "bottom",
                        duration: 500,
                        successColor: colors.green,
                        animationType: "zoom-in",
                    };
                } else {
                    toast.show(success.data?.message), {
                        type: "success",
                        placement: "bottom",
                        duration: 500,
                        successColor: colors.green,
                        animationType: "zoom-in",
                    };
                }
            },
            error => {
                toast.show(error.data.message), {
                    type: "success",
                    placement: "bottom",
                    duration: 500,
                    successColor: colors.green,
                    animationType: "zoom-in",
                };
                console.log('Error deleting purchase:', error);
            }
        );
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>

                    <View style={{ flex: 1 }} >
                         <KeyboardAwareScrollView
                                      showsVerticalScrollIndicator={false}
                                      keyboardShouldPersistTaps="handled"
                                      enableAutomaticScroll={true}
                                      extraHeight={Platform.OS === 'ios' ? 90 : 75}
                                    >
                            <Fragment>
                                <View style={{ backgroundColor: colors.primary, flex: 1 }}>
                                    <View style={[flexRow]}>
                                        <View style={[flexRow, justifyAround]}>
                                            <View style={[mh15]}>
                                                <GroupCircle1 width={200} height={100} />
                                            </View>
                                            <View style={[justifyCenter, alignItemCenter]}>
                                                <SplashScreenImage width={110} height={80} />
                                            </View>
                                            {/* <Image source={require('../../../assets/images/png/group1.png')} style={{ height: 400, width: 280 }} /> */}
                                        </View>
                                    </View>
                                    <View style={{ bottom: '10%' }}>
                                        <View style={{ backgroundColor: 'white', height: '100%', borderTopLeftRadius: 40, borderTopRightRadius: 40, width: '100%', top: 0 }}>
                                            <View style={{ marginHorizontal: 20 }}>
                                                <View style={{ marginVertical: 30 }}>
                                                    <Text style={commonStyles.h28blackOne700}>{labels.forgetPassword}</Text>
                                                    <Text style={commonStyles.h16blackTwo400}>{labels.enterYourEmailtogetapasswordresetlink}</Text>
                                                </View>
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
                                                </View>
                                                {errors?.email && (
                                                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                                        {errors.email.message}
                                                    </Text>
                                                )}
                                                <OnboardingButton
                                                    title={labels.resetPassword}
                                                    onChange={handleSubmit(resetPwd)}
                                                    backgroundColor={colors.primary}
                                                    color={colors.white}
                                                    icon={true}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={[mv15]} onPress={() => { navigation.goBack() }}>
                                    <H16greySix700 style={[alignSelfCenter]}>{labels.rememberYourPassword}
                                        <Text style={[commonStyles.h16Primary700]}>{' Login '}</Text>
                                    </H16greySix700>
                                </TouchableOpacity>
                            </Fragment>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

export default ForgetPassword

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