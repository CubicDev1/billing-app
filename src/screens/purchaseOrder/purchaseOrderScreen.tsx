import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ExpandableSection, ListSubHeader, MultiSelectOption, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine, { DashedLines } from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, patchMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, justifyCenter, mb10, mb5, mh10, mh15, ml10, ml5, mr10, mt5, mv10, mv15, mv5, ph10 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import moment from 'moment';
import { defaultProfileImage, fallbackImage } from '../../utils/png';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import * as TYPES from '../../action/ActionType';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type purchaseScreenProps = {

}

export interface Root {
    program: string
    version: string
    release: string
    datetime: string
    timestamp: number
    status: string
    code: number
    message: string
    totalRecords: number
    data: Data[]
}

export interface Data {
    _id: string
    purchaseOrderId: string
    vendorId: string
    purchaseOrderDate: string
    dueDate: string
    referenceNo: string
    items: Item[]
    taxableAmount: string
    totalDiscount: string
    vat: string
    roundOff: boolean
    TotalAmount: string
    bank?: string
    notes: string
    termsAndCondition: string
    sign_type: string
    signatureId?: SignatureId
    signatureImage?: string
    isDeleted: boolean
    userId: string
    createdAt: string
    updatedAt: string
    __v: number
    vendorInfo: VendorInfo
    signatureName?: string
}

export interface Item {
    name: string
    key: string
    productId: string
    quantity: string
    units: string
    unit: string
    rate: string
    discount: string
    tax: string
    taxInfo: string
    amount: string
    discountType: string
    isRateFormUpadted: string
    form_updated_discounttype: string
    form_updated_discount: string
    form_updated_rate: string
    form_updated_tax: string
}

export interface SignatureId {
    _id: string
    signatureName: string
    signatureImage: string
    status: boolean
    markAsDefault: boolean
    isDeleted: boolean
    userId: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface VendorInfo {
    _id: string
    vendor_name: string
    vendor_email: string
    vendor_phone: string
    balance: number
    balanceType: string
    user_id: string
    status: boolean
    created_at: string
    updated_at: string
    isDeleted: boolean
    __v: number
}


type FormData = {
    search_vendor: string;
};



const PurchaseOrderScreen = (props: purchaseScreenProps) => {
    const [purchaseOrderFilter, setPurchaseOrderFilter] = useState(false);
    const [vendorsList, setVendorsList] = useState<Data[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ vendor_name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.vendor);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ vendor_name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.vendor));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ vendor_name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();
    const toast = useToast();
    const dispatch = useDispatch();
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);


    const openFilterModal = () => {
        setPurchaseOrderFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getPurchaseOrdersList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setPurchaseOrderFilter(false);
    };

    const getDropdown = () => {
        getMethod(
            ApiUrl.dropDownVendor,
            success => {
                if (success.code == 200) {
                    dispatch({ type: TYPES.VENDOR_LIST, payload: success.data })
                    setFilteredCustomers(success.data);
                } else {
                    //console.log('Failed to get vendor list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching vendor list:', error);
            }
        );
    }

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getPurchaseOrdersList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setPurchaseOrderFilter(false);
        setSearchText('');
        getPurchaseOrdersList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getPurchaseOrdersList(1, selectedCustomers);
        setPurchaseOrderFilter(false);
        setSearchText('');
    }

    const getPurchaseOrdersList = (page: number, selectedCustomers: Array<{ vendor_name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&vendor=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getDropdown();
        getMethod(
            `${ApiUrl.purchasesOrderList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setVendorsList(success.data);
                    setTotal(success.totalRecords);
                    setVendorsList(page == 1 ? success.data : [...vendorsList, ...success.data]);
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

    const formatDate = (dateString: string) => {
        return moment(dateString).format('DD-MM-YYYY');
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = CustomerList.filter(customer => customer.vendor_name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCustomers(filteredCustomersNew ?? []);
    };

    const clonePurchase = (purchaseOrder: Data) => {
        const cloneUrl = `${ApiUrl.purchaseOrderClone}/${purchaseOrder._id}/clone`;
        postMethod(
            cloneUrl,
            {},
            (success: { code: number; message: any; data: Data }) => {
                if (success.code === 200) {
                    setPage(1);
                    getPurchaseOrdersList(1, selectedCustomers);
                    toast.show("Clone successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Successfully cloned purchase order',);
                } else {
                    toast.show("Failed to clone purchase order'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Failed to clone purchase order:', success.message);
                }
            },
            error => {
                console.log('Error cloning purchase:', error);
            }
        );
    };

    const deletePurchaseOrder = (id: any) => {
        patchMethod(
            `${ApiUrl.purchaseOrderDeleteA}/${id}/${ApiUrl.purchaseOrderDeleteB}`,
            {},
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    setPage(1);
                    setSelectedCustomers([]);
                    getPurchaseOrdersList(1, []);
                    toast.show("Delete successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Successfully deleted');
                } else {
                    console.log('Failed to delete:', success.message);
                }
            },
            error => {
                console.log('Error deleting:', error);
            }
        );
    };

    const handleDeletePress = (customerId: string) => {
        setCustomerToDelete(customerId);
        setOpenDeleteModal(true); // Open the delete confirmation modal
    };

    const confirmDeleteCustomer = () => {
        if (customerToDelete) {
            deletePurchaseOrder(customerToDelete); // Call the delete logic
            setCustomerToDelete(null); // Reset the state
        }
        setOpenDeleteModal(false); // Close the modal
    };

    const cancelDeleteCustomer = () => {
        setCustomerToDelete(null); // Reset the state
        setOpenDeleteModal(false); // Close the modal
    };


    const addPress = () => {
        (navigation as any).navigate(screenName.AddPurchaseOrderScreen, { isAddedProductAvailable: false } as never)
    }
    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.purchaseOrders} />
                            </View>
                            <View style={[commonStyles.bottomWidth, mv5]} />

                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} listName={labels.purchaseOrders} totalNumber={total} onAddPress={() => addPress()} onFilterPress={openFilterModal} />
                                <FlatList
                                    data={vendorsList}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, vendorsList.length);
                                        if (total > vendorsList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const data = item;
                                        return (
                                            <View key={data._id}>
                                                <TouchableOpacity style={[commonStyles.mainListCard]} onPress={() => navigation.navigate(screenName.PurchaseOrderDetails, { itemId: data._id } as never)}>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <View style={[flexRow]}>

                                                            <View style={[alignSelfCenter, mh10]}>
                                                                <Text style={[commonStyles.h12blackTwo400]}>{'Vendor'}</Text>
                                                                <Text style={[commonStyles.h16blackOne500]}>{data.vendorInfo.vendor_name}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                            <TouchableOpacity onPress={() => navigation.navigate(screenName.AddPurchaseOrderScreen, { isAddedProductAvailable: false, vendorDetails: data } as any)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                                                                <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => handleDeletePress(data._id)}
                                                                style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                                <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => clonePurchase(data)}
                                                                style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                                <CustomIcon name={'copy'} size={15} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.purchaseOrderID}</Text>
                                                                <Text style={[commonStyles.h12Primary400]}>#{data.purchaseOrderId}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                                                                <Text style={commonStyles.h14blackOne600}>{currencySymbol}{data.TotalAmount}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.date}</Text>
                                                                <Text style={commonStyles.h14blackOne600}>{formatDate(data.purchaseOrderDate)}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index + ''}
                                />
                            </View>
                            {openDeleteModal && (
                                <PopupCardModal
                                    handleYesBtn={confirmDeleteCustomer}
                                    handleNobtn={cancelDeleteCustomer}
                                    text="Are you sure you want to delete this purchase order?"
                                    visible={openDeleteModal}
                                    onClose={cancelDeleteCustomer}
                                />
                            )}
                        </View>
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setPurchaseOrderFilter(false)} title='Filter' />
                                <Text style={[commonStyles.h14blackOne600, mv10]} >{"Vendor"}</Text>
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
                                        data={filteredCustomers}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={[flexRow, alignItemCenter, mv5]}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const isSelected = selectedCustomers.find((id) => id._id === item._id)
                                                            if (isSelected) {
                                                                setSelectedCustomers(selectedCustomers.filter((id) => id._id !== item._id))
                                                            } else {
                                                                setSelectedCustomers([...selectedCustomers, item])
                                                            }
                                                        }}
                                                        style={[
                                                            styles.multiSelectBox,
                                                            {
                                                                marginHorizontal: 5,
                                                                backgroundColor: selectedCustomers.find((id) => id._id === item._id) ? colors.primary : colors.white,
                                                                borderWidth: selectedCustomers.find((id) => id._id === item._id) ? 0 : 1,
                                                                borderColor: selectedCustomers.find((id) => id._id === item._id) ? colors.primary : colors.grey,
                                                            },
                                                        ]}
                                                    >
                                                        {selectedCustomers.find((id) => id._id === item._id) && (
                                                            <CustomIcon name="check" size={15} color="white" type="MaterialIcons" />
                                                        )}
                                                    </TouchableOpacity>
                                                    <Text style={commonStyles.h14blackOne600}>{item.vendor_name}</Text>
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
                            visible={purchaseOrderFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default PurchaseOrderScreen;

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
