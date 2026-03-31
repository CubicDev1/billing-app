import React, { useState } from 'react';
import { Dimensions, Modal, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors } from '../../utils/theme/colors';
import { labels } from '../../utils/labels';
import { alignItemCenter, alignSelfCenter, flexRow, justifyAround, justifyBetween, mb15, mh15, mt10, mt15, mt5, mv15, mv5, p5 } from '../../utils/theme/commonStyles';
import CustomIcon from '../../utils/icons';
import { currencySymbol } from '../../constant/constApi';
import { commonStyles } from '../../utils/commonStyles';

export type invoiceStaticsProps = {
    invoiceStaticsData: any
}


const InvoiceStatics = ({ invoiceStaticsData }: invoiceStaticsProps) => {
    const screenWidth = Dimensions.get('window').width;

    const chartPart = () => {
        const totalPercentage = invoiceStaticsData.reduce((acc, item) => acc + (item.amount == 0 ? 10 : item.amount), 0);
        const containerWidth = screenWidth * 0.85; // 90% of screen width

        return (
            <View style={[mh15, mt10]}>
                <View style={[flexRow, justifyBetween]}>
                    {invoiceStaticsData.map((item) => (
                        <View key={item.id} style={{ marginRight: 10 }}>
                            <View style={{ height: 10, width: 10, backgroundColor: item.color, borderRadius: 20 }} />
                            <Text style={[commonStyles.h12blackTwo600,mt5]} >{item.title}</Text>
                            <Text style={[commonStyles.h12BlackOne600,mt5]} >{currencySymbol}{item.amount}</Text>
                        </View>
                    ))}
                </View>
                <View style={[flexRow, mt15, { width: containerWidth }]}>
                    {invoiceStaticsData.map((item) => {
                        const normalizedWidth = ((item.amount === 0 ? 10 : item.amount) / totalPercentage) * containerWidth;
                        return (
                            <View
                                key={item.id}
                                style={[{ backgroundColor: item.color, width: normalizedWidth, height: 5 }, alignSelfCenter]}
                            />
                        );
                    })}
                </View>
            </View>
        );
    };



    return (
        <View style={{ marginTop: 15, height: 180, width: '100%', alignSelf: 'center', backgroundColor: colors.greyOne, borderRadius: 8 }}>
            <View style={[mh15, mv15, flexRow, alignItemCenter, justifyBetween]}>
                <Text style={[commonStyles.h16BlackOne700]}>{labels.invoiceStatics}</Text>
            </View>
            <View style={[{ borderBottomWidth: 1, borderBottomColor: colors.greyTwo }, mh15, mb15]} />
            {chartPart()}
        </View>
    )
}

export default InvoiceStatics