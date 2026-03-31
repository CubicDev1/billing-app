import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInput } from '../../components/commonInputFields';
import { postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { flex1, flexRow, mh10, mh15, mt10, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { requiredValidation } from '../../utils/validationConfig';
import { MultiSelectOption, TopHeader } from '../../components/commonComponents';
import UploadImageCard from '../products/uploadImageCard';
import { useToast } from 'react-native-toast-notifications';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type AddSignatureProps = {};

type FormData = {
    signatureName: string;
    markAsDefault: boolean;
    status: boolean;
    signatureImage: string | null;
};

const AddSignature = ({ route }: any) => {
    const editSign = route?.params?.signatureDetail
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const navigation = useNavigation();
    const [checkBox, setCheckBox] = useState(false);
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [selectedImages, setSelectedImages] = useState();
    const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);
    const toast = useToast();

    const handleSaveBtnClick = () => {
        setIsActiveBtn(true);
    };

    useEffect(() => {
        if (editSign) {
            console.log(editSign, "edddddit sign");
            setValue('signatureName', editSign.signatureName);
            setValue('markAsDefault', editSign.markAsDefault);
            setValue('status', editSign.status);
            setCheckBox(editSign.markAsDefault);
            // setSelectedImages(editSign.signatureImage);
            setImageUri(editSign.signatureImage);
        }
    }, [editSign])
    const handleCancelBtnClick = () => {
        setIsActiveBtn(false);
        reset();
        setImageUri(null);
        setSelectedImages(null);

        // navigation.navigate(screenName.Signatures as never);
    };

    const handleCheckBox = () => {
        setCheckBox(!checkBox);
        if (!checkBox) {
            setValue('markAsDefault', false);
        }
        else {
            setValue('markAsDefault', true);
        }
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
        trigger,
        reset,
        setValue,
    } = useForm<FormData>(
        {
            defaultValues: {
                signatureName: '',
                markAsDefault: false,
                status: false,
                signatureImage: null,
            },
        }
    );

    const handleUploadImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.5,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const { uri, width, height } = response.assets[0];
                compressImage(uri, width, height);
            }
        });
    };

    const compressImage = async (uri: string, width: number, height: number) => {
        try {
            const newWidth = width * 0.5;
            const newHeight = height * 0.5;
            const compressedImage = await ImageResizer.createResizedImage(uri, newWidth, newHeight, 'PNG', 80);
            setImage(compressedImage);  // Use .uri to get the correct path
            console.log(compressedImage, 'compressedImage');

        } catch (error) {
            console.log('Error resizing image: ', error);
        }
    };

    const addSignature: SubmitHandler<FormData> = async (formData) => {
        if (checkBox) {
            setValue('markAsDefault', true);
        }
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        const { signatureName, markAsDefault } = formData;

        if (!imageUri) {
            toast.show("Please upload a signature image'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }
        const formDataSign = new FormData();
        formDataSign.append('signatureName', signatureName);
        formDataSign.append('markAsDefault', checkBox ? String(true) : String(false));
        formDataSign.append('status', String(true));
        if (imageData && typeof imageData != 'string') {
            formDataSign.append('signatureImage', {
                uri: imageData.uri,
                type: 'image/png',
                name: 'signature.png',
            });
        }
        const data = {
            signatureName,
            status: true,
            markAsDefault,
            signatureImage: imageUri,
        }
        console.log(data, 'data', formDataSign);
        if (editSign) {
            putMethod(
                ApiUrl.updateSignature + editSign._id,
                formDataSign,
                async (response: any) => {
                    console.log(response, 'response');

                    if (response && response.data) {
                        navigation.navigate(screenName.Signatures as never);
                        toast.show("Signature Updated Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        toast.show("Error in updating signature", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log(error);
                    toast.show("Error in updating signature", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            )
        }
        else {
            postMethod(
                ApiUrl.addSignature,
                formDataSign,
                (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        navigation.navigate(screenName.Signatures as never);
                        toast.show("Signature Added'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });

                    } else {
                        toast.show("Error in adding signature", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log(error, 'error');
                    toast.show("Error in adding signature", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
        }
    };

    const handleImage = (picData: any) => {
        console.log('Image clicked', picData);
        setImageData(picData);
        setSelectedImages(picData?.uri)
        setImageUri(picData?.uri)
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={{ flex: 1, backgroundColor: colors.whiteTwo }}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader
                                    headerText={labels.addSignature}
                                />
                            </View>
                            <View style={[commonStyles.bottomWidth,mv5]} />
                            <View style={[flexRow, mv10]}>
                                <Text style={[commonStyles.h14blackOne600,mv5]}>
                                    {labels.signatureName}
                                </Text>
                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                            </View>
                            <View style={styles.input}>
                                <Controller
                                    name="signatureName"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <CustomTextInput
                                            placeholder={'Enter ' + labels.signatureName}
                                            value={value}
                                            onChangeText={onChange}
                                            textColor={colors.black}
                                            maxLength={30}
                                        // error={errors.signatureName?.message}
                                        />
                                    )}
                                    rules={{
                                        required: requiredValidation(labels.signatureName),
                                    }}
                                />
                            </View>
                            {errors.signatureName && (
                                <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                    {errors.signatureName.message}
                                </Text>
                            )}
                            <View style={[mv15]}>
                                <UploadImageCard initialImage={imageUri} title={labels.signatures} sizeInfo={labels.sizeOfImg1} imageTag={handleImage} onUpload={() => { }} onDelete={() => { }} />
                            </View>
                            <View style={[flexRow, mt10]}>
                                <MultiSelectOption
                                    selectedColor={colors.primary}
                                    unselectedColor={colors.danger}
                                    isSelected={checkBox}
                                    onSelect={handleCheckBox}
                                />
                                <Text style={[commonStyles.h14blackTwo500,mh10]} >{labels.markAsDefault}</Text>

                            </View>
                            {/* {selectedImages && <Image source={{ uri: selectedImages }} style={styles.image} />} */}

                        </View>

                        <View style={styles.bottomButtonsContainer}>
                            <OnboardingButton
                                width={160}
                                title={labels.reset}
                                onChange={handleCancelBtnClick}
                                backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                                color={isActiveBtn ? colors.white : colors.blackOne}
                            />
                            <OnboardingButton
                                width={160}
                                title={labels.saveChanges}
                                onChange={handleSubmit(addSignature)}
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
    image: {
        height: 60,
        width: '100%',
        resizeMode: 'contain',
        backgroundColor: colors.whiteTwo,
    }
});

export default AddSignature;
