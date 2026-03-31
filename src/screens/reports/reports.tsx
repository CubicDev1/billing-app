import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { TopHeader } from '../../components/commonComponents';
import { reportsListData } from '../../utils/data/reportsData';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { mh15, mv15, mv5, textAlignCenter } from '../../utils/theme/commonStyles';
import { commonStyles } from '../../utils/commonStyles';

export type reportsProps = {};

const ReportsScreen = (props: reportsProps) => {
    const navigation = useNavigation();

    const handleSettingsItemPress = (moveTo: any) => {
        navigation.navigate(moveTo);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.whiteTwo }}>
            <View style={mh15}>
                <View style={mv15}>
                    <TopHeader
                        headerText={labels.reports}
                    />
                </View>
                 <View style={[commonStyles.bottomWidth,mv5]} />
                <ScrollView>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 2, flexWrap: 'wrap', marginVertical: 15, justifyContent: 'flex-start' }}>
                            {reportsListData.map((data, index) => (
                                <View key={index} style={{ width: '30%', marginBottom: 15, marginRight: index % 3 === 2 ? 0 : '5%' }}>
                                    <View style={{ backgroundColor: 'white', height: 100, borderRadius: 5, elevation: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                        <TouchableOpacity
                                            style={{ height: 40, width: 40, backgroundColor: colors.greyOne, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}
                                            onPress={() => handleSettingsItemPress(data.moveTo)}
                                        >
                                            <Image source={data.iconImg} style={{ height: 20, width: 20 }} />
                                        </TouchableOpacity>
                                        <Text style={[commonStyles.h12BlackTwo500,textAlignCenter]} >{data.title}</Text>
                                    </View>
                                </View>
                            ))}

                            {/* Add Placeholder if the last row has only 2 items */}
                            {reportsListData.length % 3 === 2 && (
                                <View style={{ width: '30%', marginBottom: 15 }} />
                            )}
                        </View>
                    </ScrollView>
                </ScrollView>
            </View>
            <BottomNavBar />
        </View>
    );
};

export default ReportsScreen;
