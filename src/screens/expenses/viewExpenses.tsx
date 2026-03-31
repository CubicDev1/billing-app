import React, { Fragment } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignSelfCenter, flex1, mh10, mh15, mv10, mv15 } from '../../utils/theme/commonStyles';
import { Image } from 'react-native';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type viewExpensesProps = {};

const ViewExpenses = ({ route }) => {
    const { expensesDatas } = route.params;
    console.log('EXPENSES DATA', expensesDatas);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={'View ' + labels.expenses} />
                            </View>
                            <ScrollView>
                                <View style={{ paddingBottom: '50%' }}>
                                                                        <View style={[commonStyles.smallCard,mv10]} >

                                       <Text style={[commonStyles.h12RedTwo500,mh10]} >
                                            Expense ID : {expensesDatas.expenseDetails.expenseId}
                                        </Text>
                                    </View>
                                    <View style={{ marginVertical: 8 }}>
                                       <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.referenceNumber}</Text>
                                        <View style={styles.input}>
                                            <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >
                                                {expensesDatas.expenseDetails.reference}
                                            </Text>
                                        </View>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.amount}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >
                                            {expensesDatas.expenseDetails.amount}
                                        </Text>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.paymentMode}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >
                                            {expensesDatas.expenseDetails.paymentMode}
                                        </Text>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.expenseDate}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >
                                            {formatDate(expensesDatas.expenseDetails.createdAt)}
                                        </Text>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.paymentStatus}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >
                                            {expensesDatas.expenseDetails.status}
                                        </Text>
                                    </View>
                                    {expensesDatas.expenseDetails.attachment && !Array.isArray(expensesDatas.expenseDetails.attachment) ? (<View>
                                       <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.attachment}</Text>
                                        <Image
                                            source={{ uri: expensesDatas.expenseDetails.attachment }}
                                            style={styles.image}
                                        />
                                    </View>) : null}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default ViewExpenses;

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 120,
        height: 120,
        marginVertical: 10,
        justifyContent: 'flex-start',
        borderRadius: 10,
    },
    noImageText: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.blackThree,
        marginBottom: 10,
    },
});
