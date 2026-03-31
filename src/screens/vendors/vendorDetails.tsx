import React, { Fragment } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignSelfCenter, flex1, mh15, mv10, mv15 } from '../../utils/theme/commonStyles';
import { commonStyles, getMainContainerStyle, getTopNotchStyle } from '../../utils/commonStyles';

export type vendorDetailsProps = {

}


const VendorDetails = ({ route }) => {

    const { vendorsDatas } = route.params
    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>

                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader headerText={labels.vendorDetails} />
                            </View>
                            <ScrollView>
                                <View style={{ paddingBottom: '50%' }}>
                                    <View style={{ marginVertical: 8 }}>
                                       <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.name}</Text>
                                        <View style={styles.input}>
                                            <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]}>{vendorsDatas.vendor_name}</Text>
                                        </View>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.email}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]}>{vendorsDatas.vendor_email}</Text>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]}>{labels.phoneNumber}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]}>{vendorsDatas.vendor_phone}</Text>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]} >{labels.closingBalance}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]}>{vendorsDatas.balance}</Text>
                                    </View>
                                   <Text style={[commonStyles.h14blackOne600,mv10]}>{'Mode'}</Text>
                                    <View style={styles.input}>
                                        <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >{vendorsDatas.balanceType}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

export default VendorDetails;

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
})
