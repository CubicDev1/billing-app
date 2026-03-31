import { useFocusEffect } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
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
import { flex1, flexRow, justifyBetween, mh15, mv15, mv5 } from '../../utils/theme/commonStyles';
import { AddBankDetails } from './settingsComponent';
import PopupCardModal from '../../components/popupCardModal';
import { useToast } from 'react-native-toast-notifications';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type BankDetailsProps = {
}

export interface BankDetails {
    IFSCCode: string
    __v: number
    _id: string
    accountNumber: string
    bankName: string
    branch: string
    createdAt: string
    id: string
    isDeleted: boolean
    name: string
    text: string
    updatedAt: string
    userId: string
}

const BankDetails = (props: BankDetailsProps) => {
    const [addBankDetailsModal, setAddBankDetailsModal] = useState(false);
    const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBankItem, setSelectedBankItem] = useState<BankDetails | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const toast = useToast();
    const openModal = () => {
        setAddBankDetailsModal(true);
        setSelectedBankItem(null);
    };

    const closeModal = () => {
        setAddBankDetailsModal(false);
        getBankList();
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
            ApiUrl.listOfBank,
            success => {
                if (success.code === 200) {
                    setBankDetails(success.data);
                    setLoading(false);
                    console.log('Successfully got bank list', success.data);
                } else {
                    console.log('Failed from bank list', success.message);
                    setLoading(false);
                }
            },
            error => {
                console.log('Error fetching bank list:', error);
                setLoading(false);
            }
        );
    };

    const deleteBankDetails = (_id: string) => {
        postMethod(
            ApiUrl.deleteBankDetail,
            { _id },
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    const updatedBankList = bankDetails.filter(bankDetail => bankDetail._id !== _id);
                    setBankDetails(updatedBankList);
                    toast.show("Bank Deleted Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                } else {
                    toast.show("Failed to delete bank", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                console.log('Error deleting bank detail:', error);
            }
        );
    };

    const handleDeletePress = (customerId: string) => {
        setCustomerToDelete(customerId);
        setOpenDeleteModal(true); // Open the delete confirmation modal
    };

    const confirmDeleteCustomer = () => {
        if (customerToDelete) {
            deleteBankDetails(customerToDelete); // Call the delete logic
            setCustomerToDelete(null); // Reset the state
        }
        setOpenDeleteModal(false); // Close the modal
    };

    const cancelDeleteCustomer = () => {
        setCustomerToDelete(null); // Reset the state
        setOpenDeleteModal(false); // Close the modal
    };


    const editBank = (bankItem: BankDetails) => {
        setSelectedBankItem(bankItem);
        setAddBankDetailsModal(true)
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <ScrollView style={{ marginBottom: '25%' }}>
                            {openDeleteModal && (
                                <PopupCardModal
                                    handleYesBtn={confirmDeleteCustomer}
                                    handleNobtn={cancelDeleteCustomer}
                                    text="Are you sure you want to delete this bank?"
                                    visible={openDeleteModal}
                                    onClose={cancelDeleteCustomer}
                                />
                            )}
                            <View style={mh15}>
                                <View style={mv15}>
                                    <TopHeader headerText={labels.bankDetails} />
                                </View>
                                 <View style={[commonStyles.bottomWidth,mv5]}  />
                                <ListSubHeader listName={labels.bankAccounts} totalNumber={bankDetails.length.toString()} onAddPress={openModal} addIcon={true} filterIcon={false} />
                                {loading ? (
                                    <LoadingIndicator />
                                ) : (
                                    bankDetails.length === 0 ? (
                                        <Text style={{ color: 'red' }}> No data</Text>
                                    ) : (
                                        <View>
                                            {bankDetails.map((data) => {
                                                return (
                                                    <View key={data.id}>
                                                         <TouchableOpacity style={[commonStyles.mainListCard]} disabled>
                                                            <View style={[flexRow, justifyBetween]}>
                                                                <View>
                                                                     <Text style ={[commonStyles.h15blackOne600]}>{data.name}</Text>
                                                                    <Text style={[commonStyles.h14BlackTwo400]}>{labels.accountNumber}
                                                                        <Text style={[commonStyles.h12BlackOne600]}>{data.accountNumber}</Text>
                                                                    </Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                                    <TouchableOpacity style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}
                                                                        onPress={() => editBank(data)}>
                                                                        <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => handleDeletePress(data._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                                        <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                            <View style={{ marginVertical: 15, alignItems: 'center' }}>
                                                                <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                            </View>
                                                            <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                                <View style={[flexRow, justifyBetween]}>
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text style={[commonStyles.h12blackTwo600]}>{labels.bankName}</Text>
                                                                        <Text style={[commonStyles.h12BlackOne600]}>{data.bankName}</Text>
                                                                    </View>
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text style={[commonStyles.h12blackTwo600]}>{labels.branch}</Text>
                                                                        <Text style={[commonStyles.h12BlackOne600]}>{data.branch}</Text>
                                                                    </View>
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text style={[commonStyles.h12blackTwo600]}>{labels.ifsc}</Text>
                                                                        <Text style={[commonStyles.h12BlackOne600]}>{data.IFSCCode}</Text>
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
                        <BottomNavBar />
                        <CustomModal children={<AddBankDetails onSave={addSaveBtn} onCancel={closeModal} prefilledBankData={selectedBankItem} />} visible={addBankDetailsModal} onClose={closeModal} height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

export default BankDetails