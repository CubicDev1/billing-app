import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
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
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mh10, mh15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import moment from 'moment';
import { commonStyles, getMainContainerStyle, getTopNotchStyle } from '../../utils/commonStyles';

export type SalesReportProps = {

}

type FormData = {
    search_customer: string;
};

export interface SalesReportAndSalesReturnReport {
    _id: string;
    credit_note_id: string;
    credit_note_date: string;
    dueDate: string;
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
    customerId: CustomerInfo; // Include customerInfo type here
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


const SalesReport = (props: SalesReportProps) => {
    const [salesFilter, setSalesFilter] = useState(false);
    const [salesList, setSalesList] = useState<SalesReportAndSalesReturnReport[]>([]);
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
        setSalesFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getSalesList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setSalesFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getSalesList(1, []);
        }
    }, [focused]);

    useEffect(() => {
        const formattedData = salesList.map(expense => ({
            value: parseInt(expense.TotalAmount),
            label: formatDate(expense.dueDate)
        }));
        console.log('graph data', formattedData)
        setChartData(formattedData);
    }, [salesList]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setSalesFilter(false);
        setSearchText('');
        getSalesList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getSalesList(1, selectedCustomers);
        setSalesFilter(false);
        setSearchText('');
    }

    const getSalesList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.getAllInvoice}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setSalesList(success.data);
                    setTotal(success.totalRecords);
                    setSalesList(page == 1 ? success.data : [...salesList, ...success.data]);
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

    function LabelText(text: string) {
        switch (text.toLowerCase()) {
            case 'paid':
                return labels.paid;
            case 'overdue':
                return labels.overDue;
            case 'partially_paid':
                return labels.partiallypaid;
            case 'sent':
                return labels.sent;
            case 'drafted':
                return labels.draft;
            default:
                return labels.unpaid;
        }
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.sales + "Report"} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]}/>
                            <View style={{ marginBottom: 320 }}>
                                <ListSubHeader listName={labels.sales} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    ListHeaderComponent={
                                        <BarChart
                                            data={chartData}
                                            width={salesList.length > 0 ? undefined : 250}
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
                                    data={salesList}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, salesList.length);
                                        if (total > salesList.length) {
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
                                        }
                                        else if (report.status === 'OVERDUE') {
                                            backgroundColor = colors.yellow;
                                        }
                                        else if (report.status === 'PARTIALY_PAID') {
                                            backgroundColor = colors.blue;
                                        }
                                        else if (report.status === 'SENT') {
                                            backgroundColor = colors.redFour;
                                        }
                                        else if (report.status === 'DRAFTED') {
                                            backgroundColor = colors.blueFour;
                                        }
                                        else {
                                            backgroundColor = colors.yellow;
                                        }
                                        return (
                                            <View key={report._id}>
                                                 <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                                 <Text style ={[commonStyles.h15blackOne600]}>{report.customerId?.name}</Text>
                                                            </View>
                                                        </View>
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
                                                                <Text style={[commonStyles.h12white600,{ marginHorizontal: 4}]}>{LabelText(report.status)}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{report.TotalAmount}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.discountAmnt}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{report.totalDiscount}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.dueDate}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{formatDate(report.dueDate)}</Text>
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
                                <ModalTopText iconPress={() => setSalesFilter(false)} title='Filter' />
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
                            visible={salesFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default SalesReport;

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
