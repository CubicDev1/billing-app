import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import {
    CustomTextInputField,
    ToggleSwitch,
} from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import {
    flex1,
    flexRow,
    justifyBetween,
    mh10,
    mt10,
    mv10,
    mv15,
    mv5,
} from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import SignatureScreen from 'react-native-signature-canvas';
import { alphabetValidation, alphanumericValidation, numericValidation, requiredValidation } from '../../utils/validationConfig';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, KeyboardAScrollView } from '../../utils/commonStyles';
export type SettingsComponentsProps = {
    onSave: () => void;
    onCancel: () => void;
    data?: any;
    taxData: any;
};

type BankDetails = {
    IFSCCode: string;
    accountNumber: string;
    bankName: string;
    branch: string;
    name: string;
    _id: string;
};

export const AddBankDetails = ({
    onSave,
    onCancel,
    prefilledBankData,
}: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const toast = useToast();
    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    const handleSaveBtnClick = () => {
        setIsActiveBtn(false);
        onSave();
    };

    const {
        handleSubmit,
        control,
        trigger,
        setValue,
        formState: { errors },
    } = useForm<BankDetails>();

    useEffect(() => {
        if (prefilledBankData) {
            setValue('name', prefilledBankData.name);
            setValue('bankName', prefilledBankData.bankName);
            setValue('branch', prefilledBankData.branch);
            setValue('accountNumber', prefilledBankData.accountNumber);
            setValue('IFSCCode', prefilledBankData.IFSCCode);
            setValue('_id', prefilledBankData._id);
        }
    }, []);

    const addBank: SubmitHandler<BankDetails> = async formData => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        const { name, bankName, branch, IFSCCode, accountNumber, _id } = formData;

        if (prefilledBankData) {
            putMethod(
                `${ApiUrl.updateBankDetails}/${prefilledBankData._id}`,
                { name, bankName, branch, IFSCCode, accountNumber, _id },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        toast.show("Bank Updated", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        onCancel();
                    } else {
                        toast.show("Already exists", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    toast.show("Unable to add bank", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                },
            );
        } else {
            postMethod(
                ApiUrl.addBank,
                { name, bankName, branch, IFSCCode, accountNumber },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        toast.show("Bank Added", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        onCancel();
                    } else {
                        toast.show("Already exists", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    toast.show("Unable to add bank", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                },
            );
        }
    };

    return (
        <View style={[flex1]}>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              extraHeight={Platform.OS === 'ios' ? 90 : 75}
            >
                <View style={{ paddingBottom: 80 }}>
                    <View style={[flexRow, mt10]}>
                       <Text style={[commonStyles.h14blackOne600,mv5]} >
                            {labels.bankName}
                        </Text>
                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                    </View>
                    <View style={styles.input}>
                        <Controller
                            name="bankName"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    placeholder="Enter Bank Name"
                                    value={value}
                                    onChangeText={onChange}
                                    textColor={colors.black}
                                // error={errors['bankName']?.message}
                                />
                            )}
                            rules={{
                                required: 'Bank Name is required',
                                validate: alphabetValidation

                            }}
                        />

                    </View>
                    {errors.bankName && (
                        <Text style={{ color: colors.danger, marginTop: 2 }}>
                            {errors.bankName.message}
                        </Text>
                    )}
                    <View style={[flexRow, mt10]}>
                       <Text style={[commonStyles.h14blackOne600,mv5]}>
                            {'Account Number'}
                        </Text>
                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                    </View>
                    <View style={styles.input}>
                        <Controller
                            name="accountNumber"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    placeholder="Enter Account Number"
                                    value={value}
                                    onChangeText={onChange}
                                    textColor={colors.black}
                                    keyboardType="numeric"
                                    // error={errors['accountNumber']?.message}
                                    maxLength={16}

                                />
                            )}
                            rules={{
                                required: 'Account Number is required',
                                validate: numericValidation
                            }}
                        />
                    </View>
                    {errors.accountNumber && (
                        <Text style={{ color: colors.danger, marginTop: 2 }}>
                            {errors.accountNumber.message}
                        </Text>
                    )}
                    <View style={[flexRow, mt10]}>
                       <Text style={[commonStyles.h14blackOne600,mv5]} >
                            {'Account Holder Name'}
                        </Text>
                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                    </View>
                    <View style={styles.input}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    placeholder="Enter Account Holder Name"
                                    value={value}
                                    onChangeText={onChange}
                                    textColor={colors.black}
                                // error={errors['name']?.message}
                                />
                            )}
                            rules={{
                                required: 'Account Holder Name is required',
                                validate: alphabetValidation
                            }}
                        />
                    </View>
                    {errors.name && (
                        <Text style={{ color: colors.danger, marginTop: 2 }}>
                            {errors.name.message}
                        </Text>
                    )}

                    <View style={[flexRow, mt10]}>
                       <Text style={[commonStyles.h14blackOne600,mv5]} >
                            {'Branch'}
                        </Text>
                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                    </View>
                    <View style={styles.input}>
                        <Controller
                            name="branch"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    placeholder="Enter Branch Name"
                                    value={value}
                                    onChangeText={onChange}
                                    textColor={colors.black}
                                // error={errors['branch']?.message}
                                />
                            )}
                            rules={{
                                required: 'Branch Name is required',
                                validate: alphabetValidation
                            }}
                        />
                    </View>
                    {errors.branch && (
                        <Text style={{ color: colors.danger, marginTop: 2 }}>
                            {errors.branch.message}
                        </Text>
                    )}
                    <View style={[flexRow]}>
                       <Text style={[commonStyles.h14blackOne600,mv5]} >
                            {'IFSC Code'}
                        </Text>
                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                    </View>
                    <View style={styles.input}>
                        <Controller
                            name="IFSCCode"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    placeholder="Enter IFSC Code"
                                    value={value}
                                    onChangeText={onChange}
                                    textColor={colors.black}
                                    // error={errors['IFSCCode']?.message}
                                    maxLength={13}
                                />
                            )}
                            rules={{
                                required: 'IFSC Code is required',
                                validate: alphanumericValidation
                            }}
                        />

                    </View>
                    {errors.IFSCCode && (
                        <Text style={{ color: colors.danger, marginTop: 2 }}>
                            {errors.IFSCCode.message}
                        </Text>
                    )}
                </View>

                <View style={styles.bottomButtonsContainer}>
                    <OnboardingButton
                        width={DevWidth / 2.3}
                        title={labels.cancel}
                        onChange={handleCancelBtnClick}
                        backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                        color={isActiveBtn ? colors.white : colors.blackOne}
                    />
                    <OnboardingButton
                        width={DevWidth / 2.3}
                        title={labels.saveChanges}
                        onChange={handleSubmit(addBank)} // Trigger validation and submission
                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                        color={isActiveBtn ? colors.blackOne : colors.white}
                    />
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

// =========================================== ADD TAXS RATES ===============================================
type FormData = {
    name: string;
    status: boolean;
    taxRate: string;
    type: string;
    _id: string;
};

export const AddTaxRates = ({
    onSave,
    onCancel,
    preFilledData,
}: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [toggleVisible, setToggleVisible] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedType, setSelectedType] = useState(''); // State to hold selected type
    const toast = useToast();

    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    useEffect(() => {
        if (preFilledData) {
            // setSelectedType(preFilledData.type === '1' ? 'Percentage' : 'Fixed');
            // setValue('type', preFilledData.type);
            setToggleVisible(preFilledData.status);
            setValue('name', preFilledData.name);
            setValue('taxRate', preFilledData.taxRate);
        }
        setSelectedType("Percentage");
        setValue('type', "1");
    }, []);

    const navigation = useNavigation();

    const {
        handleSubmit,
        control,
        trigger,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        setValue('status', toggleVisible);
    }, [toggleVisible, setValue]);

    const addTaxRate: SubmitHandler<FormData> = async formData => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }
        const { name, taxRate, status, _id, type } = formData;
        if (preFilledData) {
            putMethod(
                `${ApiUrl.updateTax}/${preFilledData._id}`, // Assuming there's an endpoint to update units with an ID
                { name, taxRate, status, _id, type: "1" },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        onCancel();
                        toast.show("Tax Rate Updated", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        toast.show("Already Exist", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    toast.show("Error in updating tax rate", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                },
            );
        } else {
            postMethod(
                ApiUrl.addTax,
                { name, taxRate, type: selectedType, status }, // Pass selected type
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        navigation.navigate(screenName.TaxRate as never);
                        onCancel();
                        toast.show("Tax Rate Added", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        toast.show("Already exists", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    toast.show("Already exists", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                },
            );
        }
    };

    const handleToggleChange = () => {
        setToggleVisible(!toggleVisible);
    };

    const handleTypeSelect = (type: string) => {
        if (type === '1') {
            setSelectedType('Percentage'); // Set selected type as "Percentage"
            setValue('type', '1');
        } else if (type === '2') {
            setSelectedType('Fixed'); // Set selected type as "Fixed"
            setValue('type', '2');
        }
        setShowDropdown(false); // Hide dropdown after selection
    };

    return (
        <View style={[flex1]}>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              extraHeight={Platform.OS === 'ios' ? 90 : 75}
            >
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={'Add Tax'} iconPress={onCancel} />
                    <View style={[mv10]}>
                        <View style={[flexRow]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >
                                {'Name'}
                            </Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={styles.input}>
                            <Controller
                                name={'name'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={'Enter Name'}
                                        value={value}
                                        onChangeText={onChange}
                                        textColor={colors.black}
                                        // error={errors['name']?.message}
                                        maxLength={25}
                                    />
                                )}
                                rules={{
                                    required: 'Name is required',
                                    validate: alphabetValidation
                                }}
                            />
                        </View>
                        {errors.name && (
                            <Text style={{ color: colors.danger, marginTop: 2 }}>
                                {errors.name.message}
                            </Text>
                        )}
                        <View style={[flexRow, mt10]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >
                                {'Tax Rate'}
                            </Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={styles.input}>
                            <Controller
                                name={'taxRate'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={'Enter Tax Rate'}
                                        value={value}
                                        onChangeText={onChange}
                                        textColor={colors.black}
                                        // error={errors['taxRate']?.message}
                                        maxLength={3}
                                    />
                                )}
                                rules={{
                                    required: 'Tax Rate is required',
                                    validate: numericValidation,
                                }}
                            />
                        </View>
                        {errors.taxRate && (
                            <Text style={{ color: colors.danger, marginTop: 2 }}>
                                {errors.taxRate.message}
                            </Text>
                        )}
                        <View style={[flexRow, mt10]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >
                                {'Type'}
                            </Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>


                        <View >
                            <Controller
                                name="type"
                                control={control}
                                rules={{
                                    required: 'Type is required',
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <TouchableOpacity
                                            disabled
                                            style={[styles.input]}
                                            onPress={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
                                        >
                                            <Text
                                                style={{
                                                    color: selectedType ? colors.black : colors.greySix,
                                                }}>
                                                {selectedType || 'Select Type'}
                                            </Text>
                                        </TouchableOpacity>
                                        {showDropdown && (
                                            <View style={styles.dropdownContainer}>
                                                <TouchableOpacity
                                                    disabled
                                                    onPress={() => handleTypeSelect('1')}
                                                    style={styles.dropdownItem}>
                                                    <Text style={[commonStyles.h14blackOne500]}>Percentage</Text>
                                                </TouchableOpacity>
                                                 <View style={[commonStyles.bottomWidth,mh10]} />
                                                <TouchableOpacity
                                                    onPress={() => handleTypeSelect('2')}
                                                    style={styles.dropdownItem}>
                                                    <Text style={[commonStyles.h14blackOne500]}>Fixed</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                    </>
                                )}
                            />
                            {errors.type && (
                                <Text style={{ color: colors.danger, marginTop: 5 }}>
                                    {errors.type.message}
                                </Text>
                            )}
                        </View>

                        <View style={[mv15, flexRow, justifyBetween]}>
                           <Text style={commonStyles.h14blackOne600}>Status</Text>
                            <View style={[mh10]}>
                                <ToggleSwitch
                                    value={toggleVisible}
                                    onToggle={handleToggleChange}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <View style={styles.bottomButtonsContainer}>
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={'Cancel'}
                    onChange={handleCancelBtnClick}
                    backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                    color={isActiveBtn ? colors.white : colors.blackOne}
                />
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={'Save Changes'}
                    onChange={handleSubmit(addTaxRate)}
                    backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                    color={isActiveBtn ? colors.blackOne : colors.white}
                />
            </View>
        </View>
    );
};
// =========================================== ADD TAX ==============================================

export const AddTax = ({
    data,
    onSave,
    onCancel,
    taxData,
}: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    console.log(data, 'editdataa');
    const [dropdownTax, setDropdownTax] = useState<string | null>(data?.tax?.name);
    const [isFocusTax, setIsFocusTax] = useState<boolean>(false);
    useEffect(() => {
        setValue('tax', data?.tax);
    }, [])
    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    const handleSaveBtnClick = (formData: { tax: any }) => {
        setIsActiveBtn(false);
        const updatedData = {
            ...data,
            ...formData,
            tax: formData.tax,
        };
        onSave(updatedData);
    };

    const handleTaxChange = (item: { name: string; _id: string }) => {
        setDropdownTax(item.name);
        setValue('tax', item);
        setIsFocusTax(false);
    };

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            quantity: data?.quantity || '',
            sellingPrice: data?.sellingPrice || data?.rate || '',
            discountValue: data?.discountValue || data?.discount || '',
            tax: data?.tax?.taxRate || '',
        },
    });

    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.editProduct} iconPress={() => onCancel()} />
                    <View style={[mv10]}>
                        <View style={[flexRow, mt10]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >
                                {labels.quantity}
                            </Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={styles.input}>
                            <Controller
                                name={'quantity'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.quantity}
                                        value={value?.toString()}
                                        onChangeText={text => onChange(text)}
                                        textColor={colors.black}
                                        error={errors['quantity']?.message}
                                        keyboardType="number-pad"
                                    />
                                )}
                                rules={{
                                    required: requiredValidation('quantity'),
                                }}
                            />
                        </View>
                        <View style={[flexRow, mt10]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]}>
                                {labels.rate}
                            </Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={styles.input}>
                            <Controller
                                name={'sellingPrice'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.sellingPrice}
                                        value={value?.toString()}
                                        onChangeText={text => onChange(text)}
                                        textColor={colors.black}
                                        error={errors['sellingPrice']?.message}
                                        keyboardType="number-pad"
                                    />
                                )}
                                rules={{
                                    required: requiredValidation('sellingPrice'),
                                }}
                            />
                        </View>
                        <View style={[flexRow, mt10]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >
                                {labels.discountAmnt}
                            </Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={styles.input}>
                            <Controller
                                name={'discountValue'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.discountValue}
                                        value={value?.toString()}
                                        onChangeText={text => onChange(text)}
                                        textColor={colors.black}
                                        error={errors['discountValue']?.message}
                                        keyboardType="number-pad"
                                    />
                                )}
                                rules={{
                                    required: requiredValidation('discountValue'),
                                }}
                            />
                        </View>
                        <View style={[flexRow, mt10]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >
                                {labels.tax}
                            </Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <CommonDropDownPicker
                            ListData={taxData?.map(item => ({
                                ...item,
                                label: `${item.name} (${item.taxRate}%)`
                            }))}
                            dropdownValue={dropdownTax}
                            handleDropdownChange={handleTaxChange}
                            isFocus={isFocusTax}
                            setIsFocus={setIsFocusTax}
                            labelField="label"
                            valueField="name"
                            placeholder={labels.tax}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomButtonsContainer}>
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={labels.cancel}
                    onChange={handleCancelBtnClick}
                    backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                    color={isActiveBtn ? colors.white : colors.blackOne}
                />
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={labels.saveChanges}
                    onChange={handleSubmit(handleSaveBtnClick)}
                    backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                    color={isActiveBtn ? colors.blackOne : colors.white}
                />
            </View>
        </View>
    );
};

export const AddSignature = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const ref = useRef();
    const [signature, setSignature] = useState(null);

    const handleOK = (signature: React.SetStateAction<null>) => {
        console.log(signature);
        setSignature(signature);
        onSave(signature);
    };

    const handleData = () => {
        console.log('clear success!');
    };

   

    return (
        <View style={[flex1]}>
            <ModalTopText title={labels.addSignature} iconPress={onCancel} />
            <View
                style={{
                    // borderWidth: 1,
                    // borderColor: colors.black,
                    height: 350,
                    // padding: 10,
                    marginTop: 40,
                }}>
                <SignatureScreen
                    ref={ref}
                    onOK={handleOK}
                    onGetData={handleData}
                    descriptionText={'Sign Here'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        // position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dropdownContainer: {
        // position: 'absolute',
        // top: 150,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        borderRadius: 5,
        zIndex: 1000,
        elevation: 1,
    },
    dropdownItem: {
        padding: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        justifyContent: 'center'
    },
});
