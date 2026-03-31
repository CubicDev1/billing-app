import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { flexRow, justifyBetween, mv15 } from '../../utils/theme/commonStyles';
import { labels } from '../../utils/labels';
import { InvoiceCard } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../utils/screenNames';
import { commonStyles } from '../../utils/commonStyles';

export type recentInvoicesProps = {
    invoice(arg0: string, invoice: any): unknown;

}

const recentInvoiceCards = (data: any[]) => {

    return (
        <View>
            {
                data.map((invoice: { invoiceNumber: string; customerId: any; TotalAmount: string; payment_method: string; id: number; img: any; invoiceNo: string; companyName: string; status: string; amount: string; modeOfPayment: string; dueDate: string; color: string; }, index: React.Key | null | undefined) => {
                    return (
                        <InvoiceCard key={index} data={invoice} noOptions refresh={
                            () => {

                            }
                        } />
                    )
                })
            }
        </View>
    )
}

const RecentInvoices = (props: recentInvoicesProps) => {
    const navigation = useNavigation();

    // Extract only the first 5 invoices
    const recentInvoices = props?.invoice?.slice(0, 4);

    return (
        <View style={[mv15]}>
            <View style={[flexRow, justifyBetween]}>
                <Text style={[commonStyles.h16BlackOne700]}>{labels.recentInvoice}</Text>
                <TouchableOpacity onPress={() => { navigation.navigate(screenName.InvoiceScreen as never) }}>
                    <Text style={[commonStyles.h14Primary400Underline]}>{labels.viewAll}</Text>
                </TouchableOpacity>
            </View>
            <View>
                {recentInvoiceCards(recentInvoices)}
            </View>
        </View>
    );
};


export default RecentInvoices;