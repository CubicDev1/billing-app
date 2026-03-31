import {  useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import {  ListSubHeader, MultiLineTextBox, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { getMethod, postMethod, putMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, justifyCenter, mh10, mh15, mh5, mt10, mt15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import { screenName } from '../../utils/screenNames';
import PopupCardModal from '../../components/popupCardModal';
import { requiredValidation } from '../../utils/validationConfig';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getMainContainerStyle, getTopNotchStyle, KeyboardAScrollView } from '../../utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { H12danger600 } from '../../utils/styledComponents';


export type InventoryListProps = {}
interface UnitInfo {
    name: string;
}

type FormData = {
    notes: string;
    productId: string;
    quantity: number;
    search_inventory: string;
    search: string;
};

interface InventoryInfo {
    quantity: number;
    isDeleted: boolean;
}

export type SettingsComponentsProps = {
    onSave: (filteredInventory: Product[]) => void;
    onCancel: () => void;
};

interface Product {
    _id: string;
    name: string;
    sku: string;
    sellingPrice: number;
    purchasePrice: number;
    isDeleted: boolean;
    unitInfo: UnitInfo[];
    inventory_Info: InventoryInfo[];
}

const InventoryList = () => {
    const [stockFilter, setStockFilter] = useState(false);
    const [inventoryList, setInventoryList] = useState<Product[]>([]);
    const [stockAddShowModal, setStockAddShowModal] = useState(false);
    const [stockRemoveShowModal, setStockRemoveShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<string>('');
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const ProductList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.product);
    const [filteredProducts, setFilteredProducts] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.product));
    const [selectedProducts, setSelectedProducts] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();
    const toast = useToast();

    useEffect(() => {
        if (selectedItem) {
            setQuantity(selectedItem.inventory_Info[0]?.quantity.toString() || '');
        }
    }, [selectedItem]);

    const openFilterModal = () => {
        setStockFilter(true);
    };

    const {
        handleSubmit,
        control,
        trigger,
        formState: { errors },
        setValue,
        reset
    } = useForm<FormData>();


    useEffect(() => {
        if (page > 1) {
            getPurchasesList(page, selectedProducts);
        }
    }, [page]);

    const closeModal = () => {
        setStockFilter(false);
        setStockAddShowModal(false);
        setStockRemoveShowModal(false);
        setQuantity('');
        setSelectedItem(null);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedProducts([]);
            getPurchasesList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedProducts([]);
        setFilteredProducts(ProductList);
        setValue('search', '');
        setPage(1);
        setStockFilter(false);
        setSearchText('');
        getPurchasesList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredProducts(ProductList);
        getPurchasesList(1, selectedProducts);
        setStockFilter(false);
        setSearchText('');
    }

    const getPurchasesList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&product=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.inventoryList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setInventoryList(success.data);
                    setTotal(success.totalRecords);
                    setInventoryList(page == 1 ? success.data : [...inventoryList, ...success.data]);
                    doChangeSpinnerFlag(false);
                    console.log('Successfully got expenses list', success.data);
                } else {
                    console.log('Failed to get expenses list:', success.message);
                    doChangeSpinnerFlag(false);
                }
            },
            error => {
                console.log('Error fetching expenses list:', error);
                doChangeSpinnerFlag(false);
            }
        );
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = ProductList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredProducts(filteredCustomersNew ?? []);
    };

    const openModal = (modalType: string, item: Product) => {
        setSelectedItem(item);
        reset(); // Reset the form fields
        if (modalType === 'stockAdd') {
            setStockAddShowModal(true);
        } else if (modalType === 'stockRemove') {
            setStockRemoveShowModal(true);
        }
    };

    const renderStockButton = (label: string, color: string, textColor: string, type: string, item: Product) => (
        <View style={[commonStyles.smallCard,mh10,{backgroundColor:color}]}>
            <TouchableOpacity style={[mh5, flexRow, justifyCenter, alignItemCenter]} onPress={() => openModal(type, item)}>
                {
                    label == labels.stockOut ? <View style={{ backgroundColor: textColor, height: 11, width: 11, justifyContent: 'center', alignItems: 'center', borderRadius: 3, marginHorizontal: 5 }}>
                        <CustomIcon name={'minus'} size={8} color={colors.white} type={'Entypo'} />
                    </View> : <View style={{ backgroundColor: textColor, height: 11, width: 11, justifyContent: 'center', alignItems: 'center', borderRadius: 3, marginHorizontal: 5 }}>
                        <CustomIcon name={'plus'} size={8} color={colors.white} type={'Entypo'} />
                    </View>
                }
               <Text style={[commonStyles.h12RedTwo500,{color:textColor}]} >{label}</Text>
            </TouchableOpacity>
        </View>
    );

    const StockRemove = ({ onCancel }: SettingsComponentsProps) => {
        const [isActiveBtn, setIsActiveBtn] = useState(false);

        const handleCancelBtnClick = () => {
            onCancel();
        };

        const removeStock: SubmitHandler<FormData> = async (formData) => {
            const isValid = await trigger();
            if (!isValid) {
                toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                return;
            }
            const { quantity } = formData;
            if (!selectedItem) return;

            putMethod(
                ApiUrl.inVentoryRemoveStock,
                { quantity, productId: selectedItem._id },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        navigation.navigate(screenName.InventoryRemoved as never);
                        toast.show("Stock Removed", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        closeModal(); // Close the modal after successful addition
                    } else {
                        toast.show("Error in removing stock'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    toast.show("Error in removing stock", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        };

        return (
            <View style={[flex1]}>
                <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              extraHeight={Platform.OS === 'ios' ? 90 : 75}
            >
                    <ModalTopText title={'Remove Stock Out'} iconPress={closeModal} />
                    {selectedItem && (
                        <View >
                           <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.name}</Text>
                            <View style={[styles.input, { height: 40 }]}>
                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{selectedItem.name}</Text>
                            </View>
                           <Text style={[commonStyles.h14blackOne600,mv10]} >{'Unit'}</Text>
                            <View style={[styles.input, { height: 40 }]}>
                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]}>{selectedItem.unitInfo.length > 0 ? selectedItem.unitInfo[0].name : 'N/A'}</Text>
                            </View>

                        </View>
                    )}

                    <View>
                        <View style={[flexRow, mt15]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.quantity}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={styles.input}>
                            <Controller
                                name={'quantity'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.quantity}
                                        value={value}
                                        onChangeText={onChange}
                                        textColor={colors.black}
                                    />
                                )}
                                rules={{
                                    required: requiredValidation('Quantity'),
                                }}
                            />
                        </View>
                        {errors.quantity && (
                            <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                {errors.quantity.message}
                            </Text>
                        )}
                        <View style={[mt10]}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <MultiLineTextBox
                                        placeHolder={labels.notes}
                                        label={labels.notes}
                                        value={value}
                                        onChangeValue={onChange}
                                        multiline={true}
                                        keyboardType="default"
                                        height={100}
                                        maxLength={200}
                                        disable={false}
                                        error={errors['notes']?.message}
                                    />
                                )}
                                rules={{
                                    required: 'Notes is required',
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }} />
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
                            title={labels.apply}
                            onChange={handleSubmit(removeStock)}
                            backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                            color={isActiveBtn ? colors.blackOne : colors.white}
                        />
                    </View>
                </KeyboardAwareScrollView>

            </View>
        );
    };

    const StockAdd = ({ onCancel }: SettingsComponentsProps) => {
        const [isActiveBtn, setIsActiveBtn] = useState(false);

        const handleCancelBtnClick = () => {
            onCancel();
        };

        const addStock: SubmitHandler<FormData> = async (formData) => {
            const isValid = await trigger();
            if (!isValid) {
                toast.show("Please fill in all fields correctly", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                return;
            }
            const { quantity, notes } = formData;
            if (!selectedItem) return;

            postMethod(
                ApiUrl.inVentoryAddStock,
                { quantity, notes, productId: selectedItem._id },
                async (response: any) => {
                    if (response && response.data) {
                        setIsActiveBtn(true);
                        navigation.navigate(screenName.InventoryAdded as never);
                        toast.show("Stock Added'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        closeModal(); // Close the modal after successful addition
                    } else {
                        toast.show("Error in adding stock'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                (error) => {
                    toast.show("rror in adding stock", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        };

        return (
            <View style={[flex1]}>
                  <KeyboardAwareScrollView
                              showsVerticalScrollIndicator={false}
                              keyboardShouldPersistTaps="handled"
                              enableAutomaticScroll={true}
                              extraHeight={Platform.OS === 'ios' ? 90 : 75}
                            >
                    <ModalTopText title={'Add Stock In'} iconPress={closeModal} />
                    {selectedItem && (
                        <View >
                           <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.name}</Text>
                            <View style={[styles.input, { height: 40 }]}>
                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{selectedItem.name}</Text>
                            </View>
                           <Text style={[commonStyles.h14blackOne600,mv10]} >{'Unit'}</Text>
                            <View style={[styles.input, { height: 40 }]}>
                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{selectedItem.unitInfo.length > 0 ? selectedItem.unitInfo[0].name : 'N/A'}</Text>
                            </View>

                        </View>
                    )}


                    <View>
                        <View style={[flexRow, mt15]}>
                           <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.quantity}</Text>
                            <Text style={[commonStyles.h14Danger400]}> *</Text>
                        </View>
                        <View style={styles.input}>
                            <Controller
                                name={'quantity'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomTextInput
                                        placeholder={labels.quantity}
                                        value={value}
                                        onChangeText={onChange}
                                        textColor={colors.black}
                                    />
                                )}
                                rules={{
                                    required: requiredValidation('Quantity'),
                                }}
                            />
                        </View>
                        {errors.quantity && (
                            <Text style={{ color: colors.danger, marginTop: 2, marginLeft: 10 }}>
                                {errors.quantity.message}
                            </Text>
                        )}
                        <View style={[mt10]}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <MultiLineTextBox
                                        placeHolder={labels.notes}
                                        label={labels.notes}
                                        value={value}
                                        onChangeValue={onChange}
                                        multiline={true}
                                        keyboardType="default"
                                        height={100}
                                        maxLength={200}
                                        disable={false}
                                        error={errors['notes']?.message}
                                    />
                                )}
                                rules={{
                                    required: 'Notes is required',
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }} />
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
                            title={labels.apply}
                            onChange={handleSubmit(addStock)}
                            backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                            color={isActiveBtn ? colors.blackOne : colors.white}
                        />
                    </View>
                </KeyboardAwareScrollView>
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
                                <TopHeader headerText={labels.inventory} />
                            </View>
                                                          <View style={[commonStyles.bottomWidth,mv5]}  />

                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader listName={labels.inventory} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    data={inventoryList}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, inventoryList.length);
                                        if (total > inventoryList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const data = item;
                                        return (
                                             <TouchableOpacity style={[commonStyles.mainListCard]} key={data._id} disabled >
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                           <Text style={[commonStyles.h10Primary600]}>#{data.sku}</Text>
                                                             <Text style ={[commonStyles.h15blackOne600]}>{data.name}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                        <H12danger600 style={{ textDecorationLine: 'line-through', marginHorizontal: 8, alignSelf: 'center' }}>{currencySymbol + data.sellingPrice}</H12danger600>
                                                        <Text style={[commonStyles.h14blackOne600,alignSelfCenter]}>{currencySymbol + data.purchasePrice}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                    <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={[commonStyles.h14BlackTwo400]}>Quantity : </Text>
                                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >
                                                            {data.inventory_Info.length > 0 ? data.inventory_Info[0].quantity : data.inventory_Info.length}
                                                        </Text>
                                                    </View>
                                                    <View style={[flexRow]}>
                                                        {renderStockButton(labels.stockIn, colors.cardColor1, colors.blueTwo, 'stockAdd', data)}
                                                        {renderStockButton(labels.stockOut, colors.redOne, colors.danger, 'stockRemove', data)}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index + ''}
                                />
                            </View>
                        </View>
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setStockFilter(false)} title='Filter' />
                               <Text style={[commonStyles.h14blackOne600,mv10]} >{"Item"}</Text>
                                <View style={styles.input}>
                                    <Controller
                                        name={'search'}
                                        control={control}
                                        defaultValue={searchText}
                                        render={({ field: { onChange, value } }) => (
                                            <CustomTextInput
                                                placeholder={'Search'}
                                                value={value}
                                                onEnter={() => {
                                                    handleSearch(value);
                                                }}
                                                onChangeText={onChange}
                                                textColor={colors.black}
                                            />
                                        )}
                                    />

                                    <CustomIcon
                                        name={'search'}
                                        size={16}
                                        color={colors.grey}
                                        type="Feather"
                                    />
                                </View>
                                <View style={[flex1, { marginBottom: 30, marginTop: 20 }]}>
                                    <FlatList
                                        data={filteredProducts}
                                        renderItem={({ item }) => (
                                            <View style={[flexRow, alignItemCenter, mv5]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const isSelected = selectedProducts.find((id) => id._id === item._id)
                                                        if (isSelected) {
                                                            setSelectedProducts(selectedProducts.filter((id) => id._id !== item._id))
                                                        } else {
                                                            setSelectedProducts([...selectedProducts, item])
                                                        }
                                                    }}
                                                    style={[
                                                        styles.multiSelectBox,
                                                        {
                                                            marginHorizontal: 5,
                                                            backgroundColor: selectedProducts.find((id) => id._id === item._id) ? colors.primary : colors.white,
                                                            borderWidth: selectedProducts.find((id) => id._id === item._id) ? 0 : 1,
                                                            borderColor: selectedProducts.find((id) => id._id === item._id) ? colors.primary : colors.grey,
                                                        },
                                                    ]}
                                                >
                                                    {selectedProducts.find((id) => id._id === item._id) && (
                                                        <CustomIcon name="check" size={15} color="white" type="MaterialIcons" />
                                                    )}
                                                </TouchableOpacity>
                                               <Text style={commonStyles.h14blackOne600}>{item.name}</Text>
                                            </View>
                                        )}
                                    />
                                </View>
                                <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                    <OnboardingButton
                                        width={150}
                                        title={labels.reset}
                                        onChange={handleReset}
                                        backgroundColor={colors.greySeven}
                                        color={colors.blackOne}
                                    />
                                    <OnboardingButton
                                        width={150}
                                        title={labels.apply}
                                        onChange={handleApply}
                                        backgroundColor={colors.primary}
                                        color={colors.white}
                                    />
                                </View>
                            </View>

                        }
                            visible={stockFilter}
                            onClose={closeModal}
                            height={'80%'} />

                        <CustomModal
                            visible={stockAddShowModal}
                            onClose={closeModal}
                            height={'80%'}
                            children={
                                <StockAdd
                                    onSave={() => { }}
                                    onCancel={closeModal}
                                />
                            }
                        />

                        <CustomModal
                            visible={stockRemoveShowModal}
                            onClose={closeModal}
                            height={'80%'}
                            children={
                                <StockRemove
                                    onCancel={closeModal} onSave={() => { }} />
                            }
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
}
export default InventoryList;

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
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
    multiSelectBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
