import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useState, useEffect, Fragment, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInputField, CustomerSearchExpanded, ExpandableSection, ExpandedByStatusComponent, InvoiceCard, ListSubHeader, TabBar, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import { allInvoicesdata, draftInvoicesdata, invoiceCardData, overdueInvoicesdata, paidInvoicesdata, partiallyPaidInvoicesdata, sentInvoicesdata, unpaidInvoicesdata } from '../../utils/data/invoiceData';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, flexRow, justifyBetween, justifyCenter, mh10, ml15, mt10, mt5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { InvoiceCardImg1, InvoiceCardImg2, InvoiceCardImg3, InvoiceCardImg4 } from '../../utils/svg';
import { currencySymbol } from '../../constant/constApi';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { CustomTextInput } from '../../components/commonInputFields';
import CustomIcon from '../../utils/icons';
import { commonStyles, getTopNotchStyle, getMainContainerStyle } from '../../utils/commonStyles';

interface TotalData {
    _id: string | null;
    total_sum: number;
    count: number;
}

interface ApiResponse {
    total_invoice: TotalData[];
    total_outstanding: TotalData[];
    total_overdue: TotalData[];
    total_cancelled: TotalData[];
    total_drafted: TotalData[];
    recurring_total: TotalData[];
}

const InvoiceScreen = () => {
    const navigation = useNavigation();

    const [selectedTab, setSelectedTab] = useState(labels.allInvoices);
    const [fliterScreenModal, setFilterScreenModal] = useState(Boolean);
    const data = ['FedEx', 'Google', 'BNC', 'Whirlpool', 'Palotte'];
    const CustomerList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.totalCustomer);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.totalCustomer));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const byStatusData = ['Paid', 'Overdue', 'Partially Paid', 'Draft', 'Sent']
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any[]>([]);
    const [invoiceList, setInvoiceList] = useState<any[]>([]);
    const focused = useIsFocused();

    const [invoiceCardData, setInvoiceCardData] = useState([
        {
            id: 1,
            Img: InvoiceCardImg1,
            color: colors.blueTwo,
            amount: 0,
            text: 'Total Invoice',
            count: 0,
        },
        {
            id: 2,
            Img: InvoiceCardImg2,
            color: colors.redTwo,
            amount: 0,
            text: 'Overdue',
            count: 0,
        },
        {
            id: 3,
            Img: InvoiceCardImg3,
            color: colors.blueThree,
            amount: 0,
            text: 'Draft',
            count: 0,
        },
        {
            id: 4,
            Img: InvoiceCardImg4,
            color: colors.yellowOne,
            amount: 0,
            text: 'Outstanding',
            count: 0,
        },
    ]);

    useEffect(() => {
        getMethod(
            ApiUrl.invoiceCard,
            (success: { data: any; code: number; message: any }) => {
                console.log('Invoice Card API Response:', success);

                if (success.code === 200) {
                    invoiceCardData.forEach((item, index) => {
                        if (item.text === 'Total Invoice') {
                            item.amount = success.data.total_invoice[0]?.total_sum ?? 0;
                            item.count = success.data.total_invoice[0]?.count ?? 0;
                        } else if (item.text === 'Overdue') {
                            item.amount = success.data.total_overdue[0]?.total_sum ?? 0;
                            item.count = success.data.total_overdue[0]?.count ?? 0;
                        } else if (item.text === 'Draft') {
                            item.amount = success.data.total_drafted[0]?.total_sum ?? 0;
                            item.count = success.data.total_drafted[0]?.count ?? 0;
                        } else if (item.text === 'Outstanding') {
                            item.amount = success.data.total_outstanding[0]?.total_sum ?? 0;
                            item.count = success.data.total_outstanding[0]?.count ?? 0;
                        }
                    })
                    setInvoiceCardData([...invoiceCardData]);
                } else {
                    console.error('Failed to fetch Invoice Card data. Response:', success);
                }
            },
            error => {
                console.error('Error in Invoice Card API call:', error);
            }
        );
    }, []);

    useEffect(() => {
        if (focused) {
            getInvoiceApi(1, selectedCustomers, selectedTab);
        }
    }, [focused]);

    useEffect(() => {
        if (page > 1) {
            getInvoiceApi(page, selectedCustomers, selectedTab);
        }
    }, [page]);
    const getInvoiceApi = async (page: number, selectedCustomers: Array<{ name: string, _id: string }>, statusLabel?: string) => {
        var searchText = "";
        if (statusLabel && statusLabel !== labels.allInvoices) {
            var status = statusLabel == labels.paid ? "paid" : statusLabel == labels.overDue ? "overdue" : statusLabel == labels.partiallypaid ? "partially_paid" : statusLabel == labels.draft ? "drafted" : statusLabel == labels.sent ? "sent" : "";
            searchText = `&status=${status.toUpperCase()}`
        }
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.getAllInvoice}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${searchText}${customerId}`,
            success => {
                doChangeSpinnerFlag(false);
                if (success.code === 200) {
                    console.log('Successfully get all invoice', success);
                    setTotal(success.totalRecords);
                    setInvoiceList(page == 1 ? success.data : [...invoiceList, ...success.data]);
                } else {
                    console.log('Failed  get all invoice', success);
                }
            },
            error => {
                doChangeSpinnerFlag(false);
                console.log('Erro get all invoice:', error);
            }
        );
    }


    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
        reset,
        setValue
    } = useForm();

    const tabs = [
        { label: labels.allInvoices },
        { label: labels.paid },
        { label: labels.overDue },
        { label: labels.partiallypaid },
        { label: labels.draft },
        { label: labels.sent },
    ];

    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
        setPage(1);
        getInvoiceApi(1, selectedCustomers, tab);
    };

    const handleAddPress = () => {
        navigation.navigate(screenName.AddInvoiceScreen, { isAddedProductAvailable: false } as never)
    }

    const invoiceTopCards = () => {
        return (
            <View style={[mt10, { height: 150, width: '100%', backgroundColor: colors.greyOne }, alignItemCenter, justifyCenter]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={[flexRow, alignItemCenter, justifyCenter]}>
                        {invoiceCardData.map(({ id, Img, amount, count, color, text }) => (
                            <View key={id} style={[{ height: 120, width: 150, backgroundColor: colors.white, borderRadius: 8, marginHorizontal: 5 }]}>
                                <View style={[mt10, ml15]}>
                                    <View style={[{ height: 25, width: 25, borderRadius: 20, backgroundColor: color }, alignItemCenter, justifyCenter]}>
                                        <Img height={14} width={14} />
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mt10]} >{currencySymbol}{amount}</Text>
                                    <Text style={[commonStyles.h12BlackOne600,{ color: color }, mt5]} >{text}</Text>
                                    <Text style={[commonStyles.h10blackTwo600,mt5]} >No of {text == "Total Invoice" ? "Invoice" : text} : {count}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    };

    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} />
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} />
            </View>
        )
    }

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = CustomerList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCustomers(filteredCustomersNew ?? []);
    };

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setFilterScreenModal(false);
        setSearchText('');
        getInvoiceApi(1, [], selectedTab);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getInvoiceApi(1, selectedCustomers, selectedTab);
        setFilterScreenModal(false);
        setSearchText('');
    }
    const FilterModal = () => {
        return (
            <View style={[justifyBetween, flex1]}>
                <ModalTopText iconPress={() => setFilterScreenModal(false)} title='Filter' />
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
                        backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                        color={isActiveBtn ? colors.white : colors.blackOne}
                    />
                    <OnboardingButton
                        width={150}
                        title={labels.apply}
                        onChange={handleApply}
                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                        color={isActiveBtn ? colors.blackOne : colors.white}
                    />
                </View>
            </View>
        )
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, mt10, mh10]}>
                        <TopHeader headerText={'Invoice'} />
                        {invoiceTopCards()}
                        <View style={[flex1, { marginBottom: 70 }]}>
                            <FlatList
                                ListHeaderComponent={
                                    <View>
                                        <View style={[mv15,]}>
                                            <TabBar tabs={tabs} activeTab={selectedTab} onTabPress={handleTabPress} borderRadius={50} marginRight={10} isScroll={true} />
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderColor: colors.greyTwo }}></View>
                                        <ListSubHeader addIcon listName={selectedTab} totalNumber={total} onAddPress={handleAddPress} onFilterPress={() => { setFilterScreenModal(true) }} />
                                    </View>}
                                data={invoiceList}
                                onEndReached={() => {
                                    console.log('onEndReached', page, total, invoiceList.length);
                                    if (total > invoiceList.length) {
                                        setPage(page + 1);
                                    }
                                }}
                                renderItem={({ item, index }) => (
                                    <InvoiceCard key={item.id} data={item} refresh={() => {
                                        setPage(1);
                                        getInvoiceApi(1, selectedCustomers, selectedTab);
                                    }} />
                                )}
                                keyExtractor={(item, index) => index + ''}
                            />
                        </View>
                    </View>
                </View>
                <BottomNavBar navigationPlusButton={() => navigation.navigate(screenName.AddInvoiceScreen, { isAddedProductAvailable: false } as never)} />
                <CustomModal children={<FilterModal />} visible={fliterScreenModal} onClose={() => setFilterScreenModal(false)} height={'80%'} />
            </SafeAreaView>
        </Fragment>
    );
}

const styles = StyleSheet.create({
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

export default InvoiceScreen;
