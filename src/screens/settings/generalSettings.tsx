import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { OnboardingButton } from '../../components/commonButton';
import { TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { getMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, bg_color_white, flex1, flexRow, justifyCenter, mh15, mt15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { emailValidation, numericValidation, requiredValidation } from '../../utils/validationConfig';
import { UploadImageCard } from '../products/uploadImageCard';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../components/loadingIndicator';
import { stat } from 'react-native-fs';
import { useToast } from 'react-native-toast-notifications';
import { getTopNotchStyle, getMainContainerStyle, commonStyles, KeyboardAScrollView } from '../../utils/commonStyles';
import { Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type GeneralSettingsProps = {

};
export interface Data {
    _id: string
    companyName: string
    email: string
    phone: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    pincode: string
    siteLogo: string
    favicon: string
    companyLogo: string
    userId: string
    createdAt: string
    updatedAt: string
    __v: number
}

type FormData = {
    companyName: string
    email: string
    phone: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    pincode: string
    siteLogo: string
    favicon: string
    companyLogo: string
};

const GeneralSettings = (props: GeneralSettingsProps) => {
    const [profileView, setProfileView] = useState<Data | null>(null);
    const [loading, setLoading] = useState(false);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const toast = useToast();
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        trigger,
    } = useForm<FormData>();



    const handleCancelBtnClick = () => {
        setIsActiveBtn((prevState) => !prevState);
        navigation.goBack()
    };



    const navigation = useNavigation()
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);
    const [selectedImages, setSelectedImages] = useState();
    const [imageUriCompany, setImageUriCompany] = useState<string | null>(null);
    const [imageDataCompany, setImageDataCompany] = useState<string | ArrayBuffer | null>(null);
    const [selectedImagesCompany, setSelectedImagesCompany] = useState();
    const [imageUriFav, setImageUriFav] = useState<string | null>(null);
    const [imageDataFav, setImageDataFav] = useState<string | ArrayBuffer | null>(null);
    const [selectedImagesFav, setSelectedImagesFav] = useState();

    const handleImage = (picData: any) => {
        console.log('Image clicked', picData);
        setImageData(picData);
        setSelectedImages(picData?.uri)
        setImageUri(picData?.uri)
    };

    const handleImage1 = (picData1: any) => {
        console.log('Image clicked', picData1);
        setImageDataCompany(picData1);
        setSelectedImagesCompany(picData1?.uri)
        setImageUriCompany(picData1?.uri)
    };

    const handleImage2 = (picData2: any) => {
        console.log('Image clicked', picData2);
        setImageDataFav(picData2);
        setSelectedImagesFav(picData2?.uri)
        setImageUriFav(picData2?.uri)
    };

    const updateGeneralSettings: SubmitHandler<FormData> = async (formData) => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        const data = new FormData();
        data.append('companyName', formData.companyName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('addressLine1', formData.addressLine1);
        data.append('addressLine2', formData.addressLine2);
        data.append('city', formData.city);
        data.append('state', formData.state);
        data.append('country', formData.country);
        data.append('pincode', formData.pincode);
        if (imageUri) {
            data.append('siteLogo', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'siteLogo.jpg',
            });
        }
        if (imageUriFav) {
            data.append('favicon', {
                uri: imageUriFav,
                type: 'image/jpeg',
                name: 'favicon.jpg',
            });
        }
        if (imageUriCompany) {
            data.append('companyLogo', {
                uri: imageUriCompany,
                type: 'image/jpeg',
                name: 'companyLogo.jpg',
            });
        }

        putMethod(
            ApiUrl.updateGeneralSettings,
            data,
            async (response: any) => {
                if (response && response.data) {
                    setIsActiveBtn(true);
                    console.log(data, 'UPDATE DATA NEWWW');
                    toast.show("Profile Updated", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    getProfile()
                    navigation.goBack()
                } else {
                    toast.show("Failed to update profile", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            (error) => {
                console.log('Error in updating profile', error);
                toast.show("Error in updating profile", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
        );
    };

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = () => {
        getMethod(
            ApiUrl.viewCompanySettings,
            success => {
                if (success.code === 200) {
                    setProfileView(success.data);
                    const {
                        companyName,
                        email,
                        phone,
                        addressLine1,
                        addressLine2,
                        city,
                        state,
                        country,
                        pincode,
                        siteLogo,
                        favicon,
                        companyLogo,
                    } = success.data;

                    // Check for valid URLs and set default if undefined
                    setValue('companyName', companyName);
                    setValue('email', email);
                    setValue('phone', phone);
                    setValue('addressLine1', addressLine1);
                    setValue('addressLine2', addressLine2);
                    setValue('city', city);
                    setValue('state', state);
                    setValue('country', country);
                    setValue('pincode', pincode);
                    setValue('siteLogo', siteLogo || ''); // Set default if undefined
                    setValue('favicon', favicon || ''); // Set default if undefined
                    setValue('companyLogo', companyLogo || ''); // Set default if undefined
                    console.log('Successfully got settings profile', success.data, companyName, email, phone, addressLine1, addressLine2, city, state, country, pincode);
                    setLoading(false)

                } else {
                    console.log('Failed from settings profile', success.message);
                }
            },
            error => {
                console.log('Error fetching unit list:', error);
                setLoading(false);
            }
        );
    };


    if (loading) {
        return (
            <View style={[flex1, bg_color_white, justifyCenter, alignItemCenter]}>
                <LoadingIndicator />
            </View>
        );
    }


    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={[mv15, mh15]}>
                            <TopHeader headerText={labels.generalSettings} />
                        </View>
                        <View style={[commonStyles.bottomWidth,]} />
                           <KeyboardAwareScrollView
                                      showsVerticalScrollIndicator={false}
                                      keyboardShouldPersistTaps="handled"
                                      enableAutomaticScroll={true}
                                      extraHeight={Platform.OS === 'ios' ? 90 : 75}
                                    >
                            <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                                <View style={[mh15]}>
                                    <View >
                                        <View style={[flexRow]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]}>{labels.companyName}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'companyName'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterCompanyName}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        error={errors['companyName']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('company name'),
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]}>{labels.companyEmail}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'email'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterCompanyEmail}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        keyboardType='email-address'
                                                        autoCapitalize='none'
                                                        textColor={colors.black}
                                                        error={errors['email']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('company email'),
                                                    validate: emailValidation
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]}>{labels.mobileNumber}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'phone'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterMobileNumber}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        keyboardType='numeric'
                                                        maxLength={10}
                                                        error={errors['phone']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('mobile number'),
                                                    validate: numericValidation,
                                                    minLength: { value: 10, message: 'Mobile number must be 10 digits' },
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]}>{'Enter Address Line 1'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'addressLine1'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={'Enter Address Line 1'}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        error={errors['addressLine1']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('address line1 '),
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]} >{'Enter Address Line 2'}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'addressLine2'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={'Enter Address Line 2'}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        error={errors['addressLine2']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('address line 2 '),
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.city}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'city'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterCity}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        error={errors['city']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('city'),
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.state}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'state'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterState}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        error={errors['state']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('state'),
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.pincode}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'pincode'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterPincode}
                                                        value={value}
                                                        maxLength={6}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        keyboardType='numeric'
                                                        error={errors['pincode']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('pincode'),
                                                    minLength: { value: 6, message: "Pincode must be 6 characters" },
                                                    validate: numericValidation
                                                }}
                                            />
                                        </View>
                                        <View style={[flexRow, mt15]}>
                                            <Text style={[commonStyles.h14blackOne600, mv5]} >{labels.country}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'country'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.enterCountry}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                        error={errors['country']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('country'),
                                                }}
                                            />
                                        </View>
                                        <View style={mv15}>
                                            <Controller
                                                name="siteLogo"
                                                control={control}
                                                render={({ field: { value } }) => (
                                                    <UploadImageCard
                                                        title={labels.invoiceLogo}
                                                        sizeInfo={labels.sizeOfImg1}
                                                        onUpload={() => { }} // Pass the field name
                                                        onDelete={() => setValue('siteLogo', '')}
                                                        initialImage={value ? `data:image/jpeg;base64,${value}` : profileView?.siteLogo || ''}
                                                        imageTag={handleImage}
                                                    />
                                                )}
                                            />
                                        </View>
                                        <Controller
                                            name="companyLogo"
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <UploadImageCard
                                                    title={labels.companyIcon}
                                                    sizeInfo={labels.sizeOfImg3}
                                                    imageTag={handleImage1}

                                                    onUpload={() => { }} // Pass the field name
                                                    onDelete={() => setValue('companyLogo', '')}
                                                    initialImage={value ? `data:image/jpeg;base64,${value}` : profileView?.companyLogo}
                                                />
                                            )}
                                        />
                                        <View style={[mv15]}>
                                            <Controller
                                                name="favicon"
                                                control={control}
                                                render={({ field: { value } }) => (
                                                    <UploadImageCard
                                                        title={labels.favIcon}
                                                        sizeInfo={labels.sizeOfImg4}
                                                        imageTag={handleImage2}
                                                        onUpload={() => { }} // Pass the field name
                                                        onDelete={() => setValue('favicon', '')}
                                                        initialImage={value ? `data:image/jpeg;base64,${value}` : profileView?.favicon}
                                                    />
                                                )}
                                            />
                                        </View>
                                    </View>
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
                                        onChange={handleSubmit(updateGeneralSettings)}
                                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                                        color={isActiveBtn ? colors.blackOne : colors.white}
                                    />
                                </View>

                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        // position: 'absolute',
        // bottom: 0,
        width: '100%',
        paddingHorizontal: 15,
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
        justifyContent: 'space-between',

    },
});


export default GeneralSettings;
