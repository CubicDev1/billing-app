import React, { Fragment, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { defaultProfileImage, RecenetCustomersImage1 } from '../../utils/png';
import { InvoiceCard, InvoiceScreenCard, TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, mt10, mh10, flexRow, justifyBetween, alignItemCenter, mv15, ml15, mr15, justifyCenter, ml10, mt5, ml5, mv10, pv10, alignSelfCenter, pv5, mv5, flexColumn, p5 } from '../../utils/theme/commonStyles';
import BottomNavBar from '../../components/bottomNavBar';
import { screenName } from '../../utils/screenNames';
import { useNavigation } from '@react-navigation/native';
import { allInvoicesdata, CustomerCardData, invoiceCardData } from '../../utils/data/invoiceData';
import DashedLine from '../../components/dashedLine';
import { InvoiceCardImg1 } from '../../utils/svg';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { currencySymbol } from '../../constant/constApi';
import { commonStyles, getMainContainerStyle, getTopNotchStyle } from '../../utils/commonStyles';
import { Invoice } from './customers';

export type customerDetailsProps = {
    route: any
}
interface Props {
    invoiceData: Invoice;
    CardDetails: Array<any>;
    allInvoicesdata: Array<any>;
    CalculateBalance: (invoiceRecs: Array<any>) => number;
    navigation: any;
}
interface InvoiceData {
    id: string;
    image: string;
    name: string;
    invoiceRecs?: Array<any>;
}

const CustomerDetailsScreen = (props: customerDetailsProps) => {
    const navigation = useNavigation();
    const { UserDetails } = props.route.params;
    const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
    const [CardDetails, setCardDetails] = useState<any[]>([]);
    useEffect(() => {
        getInvoiceDetails()
    }, [])


    const getInvoiceDetails = () => {
        getMethod(
            ApiUrl.getInvoiceDetails + UserDetails._id,
            success => {
                console.log("success", success?.data);
                setInvoiceData(success?.data?.customerDetails?.[0]);
                setCardDetails(success?.data?.cardDetails);
            },
            error => {
                console.log("error", error);
            }
        )
    }

    const InvoiceCards = ({ CardDetails }: { CardDetails: Response }) => {
        const cardData = CustomerCardData(CardDetails);

        return (
            <View style={[flexRow, { flexWrap: 'wrap', }]}>
                {cardData.map(({ id, Img, color, amount, text, count }) => (
                    <View key={id} style={[{
                        width: '43%',
                        backgroundColor: colors.white,
                        borderRadius: 8, shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.40, shadowRadius: 1.84,
                        elevation: 1
                    }, { margin: 10 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginVertical: 10 }}>
                            <View style={{ height: 24, width: 24, backgroundColor: color, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Img height={14} width={14} />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                               <Text style={commonStyles.h14blackOne600}>{amount}</Text>
                                <Text style={[commonStyles.h12BlackOne600,{color:color}]} >{text}</Text>
                            </View>
                        </View>
                        <View style={{ paddingVertical: 5, alignSelf: 'center' }}>
                            <DashedLine height={150} color={colors.greyTwo} dashLength={10} dashGap={3} />
                        </View>
                        <View style={{ marginHorizontal: 10, marginBottom: 8 }}>
                            <Text style={[commonStyles.h12blackTwo600,mt5]} >No of Invoice : {count}</Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    const CalculateBalance = (invoiceData: any[]) => {
        return invoiceData?.reduce((accumulator: number, invoice: { balance: any; }) => {
            return accumulator + Number(invoice.balance);
        }, 0);
    };
    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>

                    <View style={[flex1, { backgroundColor: colors.white, }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[flex1, mt10, mh10, { marginBottom: 70 }]}>
                                <TopHeader headerText={labels.customerDetails} searchIcon={false} />
                                <View style={[flexRow, justifyBetween, alignItemCenter, mv15, { height: 100, width: '100%', borderWidth: 1, borderColor: colors.grey, borderRadius: 8 }]}>
                                    <View style={[flexRow, justifyBetween, alignItemCenter, ml15]}>
                                        <View style={[alignItemCenter, justifyCenter, { height: 70, width: 70, borderWidth: 1, borderRadius: 8, borderColor: colors.grey }]} >
                                            <Image source={defaultProfileImage} style={{ height: 55, width: 55 }} />
                                        </View>
                                        <View style={[ml10]}>
                                             <Text style ={[commonStyles.h15blackOne600]}>{invoiceData.name}</Text>
                                            <Text style={[commonStyles.h12blackTwo600,mt5]} >Invoices : {invoiceData?.invoiceRecs?.length}</Text>
                                        </View>
                                    </View>
                                    <View style={[{ height: 25, backgroundColor: colors.redOne, borderRadius: 5 }, p5, alignItemCenter, justifyCenter, mr15]}>
                                        <Text style={[commonStyles.h12RedFour600]}>Balance : {currencySymbol}{CalculateBalance(invoiceData?.invoiceRecs)}</Text>
                                    </View>
                                </View>
                                <Text style={[commonStyles.h16BlackOne700,mv5]} >{labels.invoiceStatics}</Text>
                                <View style={[alignItemCenter, { flexWrap: 'wrap' }]}>
                                    {CardDetails.length > 0 && <InvoiceCards CardDetails={CardDetails[0]} />}
                                </View>
                                <Text style={[commonStyles.h16BlackOne700,mt5]} >{labels.invoice}</Text>
                                <View>
                                    {
                                        invoiceData?.invoiceRecs?.length > 0 ? (
                                            invoiceData.invoiceRecs.map((invoice: any, index: number) => (
                                                <InvoiceScreenCard key={index} data={invoice} UserData={invoiceData} />
                                            ))
                                        ) : (
                                            <Text style={{ textAlign: 'center', marginTop: 20 }}>No invoices found</Text>
                                        )
                                    }
                                </View>
                            </View>
                        </ScrollView>
                        <BottomNavBar navigationPlusButton={() => navigation.navigate(screenName.AddCustomersScreen as never)} />
                    </View>

                </View>
            </SafeAreaView>
        </Fragment>
    )

}

export default CustomerDetailsScreen;