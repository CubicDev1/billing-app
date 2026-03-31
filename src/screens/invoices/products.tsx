import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInputField, RoundCheckBox } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import { productsData } from '../../utils/data/invoiceData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flexColumn, flexRow, justifyBetween, justifyCenter, mb10, mh10, ml10, ml5, mr10, mr5, mt10, mt15, mt5, mv10, mv5 } from '../../utils/theme/commonStyles';
import { UploadImageCard } from '../products/uploadImageCard';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { CustomTextInput } from '../../components/commonInputFields';
import { requiredValidation } from '../../utils/validationConfig';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { CommonDropDownPicker } from '../../components/CommonDropDownPicker';
import { ProductFormData } from '../../utils/FormDataFunc';
import { AddNewProductData } from '../../userCall/ApiUser';
import { useToast } from 'react-native-toast-notifications';
import { DevWidth } from '../../utils/device';
import { commonStyles } from '../../utils/commonStyles';

export type productsProps = {

}

interface Product {
    _id: any;
    id: number;
    name: string;
    Img: React.ComponentType<{ height: number; width: number }>;
    unit: string;
    price: string;
}

interface Props {
    productData: Product[];
    decrementCount: (index: number) => void;
    incrementCount: (index: number) => void;
}

interface State {
    productCounts: number[];
}

interface RenderItemProps {
    item: Product;
    index: number;
}

type formKeys = {
    type: any;
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
const ProductScreen = ({ route }: any) => {
    const { fromScreen, listData, handlereturnData } = route.params;
    console.log('bbb', listData);
    const [showCreateNewProductModal, setShowCreateNewProductModal] = useState<boolean>(false);
    const [showSearchProductModal, setShowSearchProductModal] = useState<boolean>(false);
    const [selectedItemType, setSelectedItemType] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(true);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [productCounts, setProductCounts] = useState<number[]>(Array(listData.length).fill(1));
    const CategoryList = useSelector((state: any) => state.Reducer.category)
    const UnitList = useSelector((state: any) => state.Reducer.units)
    const TaxList = useSelector((state: any) => state.Reducer.tax)
    const [productNum, setProductNum] = useState<string | null>(null)
    const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);

    const navigation = useNavigation();

    const {
        control,
        getValues,
        reset,
        setValue,
        trigger,
        handleSubmit,
        formState: { errors },
    } = useForm<formKeys>({
        defaultValues: {
            name: '',
            type: '',
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

    const handleProductClick = () => {
        setIsChecked(true);
        setValue('type', 'product');
    };

    const handleServiceClick = () => {
        setIsChecked(false);
        setValue('type', 'service');
    };

    const toast = useToast();


    const handleSaveBtnClick = () => {

        setIsActiveBtn(true);
        console.log('fromScreen', fromScreen);
        console.log(getValues());
        const payload = ProductFormData(getValues(), imageData);
        const formData = getValues();
        const requiredFields = [
            "name",
            "type",
            "sku",
            "category",
            "sellingPrice",
            "purchasePrice",
            "units",
            "discountType",
            "discountValue",
            "barcode",
            "alertQuantity",
            "tax"
        ];
        const emptyFields = requiredFields.filter(field => !formData[field]);

        if (emptyFields.length > 0) {
            toast.show(`The following fields are required: ${emptyFields.join(", ")}`), {
                type: "success",
                placement: "bottom",
                duration: 500,
                //successColor: 'colors.green,'
                animationType: "zoom-in",
            };
            return;
        }
        if (!imageData) {
            toast.show('Please upload product image'), {
                type: "success",
                placement: "bottom",
                duration: 500,
                //successColor: 'colors.green,'
                animationType: "zoom-in",
            };
            return
        }

        AddNewProductData(payload, navigation, useDispatch, toast);
    };

    const handleCancelBtnClick = () => {
        setIsActiveBtn(false);
        reset()
    };

    const formKeys = {
        productName: 'productName',
        productCode: 'productCode',
        productCategory: 'productCategory',
        sellingPrice: 'sellingPrice',
        purchasePrice: 'purchasePrice',
        units: 'units',
        discountType: 'discountType',
        discountValue: 'discountValue',
        barCode: 'barCode',
        alertQuantity: 'alertQuantity',
        tax: 'tax'
    }

    const handleItemTypeSelect = (status: string) => {
        setSelectedItemType(status);
    };

    const openCreateNewProductModal = () => {
        setShowCreateNewProductModal(true);
    };

    const closeCreateNewProductModal = () => {
        setShowCreateNewProductModal(false);
    };

    const openSearchProductModal = () => {
        setShowSearchProductModal(true);
    };

    const closeSearchProductModal = () => {
        setShowSearchProductModal(false);
    };

    const incrementCount = (index: number) => {
        const newCounts = [...productCounts];
        newCounts[index]++;
        setProductCounts(newCounts);
    };

    const decrementCount = (index: number) => {
        const newCounts = [...productCounts];
        if (newCounts[index] > 1) {
            newCounts[index]--;
            setProductCounts(newCounts);
        }
    };

    const searchProduct = () => {
        return (
            <View>
                <View style={[flexRow, justifyBetween]}>
                    <Text style={[commonStyles.h18BlackOne700,{}]}>{labels.searchProducts}</Text>
                    <TouchableOpacity onPress={closeSearchProductModal} style={[{ backgroundColor: colors.greyOne, height: 25, width: 25, borderRadius: 100, }, alignItemCenter, justifyCenter]}>
                        <CustomIcon name="close" size={16} color={colors.blackOne} type='Ionicons' />
                    </TouchableOpacity>
                </View>
                <View style={mv10}>
                    <CustomTextInputField name={""} control={control} placeholder={labels.searchProducts} showIcon={true} />
                </View>
                {
                    productsData.map(({ id, name, Img, unit, price }) => {
                        return (
                            <View style={[{ height: 70, width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8 }, mv5, flexRow, justifyBetween, alignItemCenter]} key={id}>
                                <View style={[flexRow, alignItemCenter, ml10]}>
                                    <View style={[[{ height: 40, width: 40, backgroundColor: colors.whiteOne, borderRadius: 8 }, alignItemCenter, justifyCenter]]}>
                                        <Img height={25} width={25} />
                                    </View>
                                    <View style={[ml5]}>
                                         <Text style ={[commonStyles.h15blackOne600]}>{name}</Text>
                                        <View style={[flexRow, alignItemCenter]}>
                                            <Text style={[commonStyles.h12Primary400]}>Unit : {unit}</Text>
                                            <Text style={{ color: colors.greyTwo }}> | </Text>
                                            <Text style={[commonStyles.h10blackTwo600]}>Price : {price}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[flexRow, alignItemCenter, mr10]} >
                                    <TouchableOpacity style={[ml10, alignItemCenter, justifyCenter, { height: 25, width: 45, borderRadius: 5, backgroundColor: colors.primary }]}>
                                        <Text style={[commonStyles.h12white600]}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    const DiscountList = [
        { name: 'Percentage', value: 'Percentage' },
        { name: 'Fixed', value: 'Fixed' },
    ];

    const generateSKU = () => {
        getMethod(
            ApiUrl.generateProduct,
            success => {
                console.log('Successfully got Customer list', success.data);
                setValue('sku', success.data);
                setProductNum((success.data).toString());
            },
            error => {
                console.log('Error fetching Customer list:', error);
            }
        )
    };

    const createNewProduct = () => {
        const [dropdownValue, setDropdownValue] = useState<string | null>(null);
        const [isFocus, setIsFocus] = useState<boolean>(false);
        const [unitValue, setUnitValue] = useState<string | null>(null);
        const [isFocusDiscount, setIsFocusDiscount] = useState<boolean>(false);
        const [isFocusUnit, setIsFocusUnit] = useState<boolean>(false);
        const [dropdownTax, setDropdownTax] = useState<string | null>(null)
        const [isFocusTax, setIsFocusTax] = useState<boolean>(false);
        const [dropdownDiscount, setDropdownDiscount] = useState<string | null>(null)

        const itemType = [
            {
                id: 1,
                name: 'Product',
            },
            {
                id: 2,
                name: 'Services',
            },
        ]

        const handleDropdownChange = (item: {
            name: string, _id: string
        }) => {
            setDropdownValue(item.name);
            setValue('category', item._id);
            setIsFocus(false);
        };
        const handleTaxChange = (item: {
            name: string, _id: string
        }) => {
            setDropdownTax(item.name);
            setValue('tax', item._id);
            setIsFocusTax(false);
            const formData = getValues();
            formData.type = formData.type === '' ? setValue('type', 'product') : formData.type;
        };

        const handleDiscountChange = (item: {
            name: string, _id: string
        }) => {
            setDropdownDiscount(item.name);
            setValue('discountType', item.name);
            setIsFocusDiscount(false);
        };

        const handleUnitChange = (item: {
            name: string, _id: string
        }) => {
            setUnitValue(item.name);
            setValue('units', item._id);
            setIsFocusUnit(false);
        };
        const handleImage = (picData: any) => {
            setImageData(picData);
        };

        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} automaticallyAdjustKeyboardInsets={true}>
                <View>
                    <View style={[flexRow, justifyBetween]}>
                        <Text style={[commonStyles.h18BlackOne700,{}]}>{labels.createNewProduct}</Text>
                        <TouchableOpacity onPress={closeCreateNewProductModal} style={[{ backgroundColor: colors.greyOne, height: 25, width: 25, borderRadius: 100, }, alignItemCenter, justifyCenter]}>
                            <CustomIcon name="close" size={16} color={colors.blackOne} type='Ionicons' />
                        </TouchableOpacity>
                    </View>
                    <View style={[mt15, mb10]}>
                        <UploadImageCard title={labels.productImage} sizeInfo={labels.sizeOfImg1} imageTag={handleImage} onUpload={() => { }} onDelete={() => { }} />
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
                        <View style={[flexRow, mt10]}>
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
                                        error={errors['name']?.message}
                                    />
                                )}
                                rules={{
                                    required: requiredValidation('name'),
                                }}
                            />
                        </View>
                        <View style={[flexRow, mt10]}>
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
                                            error={errors.sku?.message as string | undefined}
                                            showOtp={true}
                                            getNumber={generateSKU}
                                        />
                                    );
                                }}
                            // rules={{
                            //     required: 'Product code is required',
                            // }}
                            />
                        </View>
                        <View style={[flexRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row' }}>
                               <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.productCategory}</Text>
                                <Text style={[commonStyles.h14Danger400]}> *</Text>
                            </View>
                        </View>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={[flexColumn]}>
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
                                                error={errors.sellingPrice?.message as string | undefined}
                                                keyboardType='numeric'
                                            />
                                        )}
                                    />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column' }}>
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
                                                error={errors.purchasePrice?.message as string | undefined}
                                                keyboardType='numeric'
                                            />
                                        )}
                                    />

                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={[flexRow, mt15]}>
                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.units}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                <View style={[{ width: DevWidth / 2.3 }]}>
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
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <View style={[flexRow, mt15]}>
                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.discountType}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                <View style={[{ width: DevWidth / 2.3 }]}>
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

                                </View>
                            </View>
                        </View>
                        <View style={[flexRow, mt10]}>
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
                                            error={errors['barcode']?.message}
                                            keyboardType='numeric'
                                        />
                                    );
                                }}
                                rules={{
                                    required: requiredValidation('barcode'),
                                }}
                            />
                        </View>
                        <View style={[flexRow, mt10]}>
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
                                            error={errors['discountValue']?.message}
                                            keyboardType='numeric'
                                        />
                                    );
                                }}
                                rules={{
                                    required: requiredValidation('discountValue'),
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={[flexRow, mt15]}>
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
                                                    error={errors['alertQuantity']?.message}
                                                    keyboardType='numeric'
                                                />
                                            );
                                        }}
                                        rules={{
                                            required: requiredValidation('alertQuantity'),
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[flexColumn, mt15]}>
                                <View style={[flexRow]}>
                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.tax}</Text>
                                    <Text style={[commonStyles.h14Danger400]}> *</Text>
                                </View>
                                <View style={[{ width: DevWidth / 2.3 }]}>
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

                                </View>
                            </View>
                        </View>
                        <View style={[flexRow, justifyBetween, { marginVertical: 20 }]}>
                            <OnboardingButton
                                width={150}
                                title={labels.reset}
                                onChange={handleCancelBtnClick}
                                backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                                color={isActiveBtn ? colors.white : colors.blackOne}
                            />
                            <OnboardingButton
                                width={150}
                                title={labels.saveChanges}
                                onChange={handleSaveBtnClick}
                                backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                                color={isActiveBtn ? colors.blackOne : colors.white}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView >
        )
    }
    const [quantities, setQuantities] = useState<{ [key: string]: number }>(
        listData.reduce((acc: any, product: { _id: any; }) => ({ ...acc, [product._id]: 0 }), {})
    );

    const handleIncrement = (id: string) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [id]: (prevQuantities[id] || 0) + 1
        }));
    };

    const handleDecrement = (id: string) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [id]: Math.max((prevQuantities[id] || 0) - 1, 0)
        }));
    };

    const handleAdd = (id: string) => {
        console.log(`Product ${id} added with quantity: ${quantities[id]}`);
        // Handle adding the product to the cart or whatever action you want
    };

    const handleSave = () => {
        console.log('Products and quantities:', listData.map((product: { _id: string | number; }) => ({
            ...product,
            quantity: quantities[product._id]
        })));
        const data = listData.map((product: { _id: string | number; }) => ({
            ...product,
            quantity: quantities[product._id]
        }));
        // need to filter the data which has quantity >0
        const filterdata = data.filter((product: { quantity: number; }) => product.quantity > 0)
        console.log('Products and quantities:', filterdata);
        if (Boolean(filterdata)) {
            handlereturnData(filterdata);
        }
        navigation.goBack();
    };
    const renderItem = ({ item }: { item: any }) => (
        <ProductCard
            item={item}
            quantity={quantities[item._id]}
            onIncrement={() => handleIncrement(item._id)}
            onDecrement={() => handleDecrement(item._id)}
            onAdd={() => handleAdd(item._id)}
        />
    );

    return (
        <View style={[mv10, mh10, { backgroundColor: colors.greyOne, flex: 1 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[{ backgroundColor: colors.greyTwo, height: 36, width: 36, borderRadius: 10, }, alignItemCenter, justifyCenter]}>
                        <CustomIcon name={"chevron-left"} size={20} color={colors.blackOne} type={"Entypo"} />
                    </TouchableOpacity>
                    <Text style={[commonStyles.h18BlackOne700,{}]} >{labels.products}</Text>
                    <View style={{ width: 36}} />
                    {/* <TouchableOpacity style={[{ backgroundColor: colors.greyTwo, height: 36, width: 36, borderRadius: 10, }, alignItemCenter, justifyCenter]} onPress={openSearchProductModal}>
                        <CustomIcon name='search' size={16} color={colors.blackTwo} type='Feather' />
                    </TouchableOpacity> */}
                </View>
                <View style={mt10}>
                    {listData && listData.length > 0 &&
                        <View style={{ paddingHorizontal: 16 }}>
                            <FlatList
                                data={listData}
                                renderItem={renderItem}
                                nestedScrollEnabled={true}
                                keyExtractor={(item) => item?._id.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    }
                </View>

            </ScrollView>
            <View style={{ marginTop: 2 }}>
                <TouchableOpacity onPress={openCreateNewProductModal} style={[flexRow, justifyCenter, alignItemCenter, alignSelfCenter, {
                    height: 40, width: '50%', backgroundColor: colors.white, borderRadius: 5,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.40, shadowRadius: 2.84
                }]}>
                    <View style={[alignItemCenter, justifyCenter, { height: 16, width: 16, borderRadius: 5, backgroundColor: colors.primary }]}>
                        <CustomIcon color={colors.white} name='plus' size={12} type='Entypo' />
                    </View>
                    <Text style={[{ color: colors.primary }, ml5]}>Create New Product</Text>
                </TouchableOpacity>
            </View>
            <View style={{}}>
                <OnboardingButton
                    width='100%'
                    title={labels.continue}
                    onChange={handleSave}
                    backgroundColor={colors.primary}
                    color={colors.white}
                />
            </View>
            <CustomModal children={createNewProduct()} visible={showCreateNewProductModal} onClose={closeCreateNewProductModal} height={'85%'} />
            <CustomModal children={searchProduct()} visible={showSearchProductModal} onClose={closeSearchProductModal} height={'80%'} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})
export default ProductScreen;