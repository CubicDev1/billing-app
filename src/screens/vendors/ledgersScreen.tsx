import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import DashedLine from '../../components/dashedLine';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignSelfCenter, flex1, flexRow, justifyBetween, mh10, mh15, mh5, mv15, mv5 } from '../../utils/theme/commonStyles';
import { TouchableOpacity } from 'react-native';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { currencySymbol } from '../../constant/constApi';
import { screenName } from '../../utils/screenNames';
import { commonStyles, getMainContainerStyle, getTopNotchStyle } from '../../utils/commonStyles';

type LedgerScreenProps = {
    route: any;
}

type Ledger = {
    _id: string;
    referenceId: any;
    name: string;
    date: string;
    reference: string;
    mode: string;
    amount: number;
    vendorId: string;
    created_at: string;
    isDeleted: boolean;
    id: string;
    closingBalance: number;
}


const LedgersScreen = ({ route }: LedgerScreenProps) => {
    const [ledgersList, setLedgersList] = useState<Ledger[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();



    useEffect(() => {
        if (page > 1) {
            getLedgersList(page);
        }
    }, [page]);


    useEffect(() => {
        if (focused) {
            setPage(1);
            getLedgersList(1);
        }
    }, [focused]);

    const getLedgersList = (page: number) => {
        var customerId = `&vendorId=${route.params.vendorId}`;
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.ledgerList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setLedgersList(success.data);
                    setTotal(success.totalRecords);
                    setLedgersList(page == 1 ? success.data.ledgers : [...ledgersList, ...success.data.ledgers]);
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


    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.ledgers} />
                            </View>
                            <View style={[commonStyles.bottomWidth, mv5]} />
                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} filterIcon={false} listName={labels.ledger} totalNumber={total} onAddPress={() => (navigation as any).navigate(screenName.AddLedger, { isAddedProductAvailable: false } as never)} />
                                <FlatList
                                    data={ledgersList}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, ledgersList.length);
                                        if (total > ledgersList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const data = item;
                                        return (
                                            <View key={data._id}>
                                                <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <View>
                                                            <Text style={[commonStyles.h12Primary400]}>{data.name}</Text>
                                                            <Text style={[commonStyles.h15blackOne600]}>{data.reference.split(' ')[0]}</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={[commonStyles.h12blackTwo600]}>{labels.createdOn}</Text>
                                                            <Text style={commonStyles.h14blackOne600}>{data.date}</Text>
                                                        </View>
                                                        <View style={{ backgroundColor: data.mode === 'Credit' ? colors.green : colors.danger, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 4, marginHorizontal: 5, height: 27 }}>
                                                            <View style={{ height: 6, width: 6, borderRadius: 6, backgroundColor: colors.white }} />
                                                            <Text style={[commonStyles.h12white600, mh5]} >{data.mode === 'Credit' ? 'Credit' : 'Debit'}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                        <DashedLine height={3500} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                    </View>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <Text style={[commonStyles.h14blackTwo500, alignSelfCenter]} >{labels.amount + ' : ' + currencySymbol + data.amount.toFixed(2)}</Text>
                                                        <View style={[commonStyles.smallCard]}>
                                                            <Text style={[commonStyles.h12RedTwo500]}></Text>
                                                            <Text style={[commonStyles.h12RedTwo500, mh10]} >{'Closing Bal : ' + currencySymbol + data.closingBalance.toFixed(2)}</Text>
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
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default LedgersScreen;

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
