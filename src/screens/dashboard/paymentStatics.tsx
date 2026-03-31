import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { mh15, mv15, flexRow, alignItemCenter, justifyBetween, mb15, mt5, mh10, mv10, mt0 } from '../../utils/theme/commonStyles';
import { BarChartDiagram } from './barChart';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import moment from 'moment';
import { currencySymbol } from '../../constant/constApi';
import { useIsFocused } from '@react-navigation/native';
import LoadingIndicator from '../../components/loadingIndicator';
import { commonStyles } from '../../utils/commonStyles';


export type paymentStaticsProps = {

}


const PaymentStatics = (props: paymentStaticsProps) => {
    const [purchaseAmount, setPurchaseAmount] = useState([{
        month: '',
        total: 0
    }]);
    const [salesAmount, setSalesAmount] = useState([{
        month: '',
        total: 0
    }]);
    const isFocused = useIsFocused();
    const [isSalesLoading, setIsSalesLoading] = useState(false);
    const [isPurchasesLoading, setIsPurchasesLoading] = useState(false);
    const getPurchasesList = () => {
        setIsPurchasesLoading(true);
        getMethod(
            ApiUrl.purchases,
            (success) => {
                setIsPurchasesLoading(false);
                if (success.code == 200) {
                    console.log('Successfully got purchases list', success.data);
                    setPurchaseAmount(getLastThreeMonthsTotal(success.data));
                } else {
                    console.log('Failed to get purchases list:', success.message);
                }
            },
            (error) => {
                setIsPurchasesLoading(false);
                console.log('Error fetching purchases list:', error);
            }
        );
    };

    const getLastThreeMonthsTotal = (data: any) => {
        const today = new Date();
        var lastThreeMonths: any = [];

        for (let i = 2; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthYear = date.toLocaleString('en-US', { month: 'short' }) + '-' + date.getFullYear().toString().slice(-2);
            lastThreeMonths.push({ month: monthYear, total: 0 });
        }

        data.forEach((item: any) => {
            let itemDate: any;

            // Try parsing the first format (ISO 8601)
            if (moment(item.purchaseDate ? item.purchaseDate : item.credit_note_date).isValid()) {
                itemDate = moment(item.purchaseDate ? item.purchaseDate : item.credit_note_date).toDate();
                console.log('itemDate', itemDate);
            }
            // // Try parsing the second format (DD-MM-YYYY)
            // else if (moment(item.createdAt, 'DD-MM-YYYY', true).isValid()) {
            //     itemDate = moment(item.createdAt, 'DD-MM-YYYY').toDate();
            // }
            const monthYear = itemDate.toLocaleString('en-US', { month: 'short' }) + '-' + itemDate.getFullYear().toString().slice(-2);
            console.log('monthYear', monthYear)
            const found = lastThreeMonths.find((m: { month: string; }) => m.month === monthYear);
            if (found) {
                found.total += parseFloat(item.TotalAmount); // Assuming your data has an `amount` field
            }
        });

        return lastThreeMonths;
    }


    const getSalesReportList = () => {
        setIsSalesLoading(true);
        getMethod(
            ApiUrl.salesAndSalesReturn,
            (success) => {
                setIsSalesLoading(false);
                if (success.code === 200) {
                    console.log('Successfully got sales report', success.data);
                    setSalesAmount(getLastThreeMonthsTotal(success.data));
                } else {
                    console.log('Failed to get sales report:', success.message);
                }
            },
            (error) => {
                setIsSalesLoading(false);
                console.log('Error fetching sales report:', error);
            }
        );
    };


    useEffect(() => {
        if (isFocused) {
            getPurchasesList();
            getSalesReportList();
        }
    }, [isFocused]);

    return (
        <View style={{ height: 400, width: '100%', alignSelf: 'center', backgroundColor: colors.white, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, }}>
            <View style={[mh15, mv15, flexRow, alignItemCenter, justifyBetween]}>
                <Text style={[commonStyles.h16BlackOne700]}>{labels.paymentStatics}</Text>
                <Text style={[commonStyles.h14BlackTwo400]}> Last 3 months </Text>
                
            </View>
            <View style={[{ borderBottomWidth: 1, borderBottomColor: colors.greyTwo }, mh15, mb15]} />

            <Text style={[commonStyles.h12BlackTwo500,mh15, mv10, mt0]} >{labels.totalPurchaseAmount}<Text style={[commonStyles.h14blackOne600,mh15, mt5]} >{currencySymbol}{purchaseAmount.map((item: any) => item.total).reduce((a: any, b: any) => a + b, 0)}</Text></Text>
            <Text style={[commonStyles.h12BlackTwo500,mh15, mv10, mt0]} >{labels.totalSalesAmount}<Text style={[commonStyles.h14blackOne600,mh15, mt5]} >{currencySymbol}{salesAmount.map((item: any) => item.total).reduce((a: any, b: any) => a + b, 0)}</Text></Text>
            <View style={[mh10, mv10]}>
                {(!isSalesLoading && !isPurchasesLoading && purchaseAmount && salesAmount.length == 3 && purchaseAmount.length == 3) ? <BarChartDiagram purchaseAmount={purchaseAmount} salesAmount={salesAmount} /> :
                    <View style={{ height: 200, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                        <LoadingIndicator />
                    </View>
                }
            </View>
        </View>
    )
}

export default PaymentStatics;