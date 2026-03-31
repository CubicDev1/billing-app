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

export type purchaseReturnProps = {

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
    debit_note_id: string
    vendorId: VendorId
    purchaseOrderDate: string
    dueDate: string
    referenceNo: string
    items: Item[]
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
}

export interface VendorId {
    _id: string
    vendor_name: string
    vendor_email: string
    vendor_phone: string
    balance: number
    balanceType: string
    user_id: string
    status: boolean
    created_at: string
    isDeleted: boolean
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

export type SettingsComponentsProps = {
    onSave: (filteredPurchaseReturn: Data[]) => void;
    onCancel: () => void;
};

type FormData = {
    search_vendor: string;
};

const PurchaseReturnReport = (props: purchaseReturnProps) => {
    const [purchaseFilter, setPurchaseFilter] = useState(false);
    const [purchaseReturnList, setPurchaseReturnList] = useState<Data[]>([]);
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
            getPurchaseReturnList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setPurchaseFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getPurchaseReturnList(1, []);
        }
    }, [focused]);

    useEffect(() => {
        const formattedData = purchaseReturnList.map(expense => ({
            value: parseInt(expense.TotalAmount),
            label: formatDate(expense.dueDate)
        }));
        console.log('graph data', formattedData)
        setChartData(formattedData);
    }, [purchaseReturnList]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setPurchaseFilter(false);
        setSearchText('');
        getPurchaseReturnList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getPurchaseReturnList(1, selectedCustomers);
        setPurchaseFilter(false);
        setSearchText('');
    }

    const getPurchaseReturnList = (page: number, selectedCustomers: Array<{ vendor_name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&vendor=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.purchaseReturn}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setPurchaseReturnList(success.data);
                    setTotal(success.totalRecords);
                    setPurchaseReturnList(page == 1 ? success.data : [...purchaseReturnList, ...success.data]);
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
                                <TopHeader headerText={labels.purchaseReturnReport} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]} />
                            <View style={{ marginBottom: 320 }}>
                                <ListSubHeader listName={labels.purchaseReturn} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    ListHeaderComponent={
                                        <BarChart
                                            data={chartData}
                                            width={purchaseReturnList.length > 0 ? undefined : 250}
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
                                    data={purchaseReturnList}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, purchaseReturnList.length);
                                        if (total > purchaseReturnList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const data = item;
                                        return (
                                            <View key={data._id}>
                                                 <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <View style={[flexRow]}>
                                                            <View style={[alignSelfCenter, mh10]}>
                                                                <Text style = {[commonStyles.h12Primary400]}>{data.debit_note_id}</Text>
                                                                <Text style={[commonStyles.h16blackOne500]}>{data.vendorId.vendor_name}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.dueDate}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{formatDate(data.dueDate)}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{data.TotalAmount}</Text>
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
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default PurchaseReturnReport;

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
