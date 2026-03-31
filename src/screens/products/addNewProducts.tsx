import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInputField, RoundCheckBox, TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { bg_color_white, flex1, flexColumn, flexRow, justifyBetween, mh10, mh15, mt10, mt15, mt5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { UploadImageCard } from './uploadImageCard';
import { CustomTextInput } from '../../components/commonInputFields';
import { requiredValidation } from '../../utils/validationConfig';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { useDispatch, useSelector } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { ProductFormData } from '../../utils/FormDataFunc';
import { AddNewProductData, UpdateProductData } from '../../userCall/ApiUser';
import { deliveryChallanData } from '../../utils/data/deliveryChallanScreenData';
import { useToast } from 'react-native-toast-notifications';
import { DevWidth } from '../../utils/device';
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type AddNewProductsProps = {
    route: any;
}

interface CustomTextInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    textColor: string;
    error?: string; // This should accept a string or undefined
}


const DiscountList = [
    { name: 'Percentage', value: 'Percentage' },
    { name: 'Fixed', value: 'Fixed' },
];

type formKeys = {
    type: string;
    name: string;
    sku: string;
    category: string;
    sellingPrice: any;
    purchasePrice: any;
    units: string;
    discountType: string;
    discountValue: string;
    barcode: string;
    alertQuantity: string;
    tax: string;
};
const AddNewProducts = ({ route }: any) => {
    const Productdata = route.params?.Productdata;
    console.log("Productdata", Productdata);

    const [isChecked, setIsChecked] = useState(true);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);
    const [productNum, setProductNum] = useState<string | null>(null);
    const [dropdownValue, setDropdownValue] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [unitValue, setUnitValue] = useState<string | null>(null);
    const [isFocusDiscount, setIsFocusDiscount] = useState<boolean>(false);
    const [isFocusUnit, setIsFocusUnit] = useState<boolean>(false);
    const [dropdownTax, setDropdownTax] = useState<string | null>(null)
    const [isFocusTax, setIsFocusTax] = useState<boolean>(false);
    const [dropdownDiscount, setDropdownDiscount] = useState<string | null>(null)
    const CategoryList = useSelector((state: any) => state.Reducer.category)
    const UnitList = useSelector((state: any) => state.Reducer.units)
    const TaxList = useSelector((state: any) => state.Reducer.tax)
    const navigation = useNavigation();
    const [selectedImages, setSelectedImages] = useState();
    const toast = useToast();


    useEffect(() => {
        if (Productdata) {
            getProductDetails(Productdata);
            console.log("Productdata", Productdata);
        }
    }, []);

    const getProductDetails = (data: any) => {
        setValue('type', data?.type);
        setIsChecked(data?.type === 'product' ? true : false);
        setValue('name', data?.name);
        setValue('sku', data?.sku);
        setValue('category', data?.category?._id);
        handleDropdownChange({ name: data?.category?.name, _id: data?.category?._id });
        setValue('sellingPrice', data?.sellingPrice?.toString());
        setValue('purchasePrice', data?.purchasePrice?.toString());
        setValue('units', data?.units?._id);
        handleUnitChange({ name: data?.units?.name, _id: data?.units?._id });
        setValue('discountType', data?.discountType == "2" ? 'Percentage' : 'Fixed');
        setDropdownDiscount(data?.discountType == "2" ? 'Percentage' : 'Fixed');
        setValue('discountValue', data?.discountValue?.toString());
        setValue('barcode', data?.barcode);
        setValue('alertQuantity', data?.alertQuantity?.toString());
        setValue('tax', data?.tax?._id);
        handleTaxChange({ name: data?.tax?.name, _id: data?.tax?._id })
        setSelectedImages(data?.images);
        setImageData(data?.images);
        setTimeout(() => {
            console.log("The response after set the edit value is", getValues());

        }, 2000);

    }
    const handleProductClick = () => {
        setIsChecked(true);
        setValue('type', 'product');
    };

    const handleServiceClick = () => {
        setIsChecked(false);
        setValue('type', 'service');
    };
    const validateForm = () => {
        const errors = [];
        if (!imageData) errors.push('Please upload product image.');
        if (!dropdownDiscount) errors.push('Field discountType is missing or invalid.');
        if (!dropdownValue || !dropdownTax || !unitValue) errors.push('Please fill all mandatory dropdown fields.');
        return errors;
    };

    const handleSaveBtnClick = async () => {
        setIsActiveBtn(true);
        setValue('type', isChecked ? 'product' : 'service');
        const isValid = await trigger();
        console.log(isValid);
        if (!isValid) {
            console.log('its not valid')
            toast.show("Please fill all mandatory fields", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return
        }
        else if (!dropdownValue || !dropdownDiscount || !dropdownTax || !unitValue || !imageData) {
            console.log('its dropdown', dropdownValue, dropdownDiscount, dropdownTax, unitValue)
            if (!imageData) {
                toast.show("Please upload product image", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                return
            }
            if (!dropdownDiscount) {
                console.log('Field discountType is missing or invalid');
                toast.show("Field discountType is missing or invalid", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                return
            }
            toast.show("Please fill all mandatory fields'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            return
        }
        console.log('product payload', getValues());
        console.log(imageData, 'addedProduct');
        const payload = ProductFormData(getValues(), imageData);
        console.log(payload);

        const sellingPrice = Number(getValues('sellingPrice'));
        const purchasePrice = Number(getValues('purchasePrice'));
        const discountValue = Number(getValues('discountValue'));
        console.log(dropdownDiscount)
        // Check conditions:
        if (dropdownDiscount === "Fixed" && discountValue > Math.min(sellingPrice, purchasePrice)) {
            toast.show("Discount value should be less than Purchase or Selling price", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
        } else if (sellingPrice <= purchasePrice) {
            toast.show("Selling price should be greater than Purchase price", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
        } else if (dropdownDiscount != "Fixed" && discountValue > 100) {
            toast.show("Enter valid discount value less than 100%", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
        } else {
            if (Productdata && Productdata?._id) {
                UpdateProductData(payload, Productdata?._id, navigation);
            } else {
                console.log(payload, "payload in add product");
                AddNewProductData(payload, navigation, useDispatch);
            }
        }
    };



    const handleCancelBtnClick = () => {
        reset()
        // setIsActiveBtn(false);
        navigation.goBack();
    };
    const {
        control,
        getValues,
        setValue,
        trigger,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<formKeys>({
        defaultValues: {
            name: '',
            type: isChecked ? 'product' : 'service',
            sku: '',
            category: '',
            sellingPrice: '',
            purchasePrice: '',
            units: '',
            discountType: '',
            discountValue: '',
            barcode: '',
            alertQuantity: '',
            tax: '',
        }
    });

    const handleDropdownChange = (item: {
        name: string, _id: string
    }) => {
        setDropdownValue(item.name);
        setValue('category', item._id);
        setIsFocus(false);
    };


    const handleUnitChange = (item: {
        name: string, _id: string
    }) => {
        setUnitValue(item.name);
        setValue('units', item._id);
        setIsFocusUnit(false);
    };
    const handleImage = (picData: any) => {
        console.log('Image clicked', picData);
        setImageData(picData);
        setSelectedImages(picData?.uri)
    };

    const handleDiscountChange = (item: {
        name: string, _id: string
    }) => {
        setDropdownDiscount(item.name);
        setValue('discountType', item.name);
        setIsFocusDiscount(false);
    };

    const handleTaxChange = (item: {
        name: string, _id: string
    }) => {
        setDropdownTax(item.name);
        setValue('tax', item._id);
        setIsFocusTax(false);
    };


    const generateSKU = () => {
        getMethod(
            ApiUrl.generateProduct,
            success => {
                console.log('Successfully got Customer list', success.data);
                setValue('sku', success.data.toString());
                setProductNum((success.data).toString());
            },
            error => {
                console.log('Error fetching Customer list:', error);
            }
        )
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.white, }]}>
                        {/* <TopHeader headerText={invoiceDetails ? labels.editInvoice : labels.addInvoice} searchIcon={false} /> */}
                        <View style={[mh10, mv10]}>
                            <TopHeader headerText={Productdata ? labels.editProduct : labels.addNewProduct} searchIcon={false} />
                        </View>
                        {/* <KeyboardAScrollView showsVerticalScrollIndicator={false}> */}
                           <KeyboardAwareScrollView
                                      showsVerticalScrollIndicator={false}
                                      keyboardShouldPersistTaps="handled"
                                      enableAutomaticScroll={true}
                                      extraHeight={Platform.OS === 'ios' ? 90 : 75}
                                    >
                            <View style={[flex1, mt10, mh15,]}>
                                <View style={{ paddingBottom: '5%' }}>
                                    <View style={[mv15]}>
                                        <UploadImageCard initialImage={selectedImages ?? imageData} title={labels.productImage} sizeInfo={labels.sizeOfImg1} imageTag={handleImage} onUpload={() => { }} onDelete={() => { }} />
                                    </View>
                                   <Text style={commonStyles.h14blackOne600}>Item Type</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
                                        <RoundCheckBox
                                            title={labels.products}
                                            onChange={handleProductClick}
                                            borderColor={isChecked ? colors.primary : colors.greyFour}
                                            backgroundColor={isChecked ? colors.primary : 'transparent'}
                                            textColor={isChecked ? colors.primary : colors.blackTwo} />
                                        <RoundCheckBox
                                            title={labels.services}
                                            onChange={handleServiceClick}
                                            borderColor={isChecked ? colors.greyFour : colors.primary}
                                            backgroundColor={isChecked ? 'transparent' : colors.primary}
                                            textColor={isChecked ? colors.blackTwo : colors.primary} />
                                    </View>
                                    <View>
                                        <View style={[flexRow,]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.productName}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name={'name'}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <CustomTextInput
                                                        placeholder={labels.productName}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        textColor={colors.black}
                                                    // error={errors['name']?.message}
                                                    />
                                                )}
                                                rules={{
                                                    required: requiredValidation('Product Name'),
                                                    validate: (value) => value.trim().length > 0 || 'Name cannot be empty',
                                                }}
                                            />
                                        </View>
                                        {errors.name && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.name.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow,]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.productCode}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>

                                        <View style={{ height: 50 }}>
                                            <Controller
                                                name='sku'
                                                control={control}
                                                render={({ field: { onChange, value } }) => {
                                                    return (
                                                        <CustomTextInput
                                                            placeholder={productNum ?? labels.productCode}
                                                            value={productNum ?? value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            // error={errors.sku?.message as string | undefined}
                                                            showOtp={true}
                                                            editable={false}
                                                            getNumber={generateSKU}
                                                        />
                                                    );
                                                }}
                                                rules={{
                                                    required: requiredValidation('Product code'),
                                                    validate: (value) => value.trim().length > 0 || 'Product code cannot be empty',
                                                }}
                                            />
                                        </View>
                                        {errors.sku && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.sku.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow, justifyBetween]}>
                                            <View style={{ flexDirection: 'row' }}>
                                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.productCategory}</Text>
                                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                                            </View>
                                        </View>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CommonDropDownPicker
                                                    ListData={CategoryList}
                                                    dropdownValue={dropdownValue}
                                                    handleDropdownChange={handleDropdownChange}
                                                    isFocus={isFocus}
                                                    setIsFocus={setIsFocus}
                                                    labelField="name"
                                                    valueField="name"
                                                    placeholder={labels.productCategory}
                                                />
                                            )}
                                            rules={{
                                                required: 'Category is required',
                                            }}
                                        />
                                        {errors.category && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.category.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow, justifyBetween]}>
                                            <View style={flexColumn}>
                                                <View style={[flexRow, mt15]}>
                                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.sellingPrice}</Text>
                                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                                </View>
                                                <View style={[styles.input, { width: DevWidth / 2.3 }]}>
                                                    <Controller
                                                        name='sellingPrice'
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <CustomTextInput
                                                                placeholder={labels.sellingPrice}
                                                                value={value}

                                                                onChangeText={onChange}
                                                                // error={errors.sellingPrice?.message as string | undefined}
                                                                keyboardType='numeric'
                                                            />
                                                        )}
                                                        rules={{
                                                            required: requiredValidation('Selling Price'),
                                                            validate: (value) => value.trim().length > 0 || 'Selling price cannot be empty',
                                                        }}
                                                    />
                                                    {/* {getValues("purchasePrice") > getValues("sellingPrice") &&<Text style={[commonStyles.h14blackOne600,mv5]} >Selling Price Should not be lesser then Purchase Price</Text>} */}
                                                </View>
                                                {errors.sellingPrice && (
                                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                        {errors.sellingPrice.message}
                                                    </Text>
                                                )}
                                            </View>

                                            <View style={flexColumn}>
                                                <View style={[flexRow, mt15]}>
                                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.purchasePrice}</Text>
                                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                                </View>
                                                <View style={[styles.input, { width: DevWidth / 2.3 }]}>
                                                    <Controller
                                                        name='purchasePrice'
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <CustomTextInput
                                                                placeholder={labels.purchasePrice}
                                                                value={value}
                                                                onChangeText={onChange}
                                                                // error={errors['purchasePrice']?.message}
                                                                keyboardType='numeric'
                                                            />
                                                        )}
                                                        rules={{
                                                            required: requiredValidation('Purchase price'),
                                                            validate: (value) => value.trim().length > 0 || 'Purchase Price cannot be empty',
                                                        }}
                                                    />

                                                </View>
                                                {errors.purchasePrice && (
                                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                        {errors.purchasePrice.message}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={[flexRow, justifyBetween]}>
                                            <View style={flexColumn}>
                                                <View style={[flexRow]}>
                                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.units}</Text>
                                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                                </View>
                                                <View style={[{ width: DevWidth / 2.3 }]}>
                                                    <Controller
                                                        name="units"
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <CommonDropDownPicker
                                                                ListData={UnitList}
                                                                dropdownValue={unitValue}
                                                                handleDropdownChange={handleUnitChange}
                                                                isFocus={isFocusUnit}
                                                                setIsFocus={setIsFocusUnit}
                                                                labelField="name"
                                                                valueField="name"
                                                                placeholder={labels.units}
                                                            />
                                                        )}
                                                        rules={{
                                                            required: 'Units is required',
                                                        }}
                                                    />
                                                    {errors.units && (
                                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                            {errors.units.message}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>

                                            <View style={flexColumn}>
                                                <View style={[flexRow,]}>
                                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.discountType}</Text>
                                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                                </View>
                                                <View style={[{ width: DevWidth / 2.3 }]}>
                                                    <Controller
                                                        name="discountType"
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <CommonDropDownPicker
                                                                ListData={DiscountList}
                                                                dropdownValue={dropdownDiscount}
                                                                handleDropdownChange={handleDiscountChange}
                                                                isFocus={isFocusDiscount}
                                                                setIsFocus={setIsFocusDiscount}
                                                                labelField="name"
                                                                valueField="name"
                                                                placeholder={labels.discountType}
                                                            />
                                                        )}
                                                        rules={{
                                                            required: 'Discount Type is required',
                                                        }}
                                                    />
                                                    {errors.discountType && (
                                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                            {errors.discountType.message}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[flexRow, mt5]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.barCode}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name='barcode'
                                                control={control}
                                                render={({ field: { onChange, value } }) => {
                                                    return (
                                                        <CustomTextInput
                                                            placeholder={"Enter " + labels.barCode}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            // error={errors['barcode']?.message}
                                                            keyboardType='numeric'
                                                        />
                                                    );
                                                }}
                                                rules={{
                                                    required: requiredValidation('Barcode'),
                                                    validate: (value) => value.trim().length > 0 || 'Barcode cannot be empty',
                                                }}
                                            />
                                        </View>
                                        {errors.barcode && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.barcode.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow,]}>
                                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.discountValue}</Text>
                                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                                        </View>
                                        <View style={styles.input}>
                                            <Controller
                                                name='discountValue'
                                                control={control}
                                                render={({ field: { onChange, value } }) => {
                                                    return (
                                                        <CustomTextInput
                                                            placeholder={"Enter " + labels.discountValue}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            textColor={colors.black}
                                                            // error={errors['discountValue']?.message}
                                                            keyboardType='numeric'
                                                        />
                                                    );
                                                }}
                                                rules={{
                                                    required: requiredValidation('Discount Value'),
                                                    validate: (value) => value.trim().length > 0 || 'Discount Value cannot be empty',
                                                }}
                                            />
                                        </View>
                                        {errors.discountValue && (
                                            <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                {errors.discountValue.message}
                                            </Text>
                                        )}
                                        <View style={[flexRow, justifyBetween]}>
                                            <View style={flexColumn}>
                                                <View style={[flexRow,]}>
                                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.alertQuantity}</Text>
                                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                                </View>
                                                <View style={[styles.input, { width: DevWidth / 2.3 }]}>
                                                    <Controller
                                                        name='alertQuantity'
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => {
                                                            return (
                                                                <CustomTextInput
                                                                    placeholder={"Enter " + labels.alertQuantity}
                                                                    value={value}
                                                                    onChangeText={onChange}
                                                                    textColor={colors.black}
                                                                    // error={errors['alertQuantity']?.message}
                                                                    keyboardType='numeric'
                                                                />
                                                            );
                                                        }}
                                                        rules={{
                                                            required: requiredValidation('Alert Quantity'),
                                                            validate: (value) => value.trim().length > 0 || 'Alert Quantity cannot be empty',
                                                        }}
                                                    />
                                                </View>
                                                {errors.alertQuantity && (
                                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                        {errors.alertQuantity.message}
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={[flexColumn,]}>
                                                <View style={[flexRow]}>
                                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.tax}</Text>
                                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                                </View>
                                                <View style={[{ width: DevWidth / 2.3 }]}>
                                                    <Controller
                                                        name="tax"
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <CommonDropDownPicker
                                                                ListData={TaxList}
                                                                dropdownValue={dropdownTax}
                                                                handleDropdownChange={handleTaxChange}
                                                                isFocus={isFocusTax}
                                                                setIsFocus={setIsFocusTax}
                                                                labelField="name"
                                                                valueField="name"
                                                                placeholder={labels.tax}
                                                            />
                                                        )}
                                                        rules={{
                                                            required: 'Tax is required',
                                                        }}
                                                    />
                                                </View>
                                                {errors.tax && (
                                                    <Text style={{ color: colors.danger, marginLeft: 10 }}>
                                                        {errors.tax.message}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={[flexRow, justifyBetween, { marginVertical: 20 }]}>
                                            <OnboardingButton
                                                width={DevWidth / 2.3}
                                                title={labels.cancel}
                                                onChange={handleCancelBtnClick}
                                                backgroundColor={colors.greySeven}
                                                color={colors.blackOne}
                                            />
                                            <OnboardingButton
                                                width={DevWidth / 2.3}
                                                title={labels.saveChanges}
                                                onChange={handleSubmit(handleSaveBtnClick)}
                                                backgroundColor={colors.primary}
                                                color={colors.white}
                                            />
                                        </View>

                                        {/* <View style={{ height: 100 }} /> */}
                                    </View>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

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
        // paddingVertical: 5,
        // alignItems: 'center',
        backgroundColor: colors.greyOne,
        // flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingBottom : 5,
        marginBottom: 5
    },
});
export default AddNewProducts;