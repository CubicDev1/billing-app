import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { getMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mh10, mh15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import { screenName } from '../../utils/screenNames';
import PopupCardModal from '../../components/popupCardModal';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles, getMainContainerStyle, getTopNotchStyle } from '../../utils/commonStyles';


export type purchasesProps = {

}

export interface Vendor {
    _id: string;
    vendor_name: string;
    vendor_email: string;
    vendor_phone: string;
    balance: number;
    balanceType: string;
    user_id: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    isDeleted: boolean;
    __v: number;
}

export interface TaxInfo {
    _id: string;
    name: string;
    taxRate: string;
    status: boolean;
    type: string;
    userId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Item {
    name: string;
    key: string;
    productId: string;
    quantity: string;
    units: string;
    unit: string;
    rate: string;
    discount: string;
    tax: string;
    taxInfo: string;  // Serialized JSON string of TaxInfo
    amount: string;
    discountType: string;
    isRateFormUpdated: string;
    form_updated_discounttype: string;
    form_updated_discount: string;
    form_updated_rate: string;
    form_updated_tax: string;
}

export interface Signature {
    _id: string;
    signatureName: string;
    signatureImage: string;
    status: boolean;
    markAsDefault: boolean;
    isDeleted: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Data {
    _id: string;
    purchaseId: string;
    vendorId: Vendor;
    purchaseDate: string;
    debit_note_id: string
    referenceNo: string;
    items: Item[];
    status: string;
    paymentMode: string;
    taxableAmount: string;
    totalDiscount: string;
    vat: string;
    roundOff: boolean;
    TotalAmount: string;
    bank: string | null;
    notes: string;
    termsAndCondition: string;
    sign_type: string;
    signatureId: Partial<Signature>;
    signatureName: string;
    signatureImage: string | null;
    isDeleted: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Response {
    program: string;
    version: string;
    release: string;
    datetime: string;
    timestamp: number;
    status: string;
    code: number;
    message: string;
    totalRecords: number;
    data: Data[];
}

type FormData = {
    search_vendor: string;
};


const PurchaseReturn = () => {
    const [purchaseFilter, setPurchaseFilter] = useState(false);
    const [purchasesList, setPurchasesList] = useState<Data[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ vendor_name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.vendor);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ vendor_name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.vendor));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ vendor_name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const toast = useToast();

    const openFilterModal = () => {
        setPurchaseFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getPurchasesList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setPurchaseFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getPurchasesList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setPurchaseFilter(false);
        setSearchText('');
        getPurchasesList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getPurchasesList(1, selectedCustomers);
        setPurchaseFilter(false);
        setSearchText('');
    }

    const getPurchasesList = (page: number, selectedCustomers: Array<{ vendor_name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&vendor=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.purchaseReturn}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setPurchasesList(success.data);
                    setTotal(success.totalRecords);
                    setPurchasesList(page == 1 ? success.data : [...purchasesList, ...success.data]);
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
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = CustomerList.filter(customer => customer.vendor_name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCustomers(filteredCustomersNew ?? []);
    };

    const addPress = () => {
        (navigation as any).navigate(screenName.AddPurchaseReturn, { isAddedProductAvailable: false } as never)
    }

    const handleDeletePress = (customerId: string) => {
        setCustomerToDelete(customerId);
        setOpenDeleteModal(true); // Open the delete confirmation modal
    };

    const confirmDeleteCustomer = () => {
        if (customerToDelete) {
            deletePurchase(customerToDelete); // Call the delete logic
            setCustomerToDelete(null); // Reset the state
        }
        setOpenDeleteModal(false); // Close the modal
    };

    const cancelDeleteCustomer = () => {
        setCustomerToDelete(null); // Reset the state
        setOpenDeleteModal(false); // Close the modal
    };

    const deletePurchase = (_id: string) => {
        postMethod(
            `${ApiUrl.purchaseReturn}/${_id}/${ApiUrl.purchaseOrderDeleteB}`,
            {},
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    setPage(1);
                    getPurchasesList(1, selectedCustomers);
                    toast.show("Successfully deleted purchase'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                } else {
                    toast.show("Failed to delete purchase", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                console.log('Error deleting purchase:', error);
            }
        );
    };

    const clonePurchaseReturn = (purchaseOrder: Data) => {
        postMethod(
            `${ApiUrl.purchaseReturn}/${purchaseOrder._id}/clone`,
            {},
            (success: { code: number; message: any; data: any }) => {
                console.log('Successfully cloned purchase return:', success);
                toast.show("Purchase return cloned successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                setPage(1);
                getPurchasesList(1, selectedCustomers);
            },
            error => {
                toast.show("Failed to clone purchase return", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                console.log('Error cloning purchase return:', error);
            }
        );
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={{ backgroundColor: colors.white,flex:1 }}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.purchaseReturn} />
                            </View>
                                                          <View style={[commonStyles.bottomWidth,mv5]}  />

                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} onAddPress={addPress} listName={labels.purchaseReturn} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    data={purchasesList}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, purchasesList.length);
                                        if (total > purchasesList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const data = item;
                                        return (
                                            <View key={data._id}>
                                                {/* {openDeleteModal && <PopupCardModal handleYesBtn={() => deletePurchase(data._id)} text={`Do you want to delete Purchase return?`} visible={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />} */}
                                                 <TouchableOpacity style={[commonStyles.mainListCard]} onPress={() => (navigation as any).navigate(screenName.PurchaseReturnDebitNotesDetails, { itemId: data._id } as never)}>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <View style={[flexRow]}>
                                                            <View style={[alignSelfCenter, mh10]}>
                                                                <Text style={[commonStyles.h12blackTwo400]}>{'Vendor'}</Text>
                                                                <Text style={[commonStyles.h16blackOne500]}>{data.vendorId.vendor_name}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                            <TouchableOpacity onPress={() => (navigation as any).navigate(screenName.AddPurchaseReturn, { vendorDetails: data } as any)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                                                                <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                // onPress={() => deletePurchaseReturn(data._id)}
                                                                onPress={() => handleDeletePress(data._id)}
                                                                style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                                <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => clonePurchaseReturn(data)}
                                                                style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                                <CustomIcon name={'copy'} size={15} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={30} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.purchaseOrderID}</Text>
                                                                <Text style = {[commonStyles.h12Primary400]}>#{data.debit_note_id}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{data.TotalAmount}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.date}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{formatDate(data.createdAt)}</Text>
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
                        </View>
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setPurchaseFilter(false)} title='Filter' />
                               <Text style={[commonStyles.h14blackOne600,mv10]} >{"Vendor"}</Text>
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
                                        renderItem={({ item }) => (
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
                            visible={purchaseFilter}
                            onClose={closeModal}
                            height={'80%'} />

                        {openDeleteModal && (
                            <PopupCardModal
                                handleYesBtn={confirmDeleteCustomer}
                                handleNobtn={cancelDeleteCustomer}
                                text="Are you sure you want to delete this Purchase return?"
                                visible={openDeleteModal}
                                onClose={cancelDeleteCustomer}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default PurchaseReturn;

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
