import { useIsFocused } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mh15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { currencySymbol } from '../../constant/constApi';
import { useSelector } from 'react-redux';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type expensesReportProps = {}

export interface Expenses {
    _id: string
    expenseId: string
    reference: string
    amount: string
    paymentMode: string
    expenseDate: string
    status: string
    attachment: any
    description: string
    isDeleted: boolean
    userId: string
    createdAt: string
    updatedAt: string
    __v: number
}

const ExpensesReport = (props: expensesReportProps) => {
    const [expenseFilter, setExpenseFilter] = useState(false);
    const [expensesList, setExpensesList] = useState<Expenses[]>([]);
    const [chartData, setChartData] = useState<{ value: number, label: string }[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<Array<string>>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)

    const openFilterModal = () => {
        setExpenseFilter(true);
    };

    useEffect(() => {
        if (page > 1) {
            getExpensesList(page, selectedStatus.join(','));
        }
    }, [page]);

    const closeModal = () => {
        setExpenseFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedStatus([]);
            getExpensesList(1);
        }
    }, [focused]);

    useEffect(() => {
        const formattedData = expensesList.map(expense => ({
            value: parseInt(expense.amount),
            label: expense.createdAt
        }));
        console.log('graph data', formattedData)
        setChartData(formattedData);
    }, [expensesList]);

    const handleReset = () => {
        setPage(1);
        setSelectedStatus([]);
        getExpensesList(1);
        setExpenseFilter(false);
    };

    const handleApply = () => {
        setPage(1);
        getExpensesList(1, selectedStatus.join(','));
        setExpenseFilter(false);
    };

    const getExpensesList = (page: number, status?: string) => {
        var searchText = "";
        if (status) {
            searchText = `&status=${status}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.expensesList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${searchText}`,
            success => {
                if (success.code === 200) {
                    setExpensesList(success.data);
                    setTotal(success.totalRecords);
                    setExpensesList(page == 1 ? success.data : [...expensesList, ...success.data]);
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
    const handleStatusSelection = (status: string) => {
        setSelectedStatus(selectedStatus.includes(status) ? selectedStatus.filter(item => item !== status) : [...selectedStatus, status]);
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.expenseReport} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]}  />
                            <View style={{ marginBottom: 320 }}>
                                <ListSubHeader listName={labels.expenses} totalNumber={total} onFilterPress={openFilterModal} />
                                <FlatList
                                    ListHeaderComponent={
                                        <BarChart
                                            data={chartData}
                                            width={expensesList.length > 0 ? undefined : 250}
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
                                    data={expensesList}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, expensesList.length);
                                        if (total > expensesList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        let backgroundColor;
                                        const data = item;
                                        if (data.status === 'Paid') {
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
                                                {/* <TouchableNativeFeedback onPress={() => { }}> */}
                                                <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <Text style={[commonStyles.h16blackOne500,alignSelfCenter]} >{data.expenseId}</Text>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                            <View style={{ backgroundColor, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 4, marginHorizontal: 5 }}>
                                                                <View style={{ height: 6, width: 6, borderRadius: 6, backgroundColor: colors.white }} />
                                                                <Text style={[commonStyles.h12white600,{marginHorizontal:4}]} >{data.status}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                        <View style={[flexRow, justifyBetween]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.createdOn}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{data.createdAt}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{data.amount}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo600]}>{labels.modeOfPayment}</Text>
                                                               <Text style={commonStyles.h14blackOne600}>{data.paymentMode}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                {/* </TouchableNativeFeedback> */}
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
                                <ModalTopText iconPress={() => setExpenseFilter(false)} title='Filter' />
                               <Text style={[commonStyles.h14blackOne600,mv10]} >{"By Staus"}</Text>
                                <View style={[flex1, { marginBottom: 30, marginTop: 20 }]}>
                                    <FlatList
                                        data={['Paid', 'Pending', 'Cancelled']}
                                        renderItem={({ item }) => (
                                            <View style={[flexRow, alignItemCenter, mv5]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleStatusSelection(item);
                                                    }}
                                                    style={[
                                                        styles.multiSelectBox,
                                                        {
                                                            marginHorizontal: 5,
                                                            backgroundColor: selectedStatus.includes(item) ? colors.primary : colors.white,
                                                            borderWidth: selectedStatus.includes(item) ? 0 : 1,
                                                            borderColor: selectedStatus.includes(item) ? colors.primary : colors.grey,
                                                        },
                                                    ]}
                                                >
                                                    {selectedStatus.includes(item) && (
                                                        <CustomIcon name="check" size={15} color="white" type="MaterialIcons" />
                                                    )}
                                                </TouchableOpacity>
                                               <Text style={commonStyles.h14blackOne600}>{item}</Text>
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
                            visible={expenseFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default ExpensesReport;

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    multiSelectBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
