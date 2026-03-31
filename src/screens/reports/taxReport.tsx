import React, { Fragment, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { TabBar, TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, mh15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import PurchaseTaxReport from './purchaseTaxReport';
import SalesTaxReport from './salesTaxReport';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type TaxReportProps = {

};

const TaxReport = (props: TaxReportProps) => {
    const [selectedTab, setSelectedTab] = useState(labels.purchaseTax);

    const tabs = [{ label: labels.purchaseTax }, { label: labels.salesTax }];

    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={[mh15]}>
                            <View style={[mv15]}>
                                <TopHeader headerText={labels.taxReport} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv10]}  />
                            <View style={[mv5]}>
                                <TabBar tabs={tabs} activeTab={selectedTab} onTabPress={handleTabPress} borderRadius={50} width={150} />
                            </View>
                            <View style={{ paddingBottom: 80}}>
                                {selectedTab === labels.purchaseTax && (
                                    <PurchaseTaxReport />
                                )}
                                {selectedTab === labels.salesTax && (
                                    <SalesTaxReport />
                                )}
                            </View>
                        </View>
                        <BottomNavBar />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default TaxReport;
