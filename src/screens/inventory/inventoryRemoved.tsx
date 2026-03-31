import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { DevWidth } from '../../utils/device';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, bg_color_white, flex1, justifyCenter, mv5, textAlignCenter } from '../../utils/theme/commonStyles';
import { commonStyles } from '../../utils/commonStyles';

export type InventoryRemovedProps = {

}


const InventoryRemoved = (props: InventoryRemovedProps) => {
    const navigation=useNavigation()
    return (
        <View style={[flex1, bg_color_white, justifyCenter, alignItemCenter]}>
            <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.redFive, marginVertical: 10, borderRadius: 30 }}>
                <CustomIcon name={'cross'} size={35} color={colors.danger} type={'Entypo'} />
            </View>
            <Text style={[commonStyles.h18BlackOne700,{}]} >{labels.removedSuccessfully}</Text>
            <Text style={[commonStyles.h15blackTwo400,mv5,textAlignCenter]}>{"Stock has been removed from the \n inventory successfully"}</Text>
            <View style={styles.bottomButtonsContainer}>
            <OnboardingButton
                width={DevWidth / 1.1}
                title={labels.backToInventory}
                onChange={()=>navigation.navigate(screenName.InventoryList as never)}
                backgroundColor={colors.primary}
                color={colors.white}
            />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 15,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
export default InventoryRemoved