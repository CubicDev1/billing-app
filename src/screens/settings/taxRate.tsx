import { useFocusEffect } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BottomNavBar from '../../components/bottomNavBar';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mh15, mh5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { AddTaxRates } from './settingsComponent';
import { useDispatch } from 'react-redux';
import PopupCardModal from '../../components/popupCardModal';
import { useToast } from 'react-native-toast-notifications';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type TaxRateProps = {

}

export interface TaxList {
    __v: number
    _id: string
    createdAt: string
    id: string
    isDeleted: boolean
    name: string
    status: boolean
    taxRate: string
    text: string
    type: string
    updatedAt: string
    userId: string
}

const TaxRate = (props: TaxRateProps) => {
    const [addBankDetailsModal, setAddBankDetailsModal] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [taxList, setTaxList] = useState<TaxList[]>([]);
    const [selectedTaxItem, setSelectedTaxItem] = useState<TaxList | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const toast = useToast();

    const dispatch = useDispatch();
    const openModal = () => {
        setAddBankDetailsModal(true)
        setSelectedTaxItem(null);
    };

    const closeModal = async () => {
        const updatedTaxListList = await getBankList();
        console.log('updatedTaxListList', updatedTaxListList);
        dispatch({ type: "TAX_LIST", payload: updatedTaxListList });
        setAddBankDetailsModal(false)
    };

    const addSaveBtn = () => {
        closeModal()
    }
    useEffect(() => {
        setLoading(true);
        getBankList();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getBankList
        }, [])
    );

    const getBankList = () => {
        getMethod(
            ApiUrl.taxList,
            success => {
                if (success.code === 200) {
                    setTaxList(success.data);
                    setLoading(false);
                    console.log('Successfully got tax list', success.data);
                    return success.data;
                } else {
                    console.log('Failed from tax list', success.message);
                    setLoading(false);
                }
            },
            error => {
                console.log('Error fetching bank list:', error);
                setLoading(false);
            }
        );
    };

    const deleteTaxRate = (_id: string) => {
        postMethod(
            ApiUrl.deleteTax,
            { _id },
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    const updatedTaxListList = taxList.filter(taxRate => taxRate._id !== _id);
                    setTaxList(updatedTaxListList);
                    toast.show("Successfully deleted tax rate", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                } else {
                    toast.show("Failed deleted tax rate", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                console.log('Error deleting  tax rate:', error);
            }
        );
    };

    const handleDeletePress = (customerId: string) => {
        setCustomerToDelete(customerId);
        setOpenDeleteModal(true); // Open the delete confirmation modal
    };

    const confirmDeleteCustomer = () => {
        if (customerToDelete) {
            deleteTaxRate(customerToDelete); // Call the delete logic
            setCustomerToDelete(null); // Reset the state
        }
        setOpenDeleteModal(false); // Close the modal
    };

    const cancelDeleteCustomer = () => {
        setCustomerToDelete(null); // Reset the state
        setOpenDeleteModal(false); // Close the modal
    };
    const editTax = (taxItem: TaxList) => {
        setSelectedTaxItem(taxItem);
        setAddBankDetailsModal(true)
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            {openDeleteModal && (
                                <PopupCardModal
                                    handleYesBtn={confirmDeleteCustomer}
                                    handleNobtn={cancelDeleteCustomer}
                                    text="Are you sure you want to delete this Tax?"
                                    visible={openDeleteModal}
                                    onClose={cancelDeleteCustomer}
                                />
                            )}
                            <View style={mv15}>
                                <TopHeader headerText={labels.taxRates} />
                            </View>
                            <View style={[commonStyles.bottomWidth, mv5]} />
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ paddingBottom: '50%' }}>
                                    <ListSubHeader listName={labels.taxRates} totalNumber={taxList.length.toString()} onAddPress={openModal} addIcon={true} filterIcon={false} />
                                    {loading ? (
                                        <LoadingIndicator />
                                    ) : (
                                        taxList.length === 0 ? (
                                            <Text style={{ color: 'red' }}> No data</Text>
                                        ) : (
                                            <View>
                                                {taxList.map((data) => {
                                                    let backgroundColor;
                                                    if (data.status === true) {
                                                        backgroundColor = colors.green;
                                                    } else if (data.status === false) {
                                                        backgroundColor = colors.redFour;
                                                    } else {
                                                        backgroundColor = colors.white;
                                                    }
                                                    return (
                                                        <View key={data.id}>
                                                            <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                                <View style={[flexRow, justifyBetween]}>
                                                                    <Text style={[commonStyles.h15blackOne600, alignSelfCenter]} >{data.name}</Text>
                                                                    <View style={[flexRow]}>
                                                                        {/* <TouchableOpacity style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                                <CustomIcon name={'eye'} size={15} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity> */}
                                                                        <TouchableOpacity style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}
                                                                            onPress={() => editTax(data)}>
                                                                            <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity onPress={() => handleDeletePress(data._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                                <View style={[alignItemCenter, mv10]}>
                                                                    <DashedLine height={350} color={colors.greyTwo} dashLength={5} dashGap={5} />
                                                                </View>
                                                                <View style={[justifyBetween, flexRow]}>
                                                                    <Text style={[commonStyles.h14BlackTwo400]}>{labels.taxRate}
                                                                        <Text style={[commonStyles.h14blackOne500]}>{data.taxRate + '%'}</Text>
                                                                    </Text>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <View style={{ backgroundColor, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 4 }}>
                                                                            <View style={{ height: 6, width: 6, borderRadius: 6, backgroundColor: colors.white, }} />
                                                                            {data.status === true ? (
                                                                                <Text style={[commonStyles.h12white600, mh5]} >Active</Text>
                                                                            ) : (
                                                                                <Text style={[commonStyles.h12white600, mh5]}>Inactive</Text>
                                                                            )}
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        )
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                        <BottomNavBar />
                        <CustomModal children={<AddTaxRates onSave={addSaveBtn} onCancel={closeModal} preFilledData={selectedTaxItem} />} visible={addBankDetailsModal} onClose={closeModal} height={'80%'} />
                        {/* <CustomModal children={<AddTaxRates onSave={addSaveBtn} onCancel={closeModal} />} visible={addBankDetailsModal} onClose={closeModal} height={'80%'} /> */}
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

export default TaxRate