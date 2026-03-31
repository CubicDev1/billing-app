// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import { View } from 'react-native';
// import BottomNavBar from '../../components/bottomNavBar';
// import { ListSubHeader, TabBar, TopHeader } from '../../components/commonComponents';
// import { labels } from '../../utils/labels';
// import { colors } from '../../utils/theme/colors';
// import { flex1, mv10 } from '../../utils/theme/commonStyles';
// import GeneralInvoice from './generalInvoice';

// export type InvoiceTemplatesProps = {

//     }


// const InvoiceTemplatesScreen = (props: InvoiceTemplatesProps) => {

//     const [selectedTab, setSelectedTab] = useState(labels.general);
//     const [total, setTotal] = useState('06');

//     const navigation = useNavigation();

//     const tabs = [
//         { label: labels.general, total: '06' },
//         { label: labels.purchase, total: '05' },
//         { label: labels.receipt, total: '06' },
//     ];

//     const handleTabPress = (tab: string) => {
//         setSelectedTab(tab);
//         const tabData = tabs.find(item => item.label === tab);
//         if (tabData) {
//             setTotal(tabData.total);
//         }
//     };



//     return (
//         <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>

//         <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
//             <TopHeader headerText={selectedTab} searchIcon={true} searchName={selectedTab} searchText={'Search ' + selectedTab}/>
//             <View style={[mv10,]}>
//                 <TabBar tabs={tabs} activeTab={selectedTab} onTabPress={handleTabPress} borderRadius={50}/>
//             </View>
//              <View style={[commonStyles.bottomWidth]} />

//             <ListSubHeader listName={selectedTab} totalNumber={total}  filterIcon={false}/>
//             {selectedTab === labels.general && (
//                 <GeneralInvoice />
//             )}
//             {selectedTab === labels.purchase && (
//                 console.log('')

//             )}
//             {selectedTab === labels.receipt && (
//                 console.log('')

//             )}
//         </View>
//         <BottomNavBar />
//     </View>
//     )
// }

// export default InvoiceTemplatesScreen

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { ListSubHeader, TabBar, TopHeader } from '../../components/commonComponents';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, mv10 } from '../../utils/theme/commonStyles';
import GeneralInvoice from './generalInvoice';
import PurchaseInvoice from './purchaseInvoice';
import ReceiptInvoice from './receiptInvoice';
import { commonStyles } from '../../utils/commonStyles';

export type InvoiceTemplatesProps = {};

const InvoiceTemplatesScreen = (props: InvoiceTemplatesProps) => {
    const [selectedTab, setSelectedTab] = useState(labels.general);
    const [total, setTotal] = useState('06');

    const navigation = useNavigation();

    const tabs = [
        { label: labels.general, total: '06' },
        { label: labels.purchase, total: '05' },
        { label: labels.receipt, total: '06' },
    ];

    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
        const tabData = tabs.find((item) => item.label === tab);
        if (tabData) {
            setTotal(tabData.total);
        }
    };

    return (
        <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                <TopHeader
                    headerText={selectedTab}
                    searchIcon={true}
                    searchName={selectedTab}
                    searchText={'Search ' + selectedTab}
                />
                <View style={[mv10]}>
                    <TabBar tabs={tabs} activeTab={selectedTab} onTabPress={handleTabPress} borderRadius={50} />
                </View>
                 <View style={[commonStyles.bottomWidth]} />

                <ScrollView>
                    <View style={{ paddingBottom: '50%' }}>
                        <ListSubHeader listName={selectedTab} totalNumber={total} filterIcon={false} />
                        {selectedTab === labels.general && <GeneralInvoice />}
                        {selectedTab === labels.purchase && <PurchaseInvoice />}
                        {selectedTab === labels.receipt && <ReceiptInvoice />}
                    </View>
                </ScrollView>
            </View>
            <BottomNavBar />
        </View>
    );
};

export default InvoiceTemplatesScreen;
