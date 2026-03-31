import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../utils/theme/colors';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { mv15, alignSelfCenter, mh10, mv5, mt5, flexRow, alignItemCenter, justifyBetween, justifyCenter, mr10, ml10, flex1, mb15, mb10 } from '../../utils/theme/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../utils/screenNames';
import { commonStyles } from '../../utils/commonStyles';


const FrequentCustomers: React.FC<{ recentCustomers: any }> = ({ recentCustomers }) => {
    const navigation = useNavigation();
    return (
        <View style={[{ backgroundColor: colors.blackOne, height: 100, width: '100%', borderRadius: 8 }, mv15, alignSelfCenter]}>
            <View style={[mh10, mv5, mt5, flexRow, alignItemCenter, justifyBetween]}>
                <Text style={[commonStyles.h15white400, { textAlign: 'center' }]}>{labels.frequentCustomers}</Text>
                <TouchableOpacity onPress={() => navigation.navigate(screenName.CustomersScreen as never)}>
                    <Text style={[commonStyles.h14White400Underline]}>{labels.seeAll}</Text>
                </TouchableOpacity>
            </View>
            <View style={[flexRow, mt5]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <View style={[mh10, { alignItems: 'flex-start', width: 45 }]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(screenName.AddCustomersScreen as never)}
                                style={[alignItemCenter, justifyCenter, { height: 40, width: 40, borderRadius: 100, backgroundColor: colors.white }]}
                            >
                                <CustomIcon color={colors.blackOne} size={16} name='add' type='MaterialIcons' />
                            </TouchableOpacity>
                            <View style={[alignItemCenter]}>
                                <Text style={[commonStyles.h10White600,mt5]}>{"Add New"}</Text>
                                <Text style={[commonStyles.h10White600,mt5]} numberOfLines={1} ></Text>
                            </View>
                        </View>

                        {recentCustomers.map((item: any) => (
                            <TouchableOpacity onPress={() => {
                                (navigation as any).navigate(screenName.CustomerDetails, { UserDetails: item } as never)
                            }} key={item.id} style={[mh10, { alignItems: 'flex-start', maxWidth: 60 }]}>
                                <View style={[alignItemCenter]}>
                                    <View style={[{ height: 40, width: 40, borderRadius: 100, backgroundColor: colors.primary }, alignItemCenter, justifyCenter]}>
                                        <Text style={[commonStyles.h10White600]}>{item.name.charAt(0).toUpperCase()}</Text>
                                    </View>
                                    <Text style={[commonStyles.h10White600,mt5]} numberOfLines={1}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View >
        </View >
    );
}

export default FrequentCustomers;
