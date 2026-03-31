import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomerSearchExpanded, ExpandableSection } from '../../components/commonComponents';
import { vendorsData } from '../../utils/data/vendorsData';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, mv10 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { commonStyles } from '../../utils/commonStyles';

export type SettingsComponentsProps = {
    onSave: () => void;
    onCancel: () => void;
};


export const VendorFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');


    const [noData, setNoData] = useState(false);

    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    const handleSaveBtnClick = () => {
        setIsActiveBtn(false);
        if (!checkDataExists()) {
            setNoData(true);
        } else {
            setNoData(false);
            onSave();
        }
    };

    const checkDataExists = () => {
        return (
            searchValueProductType.trim() !== ''
        )
    };

    const productTypes = vendorsData.map(item => item.name);

    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { }} toggleBtn={() => { }} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.vendor}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Vendor"
                                    data={productTypes}
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                        <View style={[commonStyles.bottomWidth, mv10]} />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomButtonsContainer}>
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={labels.cancel}
                    onChange={handleCancelBtnClick}
                    backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                    color={isActiveBtn ? colors.white : colors.blackOne}
                />
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={labels.apply}
                    onChange={handleSaveBtnClick}
                    backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                    color={isActiveBtn ? colors.blackOne : colors.white}
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

