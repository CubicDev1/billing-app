import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomNavBar from '../../components/bottomNavBar';
import { TopHeader } from '../../components/commonComponents';
import { invoiceTemplatesData } from '../../utils/data/settingsData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { mh15, mv15, mv5 } from '../../utils/theme/commonStyles';
import { commonStyles } from '../../utils/commonStyles';

export type InvoiceTemplatesProps = {};

const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 1.84 - 15; // Adjusted item width to accommodate two items in a row

const InvoiceTemplates = (props: InvoiceTemplatesProps) => {
    const [activeId, setActiveId] = useState<number | null>(1);
    

    const handleItemClick = (id: number) => {
        setActiveId(id);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.whiteTwo }}>
            <View style={mh15}>
                <View style={mv15}>
                    <TopHeader headerText={labels.invoiceTemplates} searchIcon={false}  />
                </View>
                 <View style={[commonStyles.bottomWidth,mv5]}  />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{paddingBottom:'50%'}}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {invoiceTemplatesData.map((data, index) => {
                            const isActive = activeId === data.id;
                            return (
                                <View key={index} style={{ marginVertical: 6 }}>
                                    <TouchableOpacity onPress={() => handleItemClick(data.id)}>
                                        <View style={{ backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: isActive ? colors.primary : '#D9E0E9', width: itemWidth }}>
                                            <Image source={data.image} style={{ height: 170, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
                                            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[commonStyles.h14blackOne500]}>{'General Invoice ' + data.id}</Text>
                                                <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor:isActive?colors.primary: colors.whiteThree, justifyContent: 'center', alignItems: 'center' }}>
                                                    <CustomIcon name={isActive ? 'star' : 'star-o'} size={9} color={isActive ? colors.white : colors.blackTwo} type={'FontAwesome'} />
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                    </View>
                </ScrollView>
            </View>
            <BottomNavBar />
        </View>
    );
};

export default InvoiceTemplates;
