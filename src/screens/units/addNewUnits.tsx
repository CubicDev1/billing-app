import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { TopHeader } from '../../components/commonComponents';
import { CustomTextInput } from '../../components/commonInputFields';
import { getMethod, postMethod, putMethod } from '../../services/apiService'; // Import putMethod
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { bg_color_white, flex1, flexRow, mh15, mt15, mv10, mv5 } from '../../utils/theme/commonStyles';
import { requiredValidation } from '../../utils/validationConfig';
import { Unit } from './unitsList';
import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import * as TYPES from '../../action/ActionType';
import { useToast } from 'react-native-toast-notifications';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';


export type AddNewCategoriesProps = {
    navigation: AddNewUnitsNavigationProp;
    route: AddNewUnitsRouteProp;
};

type FormData = {
    name: string;
    symbol: string;
};

type RootStackParamList = {
    AddNewUnits: { unitData?: Unit }; // Define the type of route.params
};

type AddNewUnitsNavigationProp = StackNavigationProp<RootStackParamList, 'AddNewUnits'>;
type AddNewUnitsRouteProp = RouteProp<RootStackParamList, 'AddNewUnits'>;

const AddNewUnits = (props: AddNewCategoriesProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigation = useNavigation<AddNewUnitsNavigationProp>();
    const route = useRoute<AddNewUnitsRouteProp>();
    const toast = useToast();
    const dispatch = useDispatch()
    const {
        handleSubmit,
        control,
        trigger,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const handleCancelBtnClick = () => {
        setIsActiveBtn(false);
        reset()
    };

    useEffect(() => {
        // Populate form fields with received data when component mounts
        const unitData = route.params?.unitData;
        if (unitData) {
            setValue('name', unitData.name);
            setValue('symbol', unitData.symbol);
            setIsEditMode(true);
        }
    }, []);

    const addUnit: SubmitHandler<FormData> = async (formData) => {
        const isValid = await trigger();
        if (!isValid) {
            toast.show("Please fill in all fields correctly'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return;
        }
        const { name, symbol } = formData;

        const unitData = route.params?.unitData;
        if (unitData) {
            // If unitData exists, perform a put request to update existing data
            putMethod(
                `${ApiUrl.addUnit}/${unitData._id}`, // Assuming there's an endpoint to update units with an ID
                { name, symbol },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        handleNavigate()
                        toast.show("Unit Updated Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        console.log('Failed to update unit:', response);
                        toast.show("Failed to update unit", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log('Error updating unit:', error);
                    toast.show(error.data.message, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        } else {
            postMethod(
                ApiUrl.addUnit,
                { name, symbol },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        handleNavigate()
                        toast.show("Unit Added Successfully'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    } else {
                        console.log('Failed to add unit:', response);
                        toast.show("Failed to add unit", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    console.log('Error adding unit:', error);
                    toast.show(error.data.message, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        }
    };
    const handleNavigate = () => {
        getMethod(
            ApiUrl.dropDownUnits,
            success => {
                if (success.code === 200) {
                    dispatch({ type: TYPES.UNITS_LIST, payload: success.data })
                } else {
                    toast.show("Failed to fetch Units list", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                //console.log('Error fetching Units list:', error);
            }
        );
        navigation.navigate(screenName.Products, { selectedTab: 'Units' });
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, bg_color_white]}>
                        <View style={[mh15, mv10]}>
                            <TopHeader headerText={isEditMode ? 'Edit Unit' : 'Add New Unit'} />
                            <View style={[mv10]}>
                                <View style={[flexRow]}>
                                    <Text style={[commonStyles.h14blackOne600,mv5]}>{'Name'}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                <View style={styles.input}>
                                    <Controller
                                        name={'name'}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <CustomTextInput
                                                placeholder={labels.enterUnitName}
                                                value={value}
                                                onChangeText={onChange}
                                                textColor={colors.black}
                                            // error={errors['name']?.message}
                                            />
                                        )}
                                        rules={{
                                            required: requiredValidation('Name'),
                                        }}
                                    />
                                </View>
                                {errors.name && (
                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                        {errors.name.message}
                                    </Text>
                                )}
                                <View style={[flexRow]}>
                                    <Text style={[commonStyles.h14blackOne600,mv5]}>{'Symbol'}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                <View style={styles.input}>
                                    <Controller
                                        name={'symbol'}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <CustomTextInput
                                                placeholder={labels.enterSymbol}
                                                value={value}
                                                onChangeText={onChange}
                                                textColor={colors.black}
                                            // error={errors['symbol']?.message}
                                            />
                                        )}
                                        rules={{
                                            required: requiredValidation('Symbol'),
                                        }}
                                    />
                                </View>
                                {errors.symbol && (
                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                        {errors.symbol.message}
                                    </Text>
                                )}
                            </View>
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
                                onChange={handleSubmit(addUnit)}
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
        // flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
});

export default AddNewUnits;
