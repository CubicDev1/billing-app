import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { purchaseReportData } from '../../utils/data/reportsData';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignSelfCenter, flex1, flexRow, justifyBetween, mh10, mh15, mv15, mv5 } from '../../utils/theme/commonStyles';
import { StockReportFilter } from './reportsFilter';
import { commonStyles } from '../../utils/commonStyles';

export type PurchaseReportProps = {

}


const LowStockReport = (props: PurchaseReportProps) => {
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
                    <TopHeader headerText={labels.lowStocksReport} searchIcon={true} searchName={'Search' + labels.inventory} searchText={labels.lowStocksReport} />
                </View>
                 <View style={[commonStyles.bottomWidth,mv5]}  />
                <ScrollView>
                    <View style={{ paddingBottom: '50%' }}>
                        <Text style={[commonStyles.h16BlackOne700]}>{labels.lowstocksbyLast30Days}</Text>
                        <ListSubHeader listName={labels.lowStocks} totalNumber={'21'} onFilterPress={openFilterModal}/>
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
                                        <View style={[flexRow, justifyBetween]}>
                                            <View style={[flexRow]}>
                                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{labels.openingQuantity  + ' : '}</Text>
                                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{data.openingQty}</Text>
                                            </View>
                                            <View style={[flexRow]}>
                                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{labels.closingQuantity + ' : '}</Text>
                                                <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{data.closingQty}</Text>
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

export default LowStockReport 