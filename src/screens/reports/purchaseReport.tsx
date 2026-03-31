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
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mh10, mh15, mh5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { SettingsComponentsProps } from '../expenses/expenseFilter';
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
    taxInfo: string; // Serialized JSON string of TaxInfo
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

const PurchaseReport = () => {
    const [purchaseFilter, setPurchaseFilter] = useState(false);
    const [purchasesList, setPurchasesList] = useState<Data[]>([]);
    const [chartData, setChartData] = useState<{ value: number, label: string }[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ vendor_name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.vendor);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ vendor_name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.vendor));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ vendor_name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)

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

    useEffect(() => {
        const formattedData = purchasesList.map(expense => ({
            value: parseInt(expense.TotalAmount),
            label: formatDate(expense.purchaseDate)
        }));
        console.log('graph data', formattedData)
        setChartData(formattedData);
    }, [purchasesList]);

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
            `${ApiUrl.purchases}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
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

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.purchaseReport} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]} />
                            <View style={{ marginBottom: 320 }}>
                                <ListSubHeader listName={labels.purchases} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    ListHeaderComponent={
                                        <BarChart
                                            data={chartData}
                                            width={purchasesList.length > 0 ? undefined : 250}
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
                                        let backgroundColor;
                                        if (data.status === 'PAID') {
                                            backgroundColor = colors.green;
                                        } else if (data.status === 'Pending') {
                                            backgroundColor = colors.blue;
                                        } else if (data.status === 'Cancelled') {
                                            backgroundColor = colors.danger;
                                        } else {
                                            backgroundColor = colors.white;
                                        }
                                        return (
                                            <View key={data._id}>
                                                 <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <View style={[flexRow]}>
                                                            <View style={[alignSelfCenter, mh10]}>
                                                                <Text style = {[commonStyles.h12Primary400]}>{data.purchaseId}</Text>
                                                                <Text style={[commonStyles.h16blackOne500]}>{data.vendorId.vendor_name}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
                                                                <Text style={[commonStyles.h12white600,mh5]} >{data.status}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.date}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{formatDate(data.purchaseDate)}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{data.TotalAmount}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.modeOfPayment}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{data.paymentMode}</Text>
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
                               <Text style={[commonStyles.h14blackOne600,mv10]}>{"Vendor"}</Text>
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
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default PurchaseReport;

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
