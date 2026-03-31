import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { purchaseReportData } from '../../utils/data/reportsData';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, flexRow, justifyBetween, mh10, mh15, mv15, mv5 } from '../../utils/theme/commonStyles';
import { StockReportFilter } from './reportsFilter';
import { commonStyles } from '../../utils/commonStyles';

export type StocksReportProps = {

}


const StockReport = (props: StocksReportProps) => {

    const [openReportFilterModal,setOpenReportFilterModal] = useState(false);
    const openFilterModal = () => {
        setOpenReportFilterModal(true);
    };
    const closeModal = () => {
        setOpenReportFilterModal(false);
    };
    const addSaveBtn =()=>{
        closeModal()
    }
    return (
        <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
            <View style={mh15}>
                <View style={mv15}>
                    <TopHeader headerText={labels.stockReport} searchIcon={true} searchName={'Search' + labels.inventory} searchText={labels.stocks} />
                </View>
                 <View style={[commonStyles.bottomWidth,mv5]}  />
                <ScrollView>
                    <View style={{ paddingBottom: '50%' }}>
                        <Text style={[commonStyles.h16BlackOne700]}>{labels.stocksbyLast30Days}</Text>
                        <ListSubHeader listName={labels.stocks} totalNumber={'21'} onFilterPress={openFilterModal} />
                        {purchaseReportData.map((data) => {
                            return (
                                <View key={data.id}>
                                     <TouchableOpacity style={[commonStyles.mainListCard]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ backgroundColor: colors.whiteOne, height: 48, width: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image source={data.productImg} resizeMode='contain' style={{ height: 30, width: 30 }} />
                                                </View>
                                                <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                   <Text style={[commonStyles.h10Primary600]}>{data.code}</Text>
                                                     <Text style ={[commonStyles.h15blackOne600]}>{data.productName}</Text>
                                                </View>
                                            </View>
                                            <View style={{ alignSelf: 'center' }}>
                                                <View style={[commonStyles.smallCard]} >
                                                   <Text style={[commonStyles.h12RedTwo500,mh10]}>{data.productType}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ marginVertical: 10, alignItems : 'center'  }}>
                                            <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                        </View>
                                        <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                            <View style={[flexRow, justifyBetween]}>
                                                <View>
                                                    <Text style={[commonStyles.h12blackTwo600]}>{labels.openingQty}</Text>
                                                   <Text style={commonStyles.h14blackOne600}>{data.OpeningOty}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[commonStyles.h12blackTwo600]}>{labels.qtyIn}</Text>
                                                   <Text style={commonStyles.h14blackOne600}>{data.qtyIn}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[commonStyles.h12blackTwo600]}>{labels.qtyOut}</Text>
                                                   <Text style={commonStyles.h14blackOne600}>{data.qtyOut}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[commonStyles.h12blackTwo600]}>{labels.closingQty}</Text>
                                                   <Text style={commonStyles.h14blackOne600}>{data.closingQty}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
            <BottomNavBar />
            <CustomModal children={<StockReportFilter onSave={addSaveBtn} onCancel={closeModal}   />} visible={openReportFilterModal} onClose={closeModal} height={'80%'} />

        </View>
    )
}

export default StockReport