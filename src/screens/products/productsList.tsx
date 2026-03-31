import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ExpandableSection, ListSubHeader, MultiSelectOption, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mb10, mh10, mh15, ml10, mr10, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import { screenName } from '../../utils/screenNames';
import { Image } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import { commonStyles } from '../../utils/commonStyles';

interface Product {
    __v: number;
    _id: string;
    alertQuantity: number;
    barcode: string;
    category: {
        __v: number;
        _id: string;
        created_at: string;
        image: string;
        isDeleted: boolean;
        name: string;
        slug: string;
        updated_at: string;
        user_id: string;
    };
    createdAt: string;
    discountType: string;
    discountValue: number;
    id: string;
    images: string[] | string;
    isDeleted: boolean;
    name: string;
    productDescription: string;
    purchasePrice: number;
    sellingPrice: number;
    sku: string;
    tax: {
        __v: number;
        _id: string;
        createdAt: string;
        isDeleted: boolean;
        name: string;
        status: boolean;
        taxRate: string;
        type: string;
        updatedAt: string;
        userId: string;
    };
    text: string;
    type: string;
    units: {
        __v: number;
        _id: string;
        created_at: string;
        id: string;
        isDeleted: boolean;
        name: string;
        symbol: string;
        updated_at: string;
        user_id: string;
    };
    updatedAt: string;
    userId: string;
}

const ProductsList = () => {
    const [productFilter, setProductFilter] = useState(false);
    const [paymentList, setPaymentList] = useState<Product[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.product);
    const [filteredProducts, setFilteredProducts] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.product));
    const [selectedProducts, setSelectedProducts] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const toast = useToast();
    const navigation = useNavigation();
    const openFilterModal = () => {
        setProductFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getProductsList(page, selectedProducts);
        }
    }, [page]);

    const closeModal = () => {
        setProductFilter(false);
        setOpenDeleteModal(false);
        setSelectedProduct('');
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedProducts([]);
            getProductsList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedProducts([]);
        setFilteredProducts(CustomerList);
        setValue('search', '');
        setPage(1);
        setProductFilter(false);
        setSearchText('');
        getProductsList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredProducts(CustomerList);
        getProductsList(1, selectedProducts);
        setProductFilter(false);
        setSearchText('');
    }

    const deletedProduct = (id: string) => {
        postMethod(
            `${ApiUrl.deleteProduct}`,
            { _id: id },
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    console.log('productt deleted successfully');
                    setOpenDeleteModal(false);
                    setPage(1);
                    getProductsList(1, selectedProducts);
                    toast.show("Deleted product successfully'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                } else {
                    toast.show("Failed to delete product'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                console.log('Error deleting category:', error);
                toast.show("Failed to delete product'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
        );
    }

    const getProductsList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&product=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.productsList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setPaymentList(success.data);
                    setTotal(success.totalRecords);
                    setPaymentList(page == 1 ? success.data : [...paymentList, ...success.data]);
                    doChangeSpinnerFlag(false);
                    console.log('Successfully list', success.data);
                } else {
                    console.log('Failed list:', success.message);
                    doChangeSpinnerFlag(false);
                }
            },
            error => {
                console.log('Error fetching expenses list:', error);
                doChangeSpinnerFlag(false);
            }
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = CustomerList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredProducts(filteredCustomersNew ?? []);
    };

    const addPress = () => {
        navigation.navigate(screenName.AddNewProducts as never);
    };

    return (
        <View style={[{ backgroundColor: colors.whiteTwo }]}>
            <View style={{ marginBottom: 300 }}>
                <ListSubHeader addIcon={true} onAddPress={addPress} listName={labels.products} totalNumber={total} onFilterPress={openFilterModal} />
                <FlatList
                    contentContainerStyle={{ paddingBottom: 10 }}
                    data={paymentList}
                    ListEmptyComponent={
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                        </View>
                    }
                    onEndReached={() => {
                        console.log('onEndReached', page, total, paymentList.length);
                        if (total > paymentList.length) {
                            setPage(page + 1);
                        }
                    }}
                    renderItem={({ item, index }) => {
                        const data = item;
                        return (
                             <TouchableOpacity style={[commonStyles.mainListCard]} disabled key={data._id}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ backgroundColor: colors.whiteOne, height: 48, width: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                            {data.images == '' ?
                                                <Image
                                                    source={{ uri: 'https://www.iaei.org/global_graphics/default-store-350x350.jpg' }}
                                                    resizeMode="contain"
                                                    style={{ height: 45, width: 45 }}
                                                /> :
                                                <Image
                                                    source={{ uri: data.images }}
                                                    resizeMode="contain"
                                                    style={{ height: 45, width: 45 }}
                                                />
                                            }
                                        </View>
                                        <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                           <Text style={[commonStyles.h10Primary600]}>{data.sku}</Text>
                                             <Text style ={[commonStyles.h15blackOne600]}>{data.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <TouchableOpacity onPress={() => (navigation as any).navigate(screenName.AddNewProducts, { Productdata: data } as any)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                            <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { setSelectedProduct(data._id), setOpenDeleteModal(true) }} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                    <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={[commonStyles.smallCard]}>
                                           <Text style={[commonStyles.h12RedTwo500,mh10]} >{data.type}</Text>
                                        </View>
                                        <View style={{ borderStartWidth: 1, borderStartColor: colors.greyTwo, marginHorizontal: 5, height: 15, alignSelf: 'center' }}></View>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{labels.alertQuantity} : {data.alertQuantity}</Text>
                                    </View>
                                    <View style={[flexRow]}>
                                        {
                                            data.sellingPrice > data.purchasePrice ? (<Text  style={[commonStyles.h12RedTwo500,{ textDecorationLine: 'line-through', marginHorizontal: 8, alignSelf: 'center' }]}>{currencySymbol}{data?.sellingPrice}</Text>) : null
                                        }
                                       <Text style={[commonStyles.h14blackOne600,alignSelfCenter]}>{currencySymbol}{data.purchasePrice}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => index + ''}
                />
            </View>
            {openDeleteModal && <PopupCardModal handleYesBtn={() => deletedProduct(selectedProduct)} text={`Do you want to delete this Product?`} visible={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />}
            <CustomModal children={

                <View style={[justifyBetween, flex1]}>
                    <ModalTopText iconPress={() => setProductFilter(false)} title='Filter' />
                   <Text style={[commonStyles.h14blackOne600,mv10]} >{"Product"}</Text>
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
                            renderItem={({ item }) => {
                                return (
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
                                )
                            }}
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
                visible={productFilter}
                onClose={closeModal}
                height={'80%'} />
        </View>
    );
};

export default ProductsList;

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
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
