import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { getMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, flexRow, justifyBetween, justifyCenter, mb10, mh15, ml10, ml5, mr10, mt5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import moment from 'moment';
import { fallbackImage } from '../../utils/png';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type deliveryChallansProps = {

}

type FormData = {
    search_customer: string;
};
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
    deliveryChallanNumber: string
    customerId: CustomerId
    deliveryChallanDate: string
    dueDate: string
    referenceNo: string
    deliveryAddress: DeliveryAddress
    items: Item[]
    discountType: string
    discount: string
    tax: string
    taxableAmount: string
    totalDiscount: string
    vat: string
    roundOff: boolean
    TotalAmount: string
    bank: string
    notes: string
    termsAndCondition: string
    sign_type: string
    signatureId: SignatureId
    signatureImage: any
    isDeleted: boolean
    userId: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface CustomerId {
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

export interface DeliveryAddress {
    name: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    pincode: string
    country: string
}

export interface Item {
    productId: string
    quantity: string
    unit: string
    rate: string
    discount: string
    tax: string
    amount: string
    name: string
    discountValue: string
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


const DeliveryChallansScreen = (props: deliveryChallansProps) => {
    const [deliveryChallanFilter, setDeliverychallanFilter] = useState(false);
    const [delivaryChallanList, setDelivaryChallanList] = useState<Daum[]>([]);
    const [chartData, setChartData] = useState<{ value: number, label: string }[]>([]);
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

    const openFilterModal = () => {
        setDeliverychallanFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getDeliveryChallanList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setDeliverychallanFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getDeliveryChallanList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setDeliverychallanFilter(false);
        setSearchText('');
        getDeliveryChallanList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getDeliveryChallanList(1, selectedCustomers);
        setDeliverychallanFilter(false);
        setSearchText('');
    }

    const getDeliveryChallanList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.listOfDeliveryChallan}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setDelivaryChallanList(success.data);
                    setTotal(success.totalRecords);
                    setDelivaryChallanList(page == 1 ? success.data : [...delivaryChallanList, ...success.data]);
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

    const openActiveModule = (_id: string,) => {
        setActiveId(_id);
        setOpenModule(true);
    }

    const cloneDeliveryChallan = (deliverychallan: any) => {
        const cloneUrl = `${ApiUrl.deliveryChallanClone}/${deliverychallan._id}/clone`;
        postMethod(
            cloneUrl,
            {},
            (success: { code: number; message: any; data: any }) => {
                if (success.code === 200) {
                    getDeliveryChallanList(page, selectedCustomers);
                    setPage(1);
                    toast.show("Successfully cloned delivery challan", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Successfully cloned delivery challan',);
                } else {
                    toast.show("Failed to clone delivery challan'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Failed to clone delivery challan:', success.message);
                }
            },
            error => {
                console.log('Error cloning deliveryChallan:', error);
                toast.show("Failed to clone delivery challan", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
        );
    };

    const deleteDeliveryChallan = (_id: string) => {
        postMethod(
            ApiUrl.deleteDeliveryChallan,
            { _id },
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    getDeliveryChallanList(page, selectedCustomers);
                    setPage(1);
                    setOpenModule(false);
                    toast.show("Deleted delivery challan successfully'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                } else {
                    toast.show("Failed to delete delivery challan", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                console.log('Error deleting purchase:', error);
                toast.show("Failed to delte delivery challan", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
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
                                <TopHeader headerText={labels.deliveryChallans} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]} />
                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} listName={labels.deliveryChallans} totalNumber={total} onAddPress={() => (navigation as any).navigate(screenName.AddDeliveryScreen, { isAddedProductAvailable: false } as never)} onFilterPress={openFilterModal} />
                                <FlatList
                                    data={delivaryChallanList}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, delivaryChallanList.length);
                                        if (total > delivaryChallanList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const imageUri = item?.customerId?.image || fallbackImage;
                                        return (
                                            <TouchableOpacity onPress={() => (navigation as any).navigate(screenName.DeliveryChallanDetails, { deliveryChallanData: item } as never)} key={item._id}
                                                style={{
                                                    height: 130, width: '98%', marginTop: 15, alignSelf: 'center', backgroundColor: colors.white, borderRadius: 8,
                                                    shadowColor: '#000', shadowOffset: { width: 0, height: 1.5 }, shadowOpacity: 0.45, shadowRadius: 2.40, elevation: 1.5
                                                }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginVertical: 10 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        {item?.customerId?.image ? (
                                                            <Image
                                                                source={{ uri: item.customerId.image }}
                                                                style={{ width: 50, height: 50, borderRadius: 10 }}
                                                            />
                                                        ) : (
                                                            <Image
                                                                source={{ uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=' }} // Placeholder image
                                                                style={{ width: 50, height: 50, borderRadius: 10 }}
                                                            />
                                                        )}
                                                        <View style={{ marginLeft: 10 }}>
                                                            <Text style={[commonStyles.h16BlackOne700]}>{item?.customerId?.name}</Text>
                                                            <Text style={[commonStyles.h12blackTwo400,mt5]}>Phone : {item?.customerId?.phone}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                                        <TouchableOpacity onPress={() => (navigation as any).navigate(screenName.AddDeliveryScreen, { isAddedProductAvailable: false, deliveryChallanDetails: item } as any)} style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter]}>
                                                            <CustomIcon name={'edit'} size={15} color={colors.blackTwo} type={'Feather'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => openActiveModule(item._id)} style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter, ml5]}>
                                                            <CustomIcon name={'delete-forever-outline'} size={17} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => cloneDeliveryChallan(item)} style={[{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }, ml5]}>
                                                            <CustomIcon name={'copy'} size={15} color={colors.blackTwo} type={'Feather'} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View style={[alignItemCenter, mb10]}>
                                                    <DashedLine height={330} color={colors.greyTwo} dashLength={5} dashGap={5} />
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, padding: 5, height: 40, width: '95%', backgroundColor: colors.greyOne, borderRadius: 8 }}>
                                                    <View style={ml10}>
                                                        <Text style={[commonStyles.h12blackTwo600]}>Challan ID</Text>
                                                       <Text style={commonStyles.h14blackOne600}>{item.deliveryChallanNumber}</Text>
                                                    </View>
                                                    <View style={mr10}>
                                                        <Text style={[commonStyles.h12blackTwo600]}>Created On</Text>
                                                       <Text style={commonStyles.h14blackOne600}>{formatDate(item.createdAt)}</Text>
                                                    </View>
                                                    <View style={mr10}>
                                                        <Text style={[commonStyles.h12blackTwo600]}>Amount</Text>
                                                       <Text style={commonStyles.h14blackOne600}>{currencySymbol}{item.TotalAmount}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index + ''}
                                />
                            </View>
                            {openModule && <PopupCardModal handleYesBtn={() => deleteDeliveryChallan(activeId)} text={`Do you want to delete Delivery Challan?`} visible={openModule} onClose={() => setOpenModule(false)} />}
                        </View>
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setDeliverychallanFilter(false)} title='Filter' />
                               <Text style={[commonStyles.h14blackOne600,mv10]} >{"Customer"}</Text>
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
                            visible={deliveryChallanFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default DeliveryChallansScreen;

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
