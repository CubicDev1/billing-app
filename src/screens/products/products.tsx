import { useNavigation, useRoute } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { TabBar, TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, mh10, mv10 } from '../../utils/theme/commonStyles';
import CategoriesList from '../categories/categoriesList';
import UnitsList from '../units/unitsList';
import ProductsList from './productsList';
import DashedLine, { DashedLines } from '../../components/dashedLine';
import { getTopNotchStyle, getMainContainerStyle } from '../../utils/commonStyles';

export type ProductsProps = {};

const Products = (props: ProductsProps) => {
    const [selectedTab, setSelectedTab] = useState(labels.products);
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const selectedTabParam = route.params?.selectedTab ?? labels.products;
        setSelectedTab(selectedTabParam);
    }, [route.params]);

    const tabs = [
        { label: labels.products },
        { label: labels.categories },
        { label: labels.units },
    ];

    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
                        <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                            <TopHeader headerText={selectedTab} />
                            <View style={[mv10]}>
                                <TabBar tabs={tabs} activeTab={selectedTab} onTabPress={handleTabPress} borderRadius={20} width={110} />
                            </View>
                            <View style={[alignItemCenter, mv10]}>
                                {/* <DashedLine height={370} color={colors.greyTwo} dashLength={10} dashGap={0} /> */}
                                <DashedLines color={colors.greyTwo} totalLengthPercentage={90} dashThickness={1} dashGap={0} />
                            </View>
                            {/*  <View style={[commonStyles.bottomWidth]} /> */}
                            {selectedTab === labels.products && (
                                <>
                                    <ProductsList />
                                </>
                            )}
                            {selectedTab === labels.categories && (
                                <>
                                    <CategoriesList />
                                </>
                            )}
                            {selectedTab === labels.units && (
                                <>
                                    <UnitsList />
                                    {/* Your unit filter modal */}
                                </>
                            )}
                        </View>
                        <BottomNavBar />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default Products;
