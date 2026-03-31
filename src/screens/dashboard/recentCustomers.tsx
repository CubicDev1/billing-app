import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { labels } from '../../utils/labels';
import { mv15, flexRow, justifyBetween, alignItemCenter, justifyCenter, mh10, ml10, mv10, ml5, ph10, alignSelfCenter } from '../../utils/theme/commonStyles';
import { recentCustomersData } from '../../utils/data/dashboardData';
import { colors } from '../../utils/theme/colors';
import CustomIcon from '../../utils/icons';
import { ApiUrl } from '../../services/apiUrl';
import { AppDomainUrl } from '../../services/apiService';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../utils/screenNames';
import { defaultProfileImage } from '../../utils/png';
import { currencySymbol } from '../../constant/constApi';
import { commonStyles } from '../../utils/commonStyles';

export type recentCustomersProps = {
    customer(customer: any): React.ReactNode;

}


const RecentCustomers = (props: recentCustomersProps) => {
    const navigation = useNavigation();
    const recentCustomersCard = (data: any[]) => {
        console.log('recent customer card', data)
        return (
            <View style={{ flexDirection: 'row' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {
                        data.map((item: { id: React.Key | null | undefined; image: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; noOfInvoices: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; balance: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => {
                            return (
                                <View key={index} style={{ height: 120, width: 250, marginBottom: 10, marginRight: 10, marginTop: 15, alignSelf: 'center', backgroundColor: colors.white, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, }} key={item.id}>
                                    <View style={[flexRow, justifyBetween, mh10, mv10]}>
                                        <View style={[flexRow, alignItemCenter, {}]}>
                                            <View style={[{ height: 50, width: 50, borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 10 }, justifyCenter, alignItemCenter]}>
                                                {/* <Image source={{ uri: item?.image }} style={{ height: 40, width: 40 }} /> */}
                                                <Image
                                                    source={
                                                        item?.image
                                                            ? { uri: item?.image }

                                                            : defaultProfileImage // Local placeholder image
                                                    }
                                                    style={{ width: 45, height: 45, borderRadius: 10 }}
                                                />
                                            </View>
                                            <View style={[ml10]}>
                                                <Text style={[commonStyles.h16BlackOne700]}>{item?.name}</Text>
                                                <Text style={[commonStyles.h12blackTwo600]}>Invoices : {item?.noOfInvoices}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[flexRow, justifyBetween, mh10, mv10, alignItemCenter]}>
                                        <View style={[alignItemCenter, justifyCenter, ph10, { height: 25, backgroundColor: colors.blueOne, borderRadius: 5 }]}>
                                            <Text style={[commonStyles.h12BlackOne600]}>Balance : {currencySymbol}{item?.balance ? item.balance.toFixed(2) : '0'}</Text>
                                        </View>
                                        {/* <View style={[flexRow, justifyBetween]}>
                                            <View style={[alignItemCenter, justifyCenter, { height: 16, width: 16, backgroundColor: colors.blackOne, borderRadius: 5 }]}>
                                                <CustomIcon color={colors.white} name='plus' size={10} type='Entypo' />
                                            </View>
                                            <Text style={[commonStyles.h12BlackOne600]} style={ml5}>{labels.addInvoice}</Text>
                                        </View> */}
                                        {item.status === 'Active' && (
                                            <TouchableOpacity style={[flexRow, justifyBetween, alignItemCenter, ml10, alignSelfCenter]} onPress={() => { (navigation as any).navigate(screenName.AddInvoiceScreen, { CustomerName: item } as never) }}>
                                                <View style={[{ height: 16, width: 16, backgroundColor: colors.blackOne, borderRadius: 5 }, alignItemCenter, justifyCenter]}>
                                                    <CustomIcon color={colors.white} name='plus' size={12} type='Entypo' />
                                                </View>
                                                <Text style={[commonStyles.h12BlackOne600,ml5]} >{labels.addInvoice}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }

    return (
        <View style={[mv15]}>
            <View style={[flexRow, justifyBetween]}>
                <Text style={[commonStyles.h16BlackOne700]}>{labels.recentCustomers}</Text>
                <TouchableOpacity onPress={() => navigation.navigate(screenName.CustomersScreen as never)}>
                    <Text style={[commonStyles.h14Primary400Underline]}>{labels.viewAll}</Text>
                </TouchableOpacity>
            </View>
            <View>
                {recentCustomersCard(props?.customer)}
            </View>
        </View>
    )
}

export default RecentCustomers