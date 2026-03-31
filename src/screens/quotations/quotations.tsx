import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ExpandableSection, ListSubHeader, MultiSelectOption, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, patchMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, justifyCenter, mb10, mh10, mh15, ml10, ml5, mr10, mt5, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import moment from 'moment';
import { fallbackImage } from '../../utils/png';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type QuotationReportProps = {
}

type FormData = {
    search_customer: string;
};

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
    data: QuotationData[]
}

export interface QuotationData {
    _id: string
    quotation_id: string
    customerId: CustomerId
    quotation_date: string
    due_date: string
    reference_no: string
    items: Item[]
    discountType: string
    status: string
    discount: string
    tax: string
    taxableAmount: string
    totalDiscount: string
    vat: string
    roundOff: boolean
    TotalAmount: string
    bank: string
    notes: string
    termsAndCondition: string
    sign_type: string
    signatureName?: string
    signatureImage?: string
    userId: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
    id: string
    signatureId?: SignatureId
}

export interface CustomerId {
    _id: string
    name: string
    email: string
    phone: string
    website: string
    image: string
    notes: string
    status: string
    billingAddress: BillingAddress
    shippingAddress: ShippingAddress
    bankDetails: BankDetails
    userId: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

export interface BillingAddress {
    name: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    pincode: string
    country: string
}

export interface ShippingAddress {
    name: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    pincode: string
    country: string
}

export interface BankDetails {
    bankName: string
    branch: string
    accountHolderName: string
    accountNumber: string
    IFSC: string
}

export interface Item {
    productId: string
    quantity: string
    unit: string
    rate: string
    discount: string
    tax: string
    amount: string
    name: string
    discountValue: string
}

export interface SignatureId {
    _id: string
    signatureName: string
    signatureImage: string
    status: boolean
    markAsDefault: boolean
    isDeleted: boolean
    userId: string
    createdAt: string
    updatedAt: string
    __v: number
}

const QuotationsScreen = (props: QuotationReportProps) => {
    const [quotationFilter, setQuotationFilter] = useState(false);
    const [quotationsList, setQuotationsList] = useState<QuotationData[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const CustomerList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.totalCustomer);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.totalCustomer));
    const [selectedCustomers, setSelectedCustomers] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const navigation = useNavigation();
    const [openModule, setOpenModule] = useState(false);
    const [activeId, setActiveId] = useState<string>('');
    const toast = useToast();

    const openFilterModal = () => {
        setQuotationFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getQuotationsList(page, selectedCustomers);
        }
    }, [page]);

    const closeModal = () => {
        setQuotationFilter(false);
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCustomers([]);
            getQuotationsList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCustomers([]);
        setFilteredCustomers(CustomerList);
        setValue('search', '');
        setPage(1);
        setQuotationFilter(false);
        setSearchText('');
        getQuotationsList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCustomers(CustomerList);
        getQuotationsList(1, selectedCustomers);
        setQuotationFilter(false);
        setSearchText('');
    }

    const getQuotationsList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&customer=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.quotationList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setQuotationsList(success.data);
                    setTotal(success.totalRecords);
                    setQuotationsList(page == 1 ? success.data : [...quotationsList, ...success.data]);
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
        const filteredCustomersNew = CustomerList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCustomers(filteredCustomersNew ?? []);
    };

    const openActiveModule = (_id: string,) => {
        setActiveId(_id);
        setOpenModule(true);
    }

    const cloneQuotation = (id: string) => {
        console.log('IDDDDD******************', id),
            postMethod(

                ApiUrl.cloneQuotation,
                { id },
                (success: { code: number; message: any; data: any }) => {
                    if (success.code === 200) {
                        toast.show("Cloned Quotation Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        console.log('Successfully cloned purchase return:', success.data);
                        setPage(1);
                        getQuotationsList(1, selectedCustomers);
                    } else {
                        console.log('Failed to clone purchase return:', success.message);
                        toast.show("Failed to clone quotation", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    console.log('Error cloning purchase return:', error);
                    toast.show("Failed to clone quotation", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
    };


    const deleteQuotation = (id: any) => {
        setOpenModule(false);
        patchMethod(
            `${ApiUrl.deleteQuotation}${id}`,
            {},
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    toast.show("Deleted Quotation Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Successfully deleted');
                    setPage(1);
                    getQuotationsList(1, selectedCustomers);
                } else {
                    console.log('Failed to delete:', success.message);
                    toast.show("Failed to delete quotation", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                console.log('Error deleting:', error);
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
                                <TopHeader headerText={labels.quotations} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]} />
                            <View style={{ marginBottom: 300 }}>
                                <ListSubHeader addIcon={true} listName={labels.quotations} totalNumber={total} onAddPress={() => (navigation as any).navigate(screenName.AddQuotationScreen, { isAddedProductAvailable: false } as never)} onFilterPress={openFilterModal} />
                                <FlatList
                                    data={quotationsList}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                                        </View>
                                    }
                                    onEndReached={() => {
                                        console.log('onEndReached', page, total, quotationsList.length);
                                        if (total > quotationsList.length) {
                                            setPage(page + 1);
                                        }
                                    }}
                                    renderItem={({ item, index }) => {
                                        const report = item;
                                        const imageUri = item?.customerId?.image || fallbackImage;
                                        return (
                                             <TouchableOpacity style={[commonStyles.mainListCard]} onPress={() => (navigation as any).navigate(screenName.QuotationDetails, { itemId: report._id } as never)}>
                                                <View style={{}}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <View style={{ flexDirection: 'row', }}>
                                                            {report?.customerId?.image &&
                                                                <Image
                                                                    source={{ uri: imageUri }}
                                                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                                                />}
                                                            <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                                 <Text style ={[commonStyles.h15blackOne600]}>{report.customerId?.name}</Text>
                                                                 <Text style={[commonStyles.h12blackTwo400]}></Text>
                                                                 <Text style={[commonStyles.h12blackTwo400]}>Phone: {report.customerId?.phone}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                            <TouchableOpacity onPress={() => (navigation as any).navigate(screenName.AddQuotationScreen, { quotationDetails: report } as never)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                                                                <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => openActiveModule(report._id)}
                                                                style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                                <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => cloneQuotation(report.id)}
                                                                style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                                <CustomIcon name={'copy'} size={15} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                                    <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                                </View>
                                                <View style={{ backgroundColor: colors.white4, padding: 10, borderRadius: 10 }}>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <View>
                                                            <Text style={[commonStyles.h12blackTwo600]}>{labels.quotationId}</Text>
                                                           <Text style={commonStyles.h14blackOne600}>{report.quotation_id}</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={[commonStyles.h12blackTwo600]}>{labels.createdOn}</Text>
                                                           <Text style={commonStyles.h14blackOne600}>{formatDate(report.createdAt)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index + ''}
                                />
                            </View>
                            {openModule && <PopupCardModal handleYesBtn={() => deleteQuotation(activeId)} text={`Do you want to delete Quotation?`} visible={openModule} onClose={() => setOpenModule(false)} />}
                        </View>
                        <BottomNavBar />
                        <CustomModal children={

                            <View style={[justifyBetween, flex1]}>
                                <ModalTopText iconPress={() => setQuotationFilter(false)} title='Filter' />
                               <Text style={[commonStyles.h14blackOne600,mv10]} >{"Customer"}</Text>
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
                                                   <Text style={commonStyles.h14blackOne600}>{item.name}</Text>
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
                            visible={quotationFilter}
                            onClose={closeModal}
                            height={'80%'} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default QuotationsScreen;

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
