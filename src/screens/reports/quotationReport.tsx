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
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type QuotationReportProps = {
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
    data: QuotationData[]
}

export interface QuotationData {
    _id: string
    quotation_id: string
    customerId: CustomerId
    quotation_date: string
    due_date: string
    reference_no: string
    items: Item[]
    discountType: string
    status: string
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
    signatureName?: string
    signatureImage?: string
    userId: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
    id: string
    signatureId?: SignatureId
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


const QuotationReport = (props: QuotationReportProps) => {
    const [quotationFilter, setQuotationFilter] = useState(false);
    const [quotationList, setQuotationList] = useState<QuotationData[]>([]);
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
        setQuotationFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getQuotationList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setQuotationFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getQuotationList(1, []);
        }
    }, [focused]);

    useEffect(() => {
        const formattedData = quotationList.map(expense => ({
            value: parseInt(expense.TotalAmount),
            label: formatDate(expense.createdAt)
        }));
        console.log('graph data', formattedData)
        setChartData(formattedData);
    }, [quotationList]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setQuotationFilter(false);
        setSearchText('');
        getQuotationList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getQuotationList(1, selectedCustomers);
        setQuotationFilter(false);
        setSearchText('');
    }

    const getQuotationList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.quotationList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setQuotationList(success.data);
                    setTotal(success.totalRecords);
                    setQuotationList(page == 1 ? success.data : [...quotationList, ...success.data]);
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
                                <TopHeader headerText={labels.quotationReport} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]}  />
                            <View style={{ marginBottom: 320 }}>
                                <ListSubHeader listName={labels.quotations} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    ListHeaderComponent={
                                        <BarChart
                                            data={chartData}
                                            width={quotationList.length > 0 ? undefined : 250}
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
                                    data={quotationList}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, quotationList.length);
                                        if (total > quotationList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const report = item;
                                        return (
                                            <View key={report._id}>
                                                 <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                                <Text style = {[commonStyles.h12Primary400]}>{report.quotation_id}</Text>
                                                                 <Text style ={[commonStyles.h15blackOne600]}>{report.customerId?.name}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.phoneNumber}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{report.customerId?.phone}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.createdOn}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{formatDate(report.createdAt)}</Text>
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
                                <ModalTopText iconPress={() => setQuotationFilter(false)} title='Filter' />
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
                            visible={quotationFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default QuotationReport;

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
