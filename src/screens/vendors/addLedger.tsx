import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { OnboardingButton } from '../../components/commonButton';
import { RoundCheckBox, TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { flex1, flexRow, justifyStart, mh15, mt15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { numericValidation, requiredValidation } from '../../utils/validationConfig';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getTopNotchStyle, getMainContainerStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type AddLedgerProps = {
    route: {
        params: {
            vendorId: string;
        };
    };
};
type FormData = {
    amount: string;
    date: string;
    mode: string;
    name: string;
    reference: number;
    vendorId: string;
}

const AddLedger = ({ route }: AddLedgerProps) => {
    const navigation = useNavigation();
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [date, setDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const { vendorId } = route.params;
    const toast = useToast();
    console.log(vendorId, 'Vendor ID******')

    const {
        handleSubmit,
        control,
        formState: { errors },
        trigger,
    } = useForm<FormData>();

    const handleDebitClick = () => {
        setIsChecked(true);
    };

    const handleCreditClick = () => {
        setIsChecked(false);
    };

    const handleCancelBtnClick = () => {
        setIsActiveBtn(false);
        navigation.goBack();
    };

    const addVendor: SubmitHandler<FormData> = async (formData) => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        const { amount, reference, name } = formData;
        const mode = isChecked ? 'Debit' : 'Credit'; // Determine mode based on isChecked state
        postMethod(
            ApiUrl.addLedger,
            { amount, date: date.toISOString(), reference, name, mode, vendorId },
            async (response: any) => {
                if (response && response.data) {
                    setIsActiveBtn(true);
                    navigation.navigate(screenName.LedgersScreen as never);
                    toast.show("Ledger Added", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                } else {
                    toast.show("Error in adding vendor", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            (error) => {
                console.log(error,)
                toast.show("Error in Ledger vendor", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
        );
    };

    const DateInputField = ({ label, value, onPress }: any) => {
        return (
            <View style={{ marginVertical: 10 }}>
                <View style={[flexRow]}>
                    <Text style={[commonStyles.h14blackOne600, mv5]}>{label}</Text>
                    <Text style={{ color: 'red' }}> *</Text>
                </View>
                <TouchableOpacity onPress={onPress} style={styles.input}>
                    <Text style={{ color: colors.black }}>{value}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.addLedger} />
                            </View>
                            <KeyboardAwareScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                enableAutomaticScroll={true}
                                extraHeight={Platform.OS === 'ios' ? 90 : 75}
                            >
                                <View style={{}}>
                                    <View style={[flexRow]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]}>{'Name'}</Text>
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
                                                    maxLength={30}
                                                // error={errors['name']?.message}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('name'),
                                            }}
                                        />
                                    </View>
                                    {errors.name && (
                                        <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                            {errors.name.message}
                                        </Text>
                                    )}
                                    <View style={[]}>
                                        <DateInputField
                                            label={labels.date}
                                            value={date.toDateString()}
                                            onPress={() => setIsDatePickerOpen(true)}
                                        />
                                    </View>
                                    <View style={[flexRow]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.referenceNumber}</Text>
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
                                                    maxLength={30}
                                                // error={errors['reference']?.message}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('reference'),
                                            }}
                                        />
                                    </View>
                                    {errors.reference && (
                                        <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                            {errors.reference.message}
                                        </Text>
                                    )}
                                    <View style={[flexRow, mt15]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.amount}</Text>
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
                                                    maxLength={8}
                                                    keyboardType='numeric'
                                                // error={errors['amount']?.message}
                                                />
                                            )}
                                            rules={{
                                                required: requiredValidation('amount'),
                                                validate: numericValidation
                                            }}
                                        />
                                    </View>
                                    {errors.amount && (
                                        <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                            {errors.amount.message}
                                        </Text>
                                    )}
                                    <Text style={[commonStyles.h14blackOne600, mv10, mt15]}>{'Mode'}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
                                        <RoundCheckBox
                                            title={labels.debit}
                                            onChange={handleDebitClick}
                                            borderColor={isChecked ? colors.primary : colors.greyFour}
                                            backgroundColor={isChecked ? colors.primary : 'transparent'}
                                            textColor={isChecked ? colors.primary : colors.blackTwo} />
                                        <RoundCheckBox
                                            title={labels.credit}
                                            onChange={handleCreditClick}
                                            borderColor={isChecked ? colors.greyFour : colors.primary}
                                            backgroundColor={isChecked ? 'transparent' : colors.primary}
                                            textColor={isChecked ? colors.blackTwo : colors.primary} />
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
                                title={'Submit'}
                                onChange={handleSubmit(addVendor)}
                                backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                                color={isActiveBtn ? colors.blackOne : colors.white}
                            />
                        </View>
                        <DatePicker
                            modal
                            open={isDatePickerOpen}
                            date={date}
                            onConfirm={(selectedDate) => {
                                setDate(selectedDate);
                                setIsDatePickerOpen(false);
                            }}
                            onCancel={() => {
                                setIsDatePickerOpen(false);
                            }}
                        />
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

export default AddLedger;
