import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { labels } from '../../utils/labels';
import { AdjustmentIcon } from '../../utils/svg';
import { colors } from '../../utils/theme/colors';
import { alignSelfCenter, flex1, flexRow, justifyBetween, mh15, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ProfitOrLossReportFilter } from './reportsFilter';
import { commonStyles } from '../../utils/commonStyles';

export type profitorLossProps = {

}

const ProfitorLoss = (props: profitorLossProps) => {
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
                    <TopHeader headerText={labels.profitorLoss} />
                </View>
                 <View style={[commonStyles.bottomWidth,mv5]}  />
                <ScrollView>
                    <View style={{ paddingBottom: '50%' }}>
                        <View style={[flexRow, justifyBetween]}>
                           <Text style={[commonStyles.h14blackOne600,alignSelfCenter]}>Info</Text>
                            <TouchableOpacity onPress={openFilterModal} style={{ height: 36, width: 36, borderRadius: 40, padding: 10, marginHorizontal: 10, borderWidth: 1, borderColor: colors.greyTwo }}>
                                <AdjustmentIcon width={16} height={16} />
                            </TouchableOpacity>
                        </View>
                         <TouchableOpacity style={[commonStyles.mainListCard]}>
                            <View style={[flexRow, justifyBetween]}>
                                <Text style={[commonStyles.h15blackOne500]}>{labels.income}</Text>
                                <Text style={[commonStyles.h15blackOne500]}>$12,000.00</Text>
                            </View>
                            <View style={{ marginVertical: 10 ,alignItems : 'center' }}>
                                <DashedLine height={350} color={colors.greyTwo} dashLength={5} dashGap={3} />
                            </View>
                            <View style={[flexRow, justifyBetween]}>
                                <Text style={[commonStyles.h14blackOne500]}>{labels.stripeSales}</Text>
                                <Text style={[commonStyles.h14blackOne500]}>$12,000.00</Text>
                            </View>
                        </TouchableOpacity>

                         <TouchableOpacity style={[commonStyles.mainListCard]}>
                            <View style={[flexRow, justifyBetween]}>
                                <Text style={[commonStyles.h15blackOne500]}>{labels.expense}</Text>
                                 <Text style ={[commonStyles.h15blackOne600]}>$2000.00</Text>
                            </View>
                            <View style={{ marginVertical: 10, alignItems : 'center'  }}>
                                <DashedLine height={350} color={colors.greyTwo} dashLength={5} dashGap={3} />
                            </View>
                            <View style={[flexRow, justifyBetween]}>
                                <Text style={[commonStyles.h14blackOne500]}>{labels.exchangeGainorLoss}</Text>
                                <Text style={[commonStyles.h14blackOne500]}>$0.00</Text>
                            </View>
                            <View style={[flexRow, justifyBetween, mv5]}>
                                <Text style={[commonStyles.h14blackOne500]}>{labels.stripeFees}</Text>
                                <Text style={[commonStyles.h14blackOne500]}>$10,000.00</Text>
                            </View>
                        </TouchableOpacity>
                         <TouchableOpacity style={[commonStyles.mainListCard,{
                            backgroundColor: colors.white4
                         }]} >
                            <View style={[flexRow,justifyBetween,mv5]}>
                                 <Text style ={[commonStyles.h15blackOne600]}>Net Income</Text>
                               <Text style={commonStyles.h14blackOne600}>$10,000.00</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <BottomNavBar />
            <CustomModal children={<ProfitOrLossReportFilter onSave={addSaveBtn} onCancel={closeModal}   />} visible={openReportFilterModal} onClose={closeModal} height={'80%'} />
        </View>
    )
}

export default ProfitorLoss