import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import { getMethod, patchMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, flexRow, justifyBetween, mh15, mh5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import moment from 'moment';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import * as TYPES from '../../action/ActionType';
import { commonStyles, getMainContainerStyle, getTopNotchStyle } from '../../utils/commonStyles';

export type vendorsScreenProps = {}

export interface Root {
    program: string
    version: string
    release: string
    datetime: string
    timestamp: number
    status: string
    code: number
    message: string
    totalRecords: number
    data: Data[]
}

export interface Data {
    _id: string
    vendor_name: string
    vendor_email: string
    vendor_phone: string
    balance: number
    balanceType: string
    user_id: string
    status: boolean
    created_at: string
    updated_at: string
    isDeleted: boolean
    __v: number
}

export type SettingsComponentsProps = {
    onSave: (filteredVendors: Data[]) => void;
    onCancel: () => void;
};

type FormData = {
    search_vendor: string;
};


const VendorsScreen = (props: vendorsScreenProps) => {
    const [vendorsFilter, setVendorsFilter] = useState(false);
    const [vendorsList, setVendorsList] = useState<Data[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ vendor_name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.vendor);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ vendor_name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.vendor));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ vendor_name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();
    const [openModule, setOpenModule] = useState(false);
    const [activeId, setActiveId] = useState<string>('');
    const toast = useToast();
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userStatus, setUserStatus] = useState<string>('');
    const dispatch = useDispatch();


    const openFilterModal = () => {
        setVendorsFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getVendorsList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setVendorsFilter(false);
    };

    const getDropdown = () => {
        getMethod(
            ApiUrl.dropDownVendor,
            success => {
                if (success.code == 200) {
                    dispatch({ type: TYPES.VENDOR_LIST, payload: success.data })
                    setFilteredCustomers(success.data);
                } else {
                    //console.log('Failed to get vendor list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching vendor list:', error);
            }
        );
    }

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getVendorsList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setVendorsFilter(false);
        setSearchText('');
        getVendorsList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getVendorsList(1, selectedCustomers);
        setVendorsFilter(false);
        setSearchText('');
    }

    const getVendorsList = (page: number, selectedCustomers: Array<{ vendor_name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&vendor=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getDropdown();
        getMethod(
            `${ApiUrl.vendorList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setVendorsList(success.data);
                    setTotal(success.totalRecords);
                    setVendorsList(page == 1 ? success.data : [...vendorsList, ...success.data]);
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

    const formatDate = (dateString: string) => {
        return moment(dateString).format('DD-MM-YYYY');
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = CustomerList.filter(customer => customer.vendor_name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCustomers(filteredCustomersNew ?? []);
    };

    const viewVendorsList = (id: any) => {
        console.log('viewVendorsList', id);

        getMethod(
            `${ApiUrl.vendorDetails}/${id}`,
            success => {
                if (success.code === 200) {
                    console.log('Successfully view vendors list', success.data);
                    (navigation as any).navigate(screenName.VendorDetails, { vendorsDatas: success.data });
                } else {
                    console.log('Failed from vendors list', success.message);
                }
            },
            error => {
                console.log('Error fetching vendors list:', error);
            }
        );
    };

    const viewVendorsListEDit = (id: any) => {
        getMethod(
            `${ApiUrl.vendorDetails}/${id}`,
            success => {
                if (success.code === 200) {
                    console.log('Successfully view vendorsEdit list', success.data);
                    (navigation as any).navigate(screenName.AddVendor, { vendorsDatas: success.data });
                } else {
                    console.log('Failed from vendors list', success.message);
                }
            },
            error => {
                console.log('Error fetching vendors list:', error);
            }
        );
    };

    const deleteVendor = (id: any) => {
        patchMethod(
            `${ApiUrl.deleteVendor}/${id}`,
            {},
            (success: { code: number; message: any; }) => {
                if (success.code == 200) {
                    const updatedVendorsList = vendorsList.filter(vendor => vendor._id !== id);
                    setVendorsList(updatedVendorsList);
                    toast.show('Vendor Deleted Successfully', {
                        type: "success",
                        placement: "bottom",
                        duration: 500,
                        animationType: "zoom-in",
                    });
                    setOpenModule(false);
                    setPage(1);
                    setSelectedCustomers([]);
                    getVendorsList(1, []);
                } else {

                    toast.show('Failed to delete vendor', {
                        type: "error",
                        placement: "bottom",
                        duration: 500,
                        animationType: "zoom-in",
                    });
                }
            },
            error => {
                console.log('Error deleting vendor:', error);
                toast.show('Failed to delete vendor', {
                    type: "error",
                    placement: "bottom",
                    duration: 500,
                    animationType: "zoom-in",
                });
            }
        );
    };

    const pressLedger = (_id: string) => {
        (navigation as any).navigate(screenName.LedgersScreen, { vendorId: _id });
    };

    const openActiveModule = (_id: string,) => {
        setActiveId(_id);
        setOpenModule(true);
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.vendors} />
                            </View>
                            <View style={[commonStyles.bottomWidth, mv5]} />
                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} listName={labels.vendors} totalNumber={total} onAddPress={() => (navigation as any).navigate(screenName.AddVendor, { isAddedProductAvailable: false } as never)} onFilterPress={openFilterModal} />
                                <FlatList
                                    data={vendorsList}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, vendorsList.length);
                                        if (total > vendorsList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const data = item;
                                        return (
                                            <View key={data._id}>
                                                <TouchableOpacity style={[commonStyles.mainListCard, {
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.2,
                                                    shadowRadius: 4,
                                                    elevation: 4,
                                                }]} >
                                                    <TouchableOpacity onPress={() => viewVendorsList(data._id)} >
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                                    <Text style={[commonStyles.h15blackOne600]}>{data.vendor_name}</Text>
                                                                    <Text style={[commonStyles.h12blackTwo400]}>{data.vendor_email}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                                <TouchableOpacity
                                                                    style={{ backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 5, width: 75, height: 26 }}
                                                                    onPress={() => pressLedger(data._id)}
                                                                >
                                                                    <CustomIcon name={'eye'} size={10} color={colors.white} type={'Feather'} />
                                                                    <Text style={[commonStyles.h12white600,mh5]} >{labels.ledger}</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => viewVendorsListEDit(data._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                                    <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => openActiveModule(data._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                            <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                        </View>
                                                        <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                            <View style={[flexRow, justifyBetween]}>
                                                                <View>
                                                                    <Text style={[commonStyles.h12blackTwo600]}>{labels.phone}</Text>
                                                                    <Text style={commonStyles.h14blackOne600}>{data.vendor_phone?.substring(0, 10)}</Text>
                                                                </View>
                                                                <View>
                                                                    <Text style={[commonStyles.h12blackTwo600]}>{labels.createdOn}</Text>
                                                                    <Text style={commonStyles.h14blackOne600}>{formatDate(data.created_at)}</Text>
                                                                </View>
                                                                <View>
                                                                    <Text style={[commonStyles.h12blackTwo600]}>{labels.closingBalance}</Text>
                                                                    <Text style={commonStyles.h14blackOne600}>{currencySymbol}{data.balance.toFixed(2)}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </TouchableOpacity>

                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index + ''}
                                />
                            </View>
                            {openModule && <PopupCardModal handleYesBtn={() => deleteVendor(activeId)} text={`Do you want to delete Vendor?`} visible={openModule} onClose={() => setOpenModule(false)} />}
                        </View>
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setVendorsFilter(false)} title='Filter' />
                                <Text style={[commonStyles.h14blackOne600,mv10]}>{"Vendor"}</Text>
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
                                        renderItem={({ item }) => {
                                            return (
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
                                                    <Text style={commonStyles.h14blackOne600}>{item.vendor_name}</Text>
                                                </View>
                                            )
                                        }}
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
                            visible={vendorsFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default VendorsScreen;

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
