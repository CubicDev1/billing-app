import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { paymentReportData } from '../../utils/data/reportsData';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignSelfCenter, flex1, flexRow, justifyBetween, mh15, mh5, mv15, mv5 } from '../../utils/theme/commonStyles';
import { IncomeReportFilter } from './reportsFilter';
import { commonStyles } from '../../utils/commonStyles';

export type IncomeReportProps = {
    
    }


const IncomeReport = (props: IncomeReportProps) => {

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
                    <TopHeader headerText={labels.incomeReport} searchIcon={true} searchName={'Search' + labels.inventory} searchText={labels.incomeReport} />
                </View>
                 <View style={[commonStyles.bottomWidth,mv5]}  />
                <ScrollView>
                    <View style={{ paddingBottom: '50%' }}>
                        <Text style={[commonStyles.h16BlackOne700]}>{labels.incomebyLast30Days}</Text>
                        <ListSubHeader listName={labels.income} totalNumber={'21'} onFilterPress={openFilterModal} />
                        {paymentReportData.map((data) => {
                            return (
                                <View key={data.id}>
                                     <TouchableOpacity style={[commonStyles.mainListCard]} >
                                        <View style={[flexRow, justifyBetween]}>
                                            <View style={[flexRow]}>
                                                <View style={styles.imageContainer}>
                                                    <Image source={data.image} style={styles.image} />
                                                </View>
                                                <View style={[alignSelfCenter, mh5]}>
                                                     <Text style ={[commonStyles.h15blackOne600]}>{data.name}</Text>
                                                    <Text style={[commonStyles.h12blackTwo600]}>{data.email}</Text>
                                                </View>
                                            </View>
                                            <View style={{justifyContent:'center',alignItems:'center' }}>
                                                {/*  <Text style={[commonStyles.h12blackTwo400]}>{labels.incomeAmount}</Text> */}
                                               <Text style={commonStyles.h14blackOne600}>{data.incomeAmount}</Text>
                                            </View>
                                        </View>
                                        <View style={{ marginVertical: 10 }}>
                                            <DashedLine height={310} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                        </View>
                                        <View style={[flexRow, justifyBetween]}>
                                            <View style={[flexRow]}>
                                                <Text style={[commonStyles.h14BlackTwo400,{ alignSelf: 'center' }]} >{labels.date + ' : '}</Text>
                                                <Text style={[commonStyles.h14BlackTwo400,{ alignSelf: 'center' }]}>{data.date}</Text>
                                            </View>
                                            <View style={[flexRow]}>
                                                <Text style={[commonStyles.h14BlackTwo400,{ alignSelf: 'center' }]}>{labels.modeOfPayment + ' : '}</Text>
                                                <Text style={[commonStyles.h14BlackTwo400,{ alignSelf: 'center' }]}>{data.modeOfPayement}</Text>
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
            <CustomModal children={<IncomeReportFilter onSave={addSaveBtn} onCancel={closeModal}   />} visible={openReportFilterModal} onClose={closeModal} height={'80%'} />

        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        borderWidth: 1,
        height: 50,
        width: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.greyTwo
    },
    image: {
        resizeMode: 'contain',
        height: 40,
        width: 40,
    },
});

export default IncomeReport