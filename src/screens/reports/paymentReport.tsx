import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ExpandableSection, ListSubHeader, MultiSelectOption, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod } from '../../services/apiService';
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
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type paymentsProps = {

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
    data: Payment[]
}

export interface Payment {
    _id: string
    invoiceId: string
    invoiceAmount: number
    received_on: string
    payment_method: string
    amount: any
    notes: string
    status: string
    userId: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
    customerDetail: CustomerDetail
    invoiceNumber: string
}

export interface CustomerDetail {
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


const PaymentReport = (props: paymentsProps) => {
    const [paymentFilter, setPaymentFilter] = useState(false);
    const [paymentList, setPaymentList] = useState<Payment[]>([]);
    const [chartData, setChartData] = useState<{ value: number, label: string }[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.totalCustomer);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.totalCustomer));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)

    const openFilterModal = () => {
        setPaymentFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getPaymentList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setPaymentFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getPaymentList(1, []);
        }
    }, [focused]);

    useEffect(() => {
        const formattedData = paymentList.map(expense => ({
            value: parseInt(expense.amount),
            label: formatDate(expense.createdAt)
        }));
        console.log('graph data', formattedData)
        setChartData(formattedData);
    }, [paymentList]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setPaymentFilter(false);
        setSearchText('');
        getPaymentList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getPaymentList(1, selectedCustomers);
        setPaymentFilter(false);
        setSearchText('');
    }

    const getPaymentList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.paymentList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setPaymentList(success.data);
                    setTotal(success.totalRecords);
                    setPaymentList(page == 1 ? success.data : [...paymentList, ...success.data]);
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

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.paymentReport} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]}  />
                            <View style={{ marginBottom: 310 }}>
                                <ListSubHeader listName={labels.payments} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    ListHeaderComponent={
                                        <BarChart
                                            data={chartData}
                                            width={paymentList.length > 0 ? undefined : 250}
                                            frontColor={colors.primary}
                                            barBorderTopLeftRadius={5}
                                            barBorderTopRightRadius={5}
                                            barWidth={25}
                                            yAxisIndicesColor={colors.grey}
                                            yAxisTextStyle={{ color: 'gray' }}
                                            height={250}
                                            xAxisColor={colors.greyEight}
                                            yAxisColor={colors.greyEight}
                                            spacing={30}
                                            yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
                                            xAxisLabelTextStyle={{ color: 'gray', fontSize: 8 }}
                                        />
                                    }
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
                                        const report = item;
                                        return (
                                            <View key={item._id} style={{ height: 130, marginTop: 15, alignSelf: 'center', backgroundColor: colors.white, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, marginHorizontal: 2, }}>
                                                <View style={[{ marginHorizontal: 10, marginVertical: 10 }, flexRow, justifyBetween, alignItemCenter]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ marginLeft: 10 }}>
                                                            <Text style={[commonStyles.h16BlackOne700]}>{item.customerDetail?.name}</Text>
                                                            <Text style={[commonStyles.h12blackTwo400]} >Phone : {item.customerDetail?.phone}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginLeft: 10 }}>
                                                        <Text style={[commonStyles.h16BlackOne700]}>{currencySymbol + item.amount}</Text>
                                                        <Text style={[commonStyles.h12blackTwo400]} >{formatDate(item?.createdAt)}</Text>
                                                    </View>
                                                </View>
                                                <View style={[alignItemCenter, mb10]}>
                                                    <DashedLine height={330} color={colors.greyTwo} dashLength={5} dashGap={5} />
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, padding: 5, height: 40, width: '95%', backgroundColor: colors.greyOne, borderRadius: 8 }}>
                                                    <View style={ml10}>
                                                        <Text style={[commonStyles.h12blackTwo600]}>Payment ID</Text>
                                                       <Text style={commonStyles.h14blackOne600}>{item._id}</Text>
                                                    </View>
                                                    <View style={mr10}>
                                                        <Text style={[commonStyles.h12blackTwo600]}>{labels.modeOfPayment}</Text>
                                                       <Text style={commonStyles.h14blackOne600}>{item.payment_method}</Text>
                                                    </View>
                                                </View>
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
                                <ModalTopText iconPress={() => setPaymentFilter(false)} title='Filter' />
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
                            visible={paymentFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default PaymentReport;

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
