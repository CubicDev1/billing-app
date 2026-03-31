import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { quickAccessData } from '../../utils/data/dashboardData';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, justifyCenter, mt5, ph15 } from '../../utils/theme/commonStyles';
import { labels } from '../../utils/labels';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../../utils/commonStyles';

const QuickAccess = () => {
    const chunkData = [];
    for (let i = 0; i < quickAccessData.length; i += 2) {
        chunkData.push(quickAccessData.slice(i, i + 2));
    }
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={[commonStyles.h16BlackOne700]}>{labels.quickAccess}</Text>
            <FlatList
                data={chunkData}
                horizontal
                renderItem={({ item }) => (
                    <View style={styles.columnContainer}>
                        {item.map(icon => (
                            <TouchableOpacity onPress={() => navigation.navigate(icon.screenName as never)} key={icon.id} style={[{ alignItems: 'center', }, mt5]}>
                                <View
                                    style={[
                                        {
                                            height: 50,
                                            // width: 50,
                                            borderRadius: 8,
                                            backgroundColor: colors.whiteThree,
                                        },
                                        alignItemCenter,
                                        justifyCenter,
                                        ph15,
                                    ]}
                                >
                                    <icon.SvgImage width={30} height={30} />
                                </View>
                                <View style={{ minHeight: 40, justifyContent: 'center' }}>
                                    {/* {icon.title.includes(' ') ? (
                                        icon.title.split(' ').map((word, index) => (
                                            <Text style={[commonStyles.h10blackTwo600]} key={index} style={styles.word}>
                                                {word}
                                            </Text>
                                        ))
                                    ) : (
                                        <Text style={[commonStyles.h10blackTwo600]} style={styles.word}>{icon.title}</Text>
                                    )} */}
                                        <Text style={[commonStyles.h10blackTwo600,styles.word]} >{icon.title}</Text>

                                </View>
                            </TouchableOpacity>

                        ))}
                    </View>
                )}
                keyExtractor={(item, index) => `row-${index}`}
                contentContainerStyle={styles.flatListContainer}
                showsHorizontalScrollIndicator={false}
            />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    flatListContainer: {
        paddingVertical: 10,
    },
    columnContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        width: Dimensions.get('window').width / 4.5,
    },
    icon: {
        fontSize: 24,
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
        color: '#333',
    },
    word: {
        lineHeight: 16, // You can adjust the line height as needed
        textAlign: 'center',
    },
});

export default QuickAccess;