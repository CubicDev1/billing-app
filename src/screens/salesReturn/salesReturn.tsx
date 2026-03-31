import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ExpandableSection, ListSubHeader, MultiSelectOption, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, patchMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mh10, mh15, mh5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
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
import PopupCardModal from '../../components/popupCardModal';
import { useToast } from 'react-native-toast-notifications';
import { fallbackImage } from '../../utils/png';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';


export type purchasesProps = {

}

export interface SalesReportAndSalesReturnReport {
    _id: string;
    credit_note_id: string;
    customerId: string;
    credit_note_date: string;
    due_date: string;
    reference_no: string;
    items: Item[];
    discountType?: string;
    status: string;
    paymentMode: string;
    discount?: string;
    tax?: string;
    taxableAmount: string;
    totalDiscount: string;
    vat: string;
    roundOff: boolean;
    TotalAmount: string;
    bank?: string;
    notes: string;
    termsAndCondition: string;
    sign_type: string;
    signatureId?: SignatureId;
    signatureImage?: string;
    userId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    customerInfo: CustomerInfo; // Include customerInfo type here
    signatureName: any;
}

export interface Item {
    productId: string;
    quantity: string;
    unit: string;
    rate: string;
    discount: string;
    tax: string;
    amount: string;
    name?: string;
    discountValue?: string;
    key?: string;
    units?: string;
    taxInfo?: string;
    discountType?: string;
    isRateFormUpadted?: string;
    form_updated_discounttype?: string;
    form_updated_discount?: string;
    form_updated_rate?: string;
    form_updated_tax?: string;
}

export interface SignatureId {
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

export interface CustomerInfo {
    _id: string;
    name: string;
    email: string;
    phone: string;
    website: string;
    image: string;
    notes: string;
    status: string;
    billingAddress: BillingAddress;
    shippingAddress: ShippingAddress;
    bankDetails: BankDetails;
    userId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface BillingAddress {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface ShippingAddress {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface BankDetails {
    bankName: string;
    branch: string;
    accountHolderName: string;
    accountNumber: string;
    IFSC: string;
}

const SalesReturn = () => {
    const [purchaseFilter, setPurchaseFilter] = useState(false);
    const [purchasesList, setPurchasesList] = useState<SalesReportAndSalesReturnReport[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.totalCustomer);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.totalCustomer));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();
    const toast = useToast();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
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

    const getPurchasesList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.salesAndSalesReturn}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
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
        const filteredCustomersNew = CustomerList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCustomers(filteredCustomersNew ?? []);
    };

    const addPress = () => {
        (navigation as any).navigate(screenName.AddSalesReturn, { isAddedProductAvailable: false } as never)
    }


    const deleteSalesReturn = (_id: any) => {
        patchMethod(
            `${ApiUrl.deleteSalesReturn}/${_id}`,
            {},
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    setPage(1);
                    getPurchasesList(1, selectedCustomers);
                    toast.show("Sales Return Deleted Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Successfully deleted');
                } else {
                    console.log('Failed to delete:', success.message);
                    toast.show("Failed to Delete Sales Return", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                console.log('Error deleting:', error);
                toast.show("Sales Return Deletion failed'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
        );
    };


    const handleDeletePress = (customerId: string) => {
        setCustomerToDelete(customerId);
        setOpenDeleteModal(true); // Open the delete confirmation modal
    };

    const confirmDeleteCustomer = () => {
        if (customerToDelete) {
            deleteSalesReturn(customerToDelete); // Call the delete logic
            setCustomerToDelete(null); // Reset the state
        }
        setOpenDeleteModal(false); // Close the modal
    };

    const cancelDeleteCustomer = () => {
        setCustomerToDelete(null); // Reset the state
        setOpenDeleteModal(false); // Close the modal
    };


    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.salesReturn} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]} />
                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} onAddPress={addPress} listName={labels.salesReturn} totalNumber={total} onFilterPress={openFilterModal} />
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
                                        const report = item;
                                        let backgroundColor;
                                        if (report.status === 'PAID') {
                                            backgroundColor = colors.green;
                                        } else if (report.status === 'PENDING') {
                                            backgroundColor = colors.blue;
                                        } else if (report.status === 'CANCELLED') {
                                            backgroundColor = colors.danger;
                                        } else {
                                            backgroundColor = colors.white;
                                        }

                                        const imageUri = report?.customerInfo?.image || fallbackImage;

                                        return (
                                            <View key={report._id}>
                                                 <TouchableOpacity style={[commonStyles.mainListCard]} onPress={() => (navigation as any).navigate(screenName.SalesReturnDetails, { itemId: report._id } as never)}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                        <View style={[flexRow, alignItemCenter]}>
                                                            {report?.customerInfo?.image ? (
                                                                <Image
                                                                    source={{ uri: imageUri }}
                                                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                                                />
                                                            ) : (
                                                                <Image
                                                                    source={{ uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=' }} // Placeholder image
                                                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                                                />
                                                            )}
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                                    <Text style = {[commonStyles.h12Primary400]}>#{report?.credit_note_id}</Text>
                                                                     <Text style ={[commonStyles.h15blackOne600]}>{report.customerInfo?.name}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        {/* {report?.customerInfo?.image &&
                                                        <Image
                                                            source={{ uri: imageUri }}
                                                            style={{ width: 50, height: 50, borderRadius: 10 }}
                                                        />} */}

                                                        <View style={[flexRow, alignItemCenter]}>
                                                            <View style={{ alignSelf: 'center' }}>
                                                                <View
                                                                    style={{
                                                                        backgroundColor,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        paddingHorizontal: 5,
                                                                        paddingVertical: 4,
                                                                        borderRadius: 4,
                                                                        marginHorizontal: 5
                                                                    }}
                                                                >
                                                                    <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: colors.white }} />
                                                                    <Text style={[commonStyles.h12white600,mh5]} >{report.status}</Text>
                                                                </View>
                                                            </View>
                                                            <TouchableOpacity onPress={() => (navigation as any).navigate(screenName.AddSalesReturn, { isAddedProductAvailable: false, salesReturnData: report } as never)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                                                                <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => handleDeletePress(report._id)}
                                                                style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                                <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    {/* <View style={{ marginVertical: 10 }}>
                                                    <DashedLine height={310} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                </View> */}
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10, marginTop: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{report.TotalAmount}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.modeOfPayment}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{report.paymentMode}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.dueDate}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{formatDate(report.due_date)}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    }}
                                    keyExtractor={(item, index) => index + ''}
                                />
                            </View>
                        </View>
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setPurchaseFilter(false)} title='Filter' />
                               <Text style={[commonStyles.h14blackOne600,mv10]}>{"Customer"}</Text>
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
                            visible={purchaseFilter}
                            onClose={closeModal}
                            height={'80%'} />

                        {openDeleteModal && (
                            <PopupCardModal
                                handleYesBtn={confirmDeleteCustomer}
                                handleNobtn={cancelDeleteCustomer}
                                text="Are you sure you want to delete this customer?"
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

export default SalesReturn;

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
