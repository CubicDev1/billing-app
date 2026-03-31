import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { getMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, bg_color_white, flex1, flexRow, justifyCenter, mh15, mt15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { requiredValidation } from '../../utils/validationConfig';
import { UploadImageCard } from '../products/uploadImageCard';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../components/loadingIndicator';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type InvoiceSettingsProps = {};

export interface InvoiceSettings {
    _id: string;
    invoicePrefix: string;
    invoiceLogo: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

type FormData = {
    invoicePrefix: string;
    invoiceLogo: string;
    _id: string;
};

const InvoiceSettings = (props: InvoiceSettingsProps) => {
    const navigation = useNavigation();
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings | null>(null);
    const toast = useToast();

    const handleCancelBtnClick = () => {
        setIsActiveBtn((prevState) => !prevState);
        navigation.goBack();
    };

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        trigger,
    } = useForm<FormData>();

    const handleImage1 = (picData1: any) => {
        console.log('Image clicked', picData1);
        setImageData(picData1);
        setSelectedImages(picData1?.uri)
        setImageUri(picData1?.uri)
    };
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);
    const [selectedImages, setSelectedImages] = useState();

    useEffect(() => {
        const getInvoiceSettingsDetails = () => {
            setLoading(true);
            getMethod(
                ApiUrl.viewInvoiceSettings,
                (success) => {
                    if (success.code === 200) {
                        setInvoiceSettings(success.data);
                        const { _id, invoicePrefix, invoiceLogo } = success.data;
                        setValue('invoicePrefix', invoicePrefix); // Prefill the invoicePrefix
                        setValue('invoiceLogo', invoiceLogo); // Prefill the invoiceLogo
                        setLoading(false);
                        console.log('Successfully got invoice settings profile', success.data);
                    } else {
                        console.log('Failed from invoice settings profile', success.message);
                        setLoading(false);
                    }
                },
                (error) => {
                    console.log('Error fetching invoice settings profile list:', error);
                    setLoading(false);
                }
            );
        };
        getInvoiceSettingsDetails();
    }, [setValue]);

    const updateInvoiceSettings: SubmitHandler<FormData> = async (formData) => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        const data = new FormData();
        data.append('_id', formData._id); // ID is mandatory
        data.append('invoicePrefix', formData.invoicePrefix); // Invoice prefix is mandatory

        // Handle the invoiceLogo field
        if (imageUri) {
            data.append('invoiceLogo', {
                uri: imageUri,
                type: 'image/png',
                name: 'invoiceLogo.png',
            });
        } else {
            data.append('invoiceLogo', ''); // Send an empty string if no image is present
        }

        // Make the PUT request
        putMethod(
            ApiUrl.updateInvoiceSettings,
            data,
            (response) => {
                if (response && response.data) {
                    toast.show("Invoice settings updated successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    navigation.navigate(screenName.SettingsScreen as never)
                    console.log('Updated invoice settings:', response.data);
                } else {
                    toast.show("Failed to update invoice settings", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Response error:', response);
                }
            },
            (error) => {
                toast.show("Error updating invoice settings", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                console.log('Request error:', error);
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

                    <View style={[flex1, bg_color_white]}>
                        <View style={[flex1, mh15]}>
                            <View style={[mv10]}>
                                <TopHeader headerText={labels.invoiceSettings} searchIcon={false} />
                            </View>
                            <View style={[commonStyles.bottomWidth, mv10]} />
                            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              extraHeight={Platform.OS === 'ios' ? 90 : 75}
            >
                                <View style={{ paddingBottom: 80 }}>
                                    <View style={[flexRow, mt15]}>
                                        <Text style={[commonStyles.h14blackOne600, mv5]}>{labels.invoicePrefix}</Text>
                                        <Text style={[commonStyles.h14Danger400]}> *</Text>
                                    </View>
                                    <View style={styles.input}>
                                        <Controller
                                            name="invoicePrefix"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CustomTextInput
                                                    placeholder="Enter Invoice Prefix"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    textColor={colors.black}
                                                // error={errors.invoicePrefix?.message}
                                                />
                                            )}
                                            rules={{
                                                required: 'Invoice prefix is required.',
                                            }}
                                        />
                                        {errors.invoicePrefix && (
                                            <Text style={{ color: colors.danger, marginTop: 2 }}>
                                                {errors.invoicePrefix.message}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={{ marginVertical: 20 }}>
                                        <Controller
                                            name="invoiceLogo"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <UploadImageCard
                                                    title={labels.invoiceLogo}
                                                    sizeInfo={labels.sizeOfImg1}
                                                    imageTag={handleImage1}
                                                    onUpload={(imageBase64) => {
                                                        onChange(imageBase64);
                                                        setImageUri(imageBase64.uri); // Update the image URI state
                                                    }}
                                                    onDelete={() => {
                                                        setValue('invoiceLogo', ''); // Reset the form field
                                                        onChange(''); // Clear the current field value
                                                        setImageUri(null); // Clear the image URI state
                                                    }}
                                                    initialImage={value || invoiceSettings?.invoiceLogo}
                                                />

                                            )}
                                        />


                                    </View>

                                </View>
                            </KeyboardAwareScrollView>
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
                                onChange={handleSubmit(updateInvoiceSettings)}
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
        justifyContent: 'space-between',
    },
});

export default InvoiceSettings;