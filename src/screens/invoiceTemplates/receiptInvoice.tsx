import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { receiptInvoiceTemplatesData } from '../../utils/data/invoiceTemplatesData';
import { alignSelfCenter, mv5 } from '../../utils/theme/commonStyles';
import { commonStyles } from '../../utils/commonStyles';

export type receiptInvoiceProps = {
    
    }
    
    const { width } = Dimensions.get('window');
    const itemWidth = (width - 40) / 1.84 - 15;

const ReceiptInvoice = (props: receiptInvoiceProps) => {
    return (
        <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {receiptInvoiceTemplatesData.map((data, index) => {
                return (
                    <View key={index} style={{ marginVertical: 6 }}>
                        <View >
                            <View style={{ backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: '#D9E0E9', width: itemWidth }}>
                                <Image source={data.image} style={{ height: 170, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5, marginVertical: 8 }} />
                                <Text style={[commonStyles.h14blackOne500,alignSelfCenter, mv5]}>{'Cash receipt '+data.id}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    </View>
    )
}

export default ReceiptInvoice