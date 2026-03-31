import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BottomNavBar from '../../components/bottomNavBar';
import { Card } from '../../components/commonCard';
import DashedLine from '../../components/dashedLine';
// import CustomModal from '../../components/responsePopupCard';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { addQuickData, dashboardHeaderCardData, menuData, updateDashboardData } from '../../utils/data/dashboardData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { DashboardBackground, defaultImage, PaymentSummaryBgImage, ProfileImage, ServerDown } from '../../utils/png';
import { screenName } from '../../utils/screenNames';
import { LayoutDashboard, ProfileImg } from '../../utils/svg';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, justifyCenter, mb10, mb15, mb5, mh10, mh15, ml15, mt10, mt15, mt5, mv15, pv10 } from '../../utils/theme/commonStyles';
import FrequentCustomers from './frequentCustomers';
import InvoiceStatics from './invoiceStatics';
import PaymentStatics from './paymentStatics';
import QuickAccess from './quickAccess';
import RecentCustomers from './recentCustomers';
import RecentInvoices from './recentInvoices';
import { useDispatch } from 'react-redux';
import * as TYPES from '../../action/ActionType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../../utils/Loader';
import { ProfileData } from '../settings/settings';
import CustomModal from '../../components/commonModal';
import { set } from 'react-hook-form';
import { commonStyles, getTopNotchStyle, getMainContainerStyle } from '../../utils/commonStyles';

export type dashboardProps = {

}


const DashboardScreen = (props: dashboardProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [dashboardData, setDashboardData] = useState<any>([]);
    const [recentInvoice, setRecentInvoice] = useState<any>([]);
    const [recentCustomer, setRecentCustomer] = useState<any>([]);
    const [errorData, setErrorData] = useState<boolean>(false);
    const [loading, setLoading] = useState(true)
    const [profileView, setProfileView] = useState<ProfileData | null>(null);
    const isFocus = useIsFocused();
    const [invoiceStaticsData, setInvoiceStaticsData] = useState<any>(
        [
            {
                id: 1,
                title: labels.paid,
                amount: 0,
                color: colors.green,
            },
            {
                id: 2,
                title: labels.drafted,
                amount: 0,
                color: colors.blue,
            },
            {
                id: 3,
                title: labels.partiallypaid,
                amount: 0,
                color: colors.yellow,
            },
            {
                id: 4,
                title: labels.overDue,
                amount: 0,
                color: colors.danger,
            },
        ]
    );

    useFocusEffect(
        useCallback(() => {
            dashboardApi();
        }, [])
    );

    useEffect(() => {
        if (isFocus) {
            setErrorData(false);
            getDashBoardDta();
        }
    }, [isFocus])

    const [isValidImage, setIsValidImage] = useState(false);

    useEffect(() => {
        if (profileView?.image) {
            Image.prefetch(profileView.image)
                .then(() => setIsValidImage(true))
                .catch(() => setIsValidImage(false));
        }
    }, [profileView?.image]);

    const getDashBoardDta = () => {
        getMethod(
            ApiUrl.dashboardList,
            success => {
                //   doChangeSpinnerFlag(false);
                if (success.code == 200) {
                    console.log("sucessss from dashboard", success.data)
                    setDashboardData(success.data)
                    setRecentInvoice(success.data.invoiceList)
                    setInvoiceStaticsData([
                        {
                            id: 1,
                            title: labels.paid,
                            amount: success.data.paidAmt,
                            color: colors.green,
                        },
                        {
                            id: 2,
                            title: labels.drafted,
                            amount: success.data.draftedAmt,
                            color: colors.blue,
                        },
                        {
                            id: 3,
                            title: labels.partiallypaid,
                            amount: success.data.partiallyPaidAmt,
                            color: colors.yellow,
                        },
                        {
                            id: 4,
                            title: labels.overDue,
                            amount: success.data.overdueAmt,
                            color: colors.danger,
                        }
                    ])
                    setLoading(false)
                } else {
                    // console.log();
                }
            },
            error => {
                //   doChangeSpinnerFlag(false);
                console.log("Error from dashboard", error);
                setErrorData(true)
                setLoading(false)
            },
        );
    }
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const dashboardApi = () => {
        console.log("Dashboard API called!");
        getMethod(
            ApiUrl.dropDownCustomer,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Customer list', success.data);
                    dispatch({ type: TYPES.CUSTOMER_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get Customer list:', success.message);
                }
            },
            error => {
                if (error?.data?.message == "Middleware : jwt expired") {
                    AsyncStorage.clear();
                    navigation.navigate(screenName.LoginEmailScreen as never);
                }
            }
        );
        getMethod(
            ApiUrl.customersList,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Customer list', success.data);
                    dispatch({ type: TYPES.CUSTOMER_TOTAL, payload: success.data })
                    setRecentCustomer(success.data.slice(-5));
                } else {
                    //console.log('Failed to get Customer list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Customer list:', error);
                if (error?.data?.message == "Middleware : jwt expired") {
                    AsyncStorage.clear();
                    navigation.navigate(screenName.LoginEmailScreen as never);
                }
            }
        );
        getMethod(
            ApiUrl.dropDownVendor,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got vendor list', success.data);
                    dispatch({ type: TYPES.VENDOR_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get vendor list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching vendor list:', error);
            }
        );
        getMethod(
            ApiUrl.settingsProfile,
            success => {
                if (success.code == 200) {
                    setProfileView(success.data);
                    setLoading(false);
                    console.log('Successfully got settings profile', success.data);
                } else {
                    console.log('Failed from settings profile', success.message);
                    setLoading(false);
                }
            },
            error => {
                console.log('Error fetching unit list:', error);
                setLoading(false);
            }
        );
        getMethod(
            ApiUrl.dropDownProduct,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Product list', success.data);
                    dispatch({ type: TYPES.PRODUCT_LIST, payload: success.data })
                    console.log('product list from dashboard', success.data)
                } else {
                    //console.log('Failed to get Product list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Product list:', error);
            }
        )
        getMethod(
            ApiUrl.dropDownBank,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Bank list', success.data);
                    dispatch({ type: TYPES.BANK_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get Bank list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Bank list:', error);
            }
        );
        getMethod(
            ApiUrl.dropDownTax,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Tax list', success.data);
                    dispatch({ type: TYPES.TAX_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get Tax list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Tax list:', error);
            }
        );
        getMethod(
            ApiUrl.dropDownSign,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Signature list', success.data);
                    dispatch({ type: TYPES.SIGNATURE_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get Signature list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Signature list:', error);
            }
        );
        getMethod(
            ApiUrl.dropDownUnits,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Units list', success.data);
                    dispatch({ type: TYPES.UNITS_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get Units list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Units list:', error);
            }
        );
        getMethod(
            ApiUrl.dropDownCategory,
            success => {
                if (success.code == 200) {
                    //console.log('Successfully got Category list', success.data);
                    dispatch({ type: TYPES.CATEGORY_LIST, payload: success.data })
                } else {
                    //console.log('Failed to get Category list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Category list:', error);
            }
        );
    }

    const menuOptionModal = () => {
        return (
            <View>
                <View style={[{ height: 4, width: 70, borderRadius: 10, backgroundColor: colors.black }, alignSelfCenter, mb15]} />
                <Text style={[commonStyles.h18BlackOne700,mb10]}>{labels.menu}</Text>
                <View style={[{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 180 }, ml15]}>
                    {menuData.map(({ SvgImage, id, screenName, title }) => (
                        <View key={id} style={{ marginHorizontal: 6, marginVertical: 6 }}>
                            <TouchableOpacity style={[{ height: 45, width: 45, borderRadius: 8, backgroundColor: colors.whiteThree }, alignItemCenter, justifyCenter]}
                                onPress={() => {
                                    setShowModal(false);
                                    navigation.navigate(screenName as never)
                                }}>
                                <SvgImage height={25} width={25} />
                            </TouchableOpacity>
                            <View style={[mt5]}>
                                {title.includes(' ') ? (
                                    title.split(' ').map((word, index) => (
                                        <Text style={[commonStyles.h10blackTwo600,styles.word]} key={index}>{word}</Text>
                                      
                                    ))
                                ) : (
                                    <Text style={[commonStyles.h10blackTwo600,styles.word]} >{title}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
                {/* <BottomNavBar /> */}
            </View>
        )
    }

    const dashBoardHeader = () => {
        return (
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, mt10]}>
                <TouchableOpacity onPress={openModal} style={[{ backgroundColor: colors.primaryThree, height: 32, width: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }]}>
                    <LayoutDashboard height={16} width={16} color={colors.white} />
                </TouchableOpacity>
                <Text style={[commonStyles.h18white700]}>{labels.dashboard}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                    <TouchableOpacity onPress={() => navigation.navigate(screenName.SettingsScreen as never)}>
                        <Image
                            source={isValidImage ? { uri: profileView?.image } : { uri: defaultImage }}
                            style={{ height: 32, width: 32, borderRadius: 8 }}
                        />
                    </TouchableOpacity>
                </View>
                <CustomModal children={menuOptionModal()} visible={showModal} onClose={closeModal} height={'80%'} />
            </View>
        )
    }
    // Example usage
    const updatedDashboardData = updateDashboardData(dashboardHeaderCardData, dashboardData);


    const headerScrollCard = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {dashboardData && updatedDashboardData?.map(({ SvgImage, amount, cardName, date, id, isAdd, iconName, iconType, percentage, status }) => {
                        console.log('status from dashboard', status)
                        return (
                            <Card style={{ width: 200 }} key={id}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ alignItems: 'flex-start', justifyContent: 'space-around' }}>
                                       <Text style={commonStyles.h14blackOne600}>{cardName}</Text>
                                       <Text style={[commonStyles.h10grey600]}>{'Since Last Week'}</Text>
                                    </View>
                                    <View style={[{ height: 35, width: 35, backgroundColor: colors.greyOne, borderRadius: 8 }, alignItemCenter, justifyCenter]}>
                                        <SvgImage height={16} width={16} />
                                    </View>
                                </View>
                                <View style={[pv10]}>
                                    <DashedLine height={180} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[commonStyles.h16BlackOne700]}>{amount ? amount : 0}</Text>
                                    <View style={{ justifyContent: 'center', backgroundColor: colors.greyOne, height: 25, width: 60, borderRadius: 2 }}>
                                        {
                                            status === 'Increased' ?
                                                <View style={{ flexDirection: 'row', justifyContent: "space-around", alignItems: 'center' }}>
                                                    <CustomIcon color={colors.green} size={12} name='circle-arrow-up' type='FontAwesome6' />
                                                    <Text style={[commonStyles.h10green600]}>{percentage}</Text>
                                                </View>
                                                : <View style={{ flexDirection: 'row', justifyContent: "space-around", alignItems: 'center' }}>
                                                    <CustomIcon color={colors.danger} size={12} name='circle-arrow-down' type='FontAwesome6' />
                                                    <Text style={[commonStyles.h10danger600]}>{percentage}</Text>
                                                </View>
                                        }
                                    </View>
                                </View>
                            </Card>
                        )
                    })}

                </ScrollView>
            </View>
        )
    }

    const paymentSurvey = () => {
        return (
            <View style={[flexRow, justifyBetween, { height: 120, width: '100%', backgroundColor: colors.blackThree, borderRadius: 10 }]}>
                <View style={[ml15, mt15]}>
                    <Text style={[commonStyles.h16White700]}>{labels.paymentSummary}</Text>
                    <Text style={[commonStyles.h12GreyTwo400,mt5]}>View the Payment Summary {'\n'}on your Invoices</Text>
                    <TouchableOpacity style={[{ height: 25, width: 100, backgroundColor: colors.primary, borderRadius: 15 }, alignItemCenter, justifyCenter, mt15]}
                        onPress={() => navigation.navigate(screenName.PaymentReport as never)}
                    >
                        <Text style={[commonStyles.h12white600]}>{labels.viewSummary}</Text>
                    </TouchableOpacity>
                </View>
                <ImageBackground source={PaymentSummaryBgImage} style={{ height: 120, width: 130, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                </ImageBackground>
            </View>
        )
    }

    const addAQuickCard = () => {
        return (
            <View style={[{ flexDirection: 'row', }, pv10]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {
                        addQuickData.map((item, index: number) => {
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate(item.moveTo as never)} style={{ padding: 4 }} key={item.id}>
                                    <Card backgroundColor={index % 2 === 0 ? colors.cardColor1 : colors.cardColor2} style={{ height: 75, width: 80, alignItems: 'center', justifyContent: 'center' }} key={index}>
                                        <View style={mb5}>
                                            <CustomIcon color={colors.blackOne} name='plus' size={16} type='Entypo' />
                                        </View>
                                        <Text style={[commonStyles.h12BlackOne600]}>{item.title}</Text>
                                    </Card>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <ScrollView>
                        {!loading && !errorData &&
                            <>
                                <ImageBackground source={DashboardBackground} style={[{ flex: 1, height: '100%', width: '100%' }]}>
                                    <View style={{ marginBottom: 60 }}>
                                        <View style={[mh10, { flex: 1 }]}>
                                            {dashBoardHeader()}
                                            <View style={[mt10, mb10]}>
                                                {headerScrollCard()}
                                            </View>
                                        </View>
                                        <View style={{ backgroundColor: colors.whiteTwo, height: '100%', marginTop: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                            <View style={[mt10, mh15, mv15]}>
                                                {/* <Text style={[commonStyles.h16BlackOne700]} style={[mb5]}>{labels.addAQuick}</Text> */}
                                                {addAQuickCard()}
                                                <PaymentStatics />
                                                <FrequentCustomers recentCustomers={recentCustomer} />
                                                <QuickAccess />
                                                <InvoiceStatics invoiceStaticsData={invoiceStaticsData} />
                                                {recentInvoice && <RecentInvoices invoice={recentInvoice} />}
                                                {paymentSurvey()}
                                                {recentCustomer && <RecentCustomers customer={recentCustomer} />}
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </>
                        }
                        {!loading && errorData && <View style={{ justifyContent: 'center', marginTop: 150 }}>
                            <Image
                                source={ServerDown}
                                style={{ height: 300, width: 300, alignSelf: 'center' }} />
                            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.redThree, fontSize: 18 }}>Unable to fetch data Need to Login Again</Text>
                        </View>}
                        {loading && !errorData && <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', flex: 1, marginTop: 300 }}><Loader /></View>}
                    </ScrollView >
                </View>
                <BottomNavBar />
            </SafeAreaView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    word: {
        lineHeight: 16, // You can adjust the line height as needed
        textAlign: 'center',
    },
});

export default DashboardScreen