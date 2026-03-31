import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { getMethod, postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { flex1, flexRow, mh10, mh15, mt10, mv10, mv5 } from '../../utils/theme/commonStyles';
import { requiredValidation } from '../../utils/validationConfig';
import { Category } from './categoriesList';
import { useDispatch } from 'react-redux';
import * as TYPES from '../../action/ActionType';
import UploadImageCard from '../products/uploadImageCard';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type RootStackParamList = {
    AddNewCategories: { categoryData?: Category };
};

type AddNewCategoriesProps = {
    navigation: StackNavigationProp<RootStackParamList, 'AddNewCategories'>;
    route: RouteProp<RootStackParamList, 'AddNewCategories'>;
};

type FormData = {
    name: string;
    slug: string;
    image: string | ArrayBuffer | null;
    type: string;
};

const AddNewCategories = (props: AddNewCategoriesProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImages, setSelectedImages] = useState();
    const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);
    const toast = useToast();

    const dispatch = useDispatch();
    const { handleSubmit, control, formState: { errors }, trigger, setValue, reset } = useForm<FormData>();

    const handleSaveBtnClick = () => {
        setIsActiveBtn(true);
    };

    const handleCancelBtnClick = () => {
        // setIsActiveBtn(false);
        setImage(null)
        navigation.goBack();
        reset()
    };

    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        const categoryData = route.params?.categoryData?.category_details;
        if (categoryData) {
            setIsEditing(true);
            const { name, slug, image } = categoryData;
            setValue('name', name);
            setValue('slug', slug);
            setSelectedImages(image);
        }
    }, []);


    const onAddCategory: SubmitHandler<FormData> = async (formData) => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }

        const { name, slug, type } = formData;
        const newForm = new FormData();
        newForm.append('name', name);
        newForm.append('slug', slug);
        if (typeof imageData != 'string') {
            newForm.append('image', {
                uri: imageData?.uri ?? "",
                type: 'image/jpeg',
                name: 'image.jpg',
            });
        }
        const categoryData = route.params?.categoryData?.category_details;
        console.log("newForm", newForm)
        if (categoryData) {
            // Update existing category
            putMethod(
                `${ApiUrl.categoryList}/${categoryData._id}`,
                newForm,
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        handleAddCategory();
                        toast.show("Category edited successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });

                    } else {
                        toast.show("Failed to edit category", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        } else {
            // Add new category
            postMethod(
                ApiUrl.categoryList,
                { name, slug, image: imageData, type: 'product' },
                async (response: any) => {
                    if (response && response.data) {
                        handleAddCategory();
                        toast.show("Category added successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });

                    } else {
                        toast.show("Failed to add category", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        }
    };
    const handleAddCategory = () => {
        getMethod(
            ApiUrl.dropDownCategory,
            success => {
                if (success.code == 200) {
                    dispatch({ type: TYPES.CATEGORY_LIST, payload: success.data })
                }
            },
            error => {
                //console.log('Error fetching Category list:', error);
            }
        );
        navigation.navigate(screenName.Products, { selectedTab: 'Categories' });
    }

    const handleImage = (picData: any) => {
        console.log('Image clicked', picData);
        setImageData(picData);
        setSelectedImages(picData?.uri)
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.white, }]}>
                        <View style={[mh10, mv10]}>
                            <TopHeader headerText={isEditing ? 'Edit Category' : labels.addNewCategory} />
                        </View>
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            enableAutomaticScroll={true}
                            extraHeight={Platform.OS === 'ios' ? 90 : 75}
                        >
                            <View style={[flex1, mt10, mh15,]}>
                                <UploadImageCard initialImage={selectedImages ?? imageData} title={labels.customerImage} sizeInfo={labels.sizeOfImg1} imageTag={handleImage} onUpload={() => { }} onDelete={() => { }} />
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
                                                placeholder={'Enter category name'}
                                                value={value}
                                                onChangeText={onChange}
                                                textColor={colors.black}
                                            // error={errors['name']?.message}
                                            />
                                        )}
                                        rules={{
                                            required: requiredValidation('Enter category name'),
                                        }}
                                    />
                                </View>
                                {errors.name && (
                                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                        {errors.name.message}
                                    </Text>
                                )}
                                <View style={[flexRow,]}>
                                    <Text style={[commonStyles.h14blackOne600, mv5]}>{'Slug'}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                <View style={styles.input}>
                                    <Controller
                                        name={'slug'}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <CustomTextInput
                                                placeholder={'Enter slug'}
                                                value={value}
                                                onChangeText={onChange}
                                                textColor={colors.black}
                                            // error={errors['slug']?.message}
                                            />
                                        )}
                                        rules={{
                                            required: requiredValidation('Enter slug'),
                                        }}
                                    />
                                </View>
                                {errors.slug && (
                                    <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                        {errors.slug.message}
                                    </Text>
                                )}
                            </View>
                        </KeyboardAwareScrollView>

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
                                onChange={handleSubmit(onAddCategory)}
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
        paddingBottom: 10,
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
        marginBottom: 5
    },
});

export default AddNewCategories;
