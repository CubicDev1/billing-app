import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { CustomerSearchExpanded, ExpandableSection, ExpandedByStatusComponent, ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import PopupCardModal from '../../components/popupCardModal';
import { creditNotesdata } from '../../utils/data/creditNotesData';
import { actionData } from '../../utils/data/invoiceData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, flexRow, justifyBetween, justifyCenter, justifyEvenly, justifyStart, mh10, ml10, ml5, mr10, mt10, mt15, mt5, mv10 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { commonStyles } from '../../utils/commonStyles';

export type creditNotesProps = {

}


const CreditNotesScreen = (props: creditNotesProps) => {
    const navigation = useNavigation();
    const [actionModal, setActionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [fliterScreenModal, setFilterScreenModal] = useState(Boolean);
    const data = ['FedEx', 'Google', 'BNC', 'Whirlpool', 'Palotte'];
    const byStatusData = ['Paid', 'Pending', 'Cancelled']

    const openActionModal = () => {
        setActionModal(true);
    }

    const onAdjustPress = () => {
        setFilterScreenModal(true);
    }

    const onCloseAdjustPress = () => {
        setFilterScreenModal(false);
    }

    const handlePrevBtnClick = () => {
        setIsActiveBtn(true);
    };

    const handleNextBtnClick = () => {
        setIsActiveBtn(false);
    };

    const handleActionClick = (id: number) => {
        if (id == 1) {
            navigation.navigate(screenName.SendPaymentLink as never)
        } else if (id == 2) {
            navigation.navigate(screenName.InvoiceDetailsScreen as never)
        } else if (id == 8) {
            setActionModal(false);
            setShowDeleteModal(true);
        }
    }

    const ActionModal = () => {
        return (
            <View style={[]}>
                <ModalTopText title='Actions' iconPress={() => { }} />
                <View>
                    {
                        actionData.map((item) => {
                            return (
                                <TouchableOpacity onPress={() => handleActionClick(item.id)} key={item.id} style={[flexRow, justifyStart, alignItemCenter, mv10]}>
                                    <View style={[{ height: 36, width: 36, borderRadius: 25, backgroundColor: colors.white4 }, justifyCenter, alignItemCenter]}>
                                        <CustomIcon color={colors.blackTwo} name={item.iconName} size={item.iconSize} type={item.iconType} />
                                    </View>
                                    <Text style={[commonStyles.h14blackTwo500,ml10]} >{item.text}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    const FilterModal = () => {
        return (
            <View style={[justifyBetween, flex1]}>
                <View>
                    <ModalTopText iconPress={onCloseAdjustPress} title='Filter' />
                    <ExpandableSection
                        text="Customer"
                        renderingComponent={<CustomerSearchExpanded isCheckBoxNeeded={true} placeholder="Search Customer" data={data} />}
                    />
                    <ExpandableSection
                        text="Invoice Number"
                        renderingComponent={<CustomerSearchExpanded isCheckBoxNeeded={true} placeholder="Search Invoice Number" data={data} />}
                    />
                    <ExpandableSection
                        text="By Status"
                        renderingComponent={<ExpandedByStatusComponent data={byStatusData} />}
                    />
                </View>
                <View style={[flexRow, justifyBetween, alignItemCenter]}>
                    <OnboardingButton
                        width={150}
                        title={labels.reset}
                        onChange={handlePrevBtnClick}
                        backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                        color={isActiveBtn ? colors.white : colors.blackOne}
                    />
                    <OnboardingButton
                        width={150}
                        title={labels.apply}
                        onChange={handleNextBtnClick}
                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                        color={isActiveBtn ? colors.blackOne : colors.white}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={[flex1, { backgroundColor: colors.white }]}>
            <View style={[flex1, mt10, mh10]}>
                <TopHeader headerText={labels.creditNotes} searchIcon={true} searchName={labels.searchCreditNotes} searchText={labels.searchCreditNotes} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingBottom: 70 }}>
                        <View style={[{ borderBottomWidth: 0.5, borderColor: colors.greyTwo }, mt15]} />
                        <ListSubHeader addIcon={true} listName={'Total Credit Notes'} totalNumber={21} onAddPress={() => navigation.navigate(screenName.AddCreditNotesScreen, { isAddedProductAvailable: false } as never)} onFilterPress={onAdjustPress} />
                        <View>
                            {
                                creditNotesdata.map((data) => {
                                    return (
                                        <View key={data.id} style={{ height: 120, width: '100%', marginTop: 15, alignSelf: 'center', backgroundColor: colors.white, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginVertical: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image source={data.img} style={{ height: 45, width: 45, borderRadius: 8 }} />
                                                    </View>
                                                    <View style={{ marginLeft: 10 }}>
                                                        <Text style={[commonStyles.h12blackTwo400]}>{'Vendor'}</Text>
                                                        <Text style={[commonStyles.h16blackOne500,mt5]}>{data.companyName}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={[{ height: 25, backgroundColor: data.color, borderRadius: 5 }, alignItemCenter, justifyCenter, flexRow, justifyEvenly]}>
                                                        <View style={[ml10, { height: 5, width: 5, borderRadius: 20, backgroundColor: colors.white }]} />
                                                        <Text style={[commonStyles.h12white600,ml5,mr10]} >{data.status}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={openActionModal} style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter, ml10]}>
                                                        <CustomIcon name='dots-vertical' size={15} color={colors.blackTwo} type='MaterialCommunityIcons' />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 10, padding: 5, height: 40, width: '95%', backgroundColor: colors.greyOne, borderRadius: 8 }}>
                                                <View>
                                                    <Text style={[commonStyles.h12blackTwo600]}>Credit Notes ID</Text>
                                                    <Text style = {[commonStyles.h12Primary400]}>{data.creditId}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[commonStyles.h12blackTwo600]}>Amount</Text>
                                                   <Text style={commonStyles.h14blackOne600}>{data.amount}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[commonStyles.h12blackTwo600]}>Mode of Payment</Text>
                                                   <Text style={commonStyles.h14blackOne600}>{data.modeOfPayment}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomNavBar navigationPlusButton={() => navigation.navigate(screenName.AddCreditNotesScreen, { isAddedProductAvailable: false } as never)} />
            <CustomModal children={<ActionModal />} visible={actionModal} onClose={() => setActionModal(false)} height={'65%'} />
            <CustomModal children={<FilterModal />} visible={fliterScreenModal} onClose={onCloseAdjustPress} height={'80%'} />
            {showDeleteModal && <PopupCardModal handleYesBtn={() => { }} text='Do you want to Delete Invoice' visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} />}
        </View>
    )
}

export default CreditNotesScreen