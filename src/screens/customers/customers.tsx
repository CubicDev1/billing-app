import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import { DashedLines } from '../../components/dashedLine';
import { getMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, justifyCenter, mb5, mh10, mh15, ml10, ml5, mv10, mv15, mv5, ph10 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import moment from 'moment';
import { defaultProfileImage } from '../../utils/png';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import { commonStyles, getMainContainerStyle, getTopNotchStyle } from '../../utils/commonStyles';

export type customersProps = {

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
    data: Daum[]
}

export interface Daum {
    _id: string
    name: string
    email: string
    phone: string
    website: string
    image: string
    notes: string
    status: string
    billingAddress: BillingAddress
    shippingAddress: ShippingAddress
    bankDetails: BankDetails
    userId: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
    invoices: Invoice[]
    balance: number
    noOfInvoices: number
}

export interface BillingAddress {
    name: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    pincode: string
    country: string
}

export interface ShippingAddress {
    name: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    pincode: string
    country: string
}

export interface BankDetails {
    bankName: string
    branch: string
    accountHolderName: string
    accountNumber: string
    IFSC: string
}

export interface Invoice {
    _id: string
    invoiceNumber: string
    customerId: string
    invoiceDate: string
    dueDate: string
    renewalDates: any[]
    status: string
    payment_method: string
    referenceNo: string
    isRecurringCancelled: boolean
    isRecurring: boolean
    recurringCycle: string
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
    signatureId?: string
    signatureImage?: string
    isDeleted: boolean
    isCloned: boolean
    isSalesReturned: boolean
    userId: string
    createdAt: string
    updatedAt: string
    __v: number
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

type FormData = {
    search_customer: string;
};

const CustomersScreen = (props: customersProps) => {
    const [customersFilter, setCustomersFilter] = useState(false);
    const [customersList, setCustomersList] = useState<Daum[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.totalCustomer);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.totalCustomer));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();
    const [openModule, setOpenModule] = useState(false);
    const [activeId, setActiveId] = useState<string>('');
    const toast = useToast();
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userStatus, setUserStatus] = useState<string>('');


    const openFilterModal = () => {
        setCustomersFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getCustomersList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setCustomersFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getCustomersList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setCustomersFilter(false);
        setSearchText('');
        getCustomersList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getCustomersList(1, selectedCustomers);
        setCustomersFilter(false);
        setSearchText('');
    }

    const getCustomersList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.customersList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setCustomersList(success.data);
                    setTotal(success.totalRecords);
                    setCustomersList(page == 1 ? success.data : [...customersList, ...success.data]);
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
        const filteredCustomersNew = CustomerList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCustomers(filteredCustomersNew ?? []);
    };

    const handleDeletePress = (customerId: string) => {
        setCustomerToDelete(customerId);
        setOpenDeleteModal(true); // Open the delete confirmation modal
    };

    const confirmDeleteCustomer = () => {
        if (customerToDelete) {
            deleteCustomer(customerToDelete); // Call the delete logic
            setCustomerToDelete(null); // Reset the state
        }
        setOpenDeleteModal(false); // Close the modal
    };

    const cancelDeleteCustomer = () => {
        setCustomerToDelete(null); // Reset the state
        setOpenDeleteModal(false); // Close the modal
    };

    const deleteCustomer = (_id: string) => {
        postMethod(
            ApiUrl.deleteCustomer,
            { _id },
            (success: { code: number; message: any; }) => {
                if (success.code == 200) {
                    setPage(1);
                    setSelectedCustomers([]);
                    getCustomersList(1, []);
                    toast.show('Customer Deleted Successfully'), {
                        type: "success",
                        placement: "bottom",
                        duration: 500,
                        successColor: colors.green,
                        animationType: "zoom-in",
                    };
                    setOpenDeleteModal(false);
                } else {
                    toast.show('Customer Deleted Successfully'), {
                        type: "success",
                        placement: "bottom",
                        duration: 500,
                        successColor: 'red',
                        animationType: "zoom-in",
                    };
                }
            },
            error => {
                console.log('Error deleting purchase:', error);
            }
        );
    };

    const openActiveModule = (_id: string, status: string) => {
        setActiveId(_id);
        setOpenModule(true);
        setUserStatus(status);
    }

    const customerStatusChange = () => {
        const customer = customersList.find(c => c._id === activeId);
        const newStatus = customer?.status === 'Active' ? 'Deactive' : 'Active';
        console.log('newStatus', newStatus, activeId);
        const apiUrl = newStatus === 'Active' ? ApiUrl.customerStatusActive : ApiUrl.customerStatusInActive;
        postMethod(
            apiUrl,
            { _id: activeId, status: newStatus },
            (success: { code: number; message: any; data: any }) => {
                if (success.code == 200) {
                    setPage(1);
                    setSelectedCustomers([]);
                    getCustomersList(1, []);
                    toast.show('Customer status updated successfully'), {
                        type: "success",
                        placement: "bottom",
                        duration: 500,
                        successColor: colors.green,
                        animationType: "zoom-in",
                    };
                    setOpenModule(false);
                    console.log('Successfully updated customer status:', success.data);
                } else {
                    toast.show('Failed to update customer status'), {
                        type: "success",
                        placement: "bottom",
                        duration: 500,
                        //successColor: 'colors.green,'
                        animationType: "zoom-in",
                    };
                    console.log('Failed to update customer status:', success.message);
                }
            },
            error => {
                toast.show('Error updating customer status'), {
                    type: "success",
                    placement: "bottom",
                    duration: 500,
                    //successColor: 'colors.green,'
                    animationType: "zoom-in",
                };
                console.log('Error updating customer status:', error);
            }
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
                                <TopHeader headerText={labels.customers} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]}  />
                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} listName={labels.customers} totalNumber={total} onAddPress={() => (navigation as any).navigate(screenName.AddCustomersScreen, { isAddedProductAvailable: false } as never)} onFilterPress={openFilterModal} />
                                <FlatList
                                    data={customersList}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, customersList.length);
                                        if (total > customersList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const report = item;
                                        return (
                                            <View key={item._id} style={{ marginVertical: 5 }}>
                                                <TouchableOpacity onPress={() => (navigation as any).navigate(screenName.CustomerDetails, { UserDetails: item } as never)} style={[{ height: 110, width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.84, elevation: 1, borderRadius: 8 }, mb5]} key={item._id}>
                                                    <View style={[flexRow, justifyBetween, alignItemCenter, mv10, mh10]}>
                                                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                                            <View style={[{ height: 45, width: 45, borderWidth: 1, borderColor: colors.grey, borderRadius: 8 }, alignItemCenter, justifyCenter]}>
                                                                <Image source={item.image ? { uri: item.image } : defaultProfileImage} style={{ height: 40, width: 40, resizeMode: 'contain', alignItems: 'center', justifyContent: 'center' }} />
                                                            </View>
                                                            <View style={[ml10]}>
                                                                 <Text style ={[commonStyles.h15blackOne600]}>{item.name}</Text>
                                                                <Text style={[commonStyles.h12blackTwo600]}>Invoiced : {item.noOfInvoices}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                                            <TouchableOpacity onPress={() => { (navigation as any).navigate(screenName.AddCustomersScreen as never, { customerData: item }) }} style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter]}>
                                                                <CustomIcon name={'edit'} size={15} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => handleDeletePress(item._id)} style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter, ml5]}>
                                                                <CustomIcon name={'delete-forever-outline'} size={17} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => openActiveModule(item._id, item.status)} style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter, ml5]}>
                                                                {item?.status !== 'Active' ? <CustomIcon name={'user-check'} size={15} color={colors.blackTwo} type={'Feather'} /> : <CustomIcon name={'user-x'} size={15} color={colors.blackTwo} type={'Feather'} />}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={[alignItemCenter]}>
                                                        {/* <DashedLine height={330} color={colors.greyTwo} dashLength={5} dashGap={5} /> */}
                                                        <DashedLines color={colors.greyTwo} totalLengthPercentage={85} dashThickness={1} dashGap={3} />
                                                    </View>
                                                    <View style={[flexRow, justifyBetween, alignItemCenter, mh10, { marginBottom: 10, marginTop: 8 }]}>
                                                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                                            <View style={[{ height: 25, backgroundColor: colors.redOne, borderRadius: 5, }, alignItemCenter, justifyCenter, ph10]}>
                                                                <Text style={[commonStyles.h12RedFour600]} numberOfLines={1}
                                                                    ellipsizeMode="tail">Balance : {currencySymbol}{item.balance ? item.balance.toFixed(2) : 0}</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            {item.status === 'Active' && (
                                                                <TouchableOpacity style={[flexRow, justifyBetween, alignItemCenter, ml10, alignSelfCenter]} onPress={() => { (navigation as any).navigate(screenName.AddInvoiceScreen, { CustomerName: item } as never) }}>
                                                                    <View style={[{ height: 16, width: 16, backgroundColor: colors.blackOne, borderRadius: 5 }, alignItemCenter, justifyCenter]}>
                                                                        <CustomIcon color={colors.white} name='plus' size={12} type='Entypo' />
                                                                    </View>
                                                                     <Text style ={[commonStyles.h15blackOne600,ml5]} >{labels.addInvoice}</Text>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                        <View style={[{ padding: 5, backgroundColor: item.status === 'Active' ? colors.green : colors.danger, borderRadius: 5 }, alignItemCenter, justifyCenter, flexRow]}>
                                                            <View style={{ height: 8, width: 8, borderRadius: 10, backgroundColor: colors.white }} />
                                                            <Text style={[commonStyles.h12white600,ml5]}>{item.status}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index + ''}
                                />
                            </View>
                            {openModule && <PopupCardModal handleYesBtn={() => customerStatusChange()} text={`Do you want to change customer status to ${userStatus === 'Active' ? 'Inactive' : 'Active'}?`} visible={openModule} onClose={() => setOpenModule(false)} />}
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
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setCustomersFilter(false)} title='Filter' />
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
                            visible={customersFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default CustomersScreen;

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
