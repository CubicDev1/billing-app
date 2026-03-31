import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { labels } from '../utils/labels';
import { colors } from '../utils/theme/colors';
import { alignItemCenter, flexRow, justifyBetween, justifyCenter, ml10, mt15 } from '../utils/theme/commonStyles';
import { OnboardingButton } from './commonButton';
import { commonStyles } from '../utils/commonStyles';

interface PopupCardModalProps {
    visible: boolean;
    onClose: () => void;
    handleYesBtn: () => void;
    text: string;
}

const PopupCardModal: React.FC<PopupCardModalProps> = ({ visible, onClose, handleYesBtn, text }) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const handleNobtn = () => {
        setIsActiveBtn(true);
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={[{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }, alignItemCenter, justifyCenter]}>
                <TouchableOpacity style={[alignItemCenter, justifyCenter]} onPress={onClose} />
                <View style={{ backgroundColor: colors.white, height: 200, width: '85%', padding: 20, borderRadius: 20, alignItems: 'center' }}>
                    <Text style={[commonStyles.h24BlackOne700]}>Are You Sure?</Text>
                    <Text style={[commonStyles.h15blackTwo400,mt15]}>{text}</Text>
                    <View style={[flexRow, justifyBetween, { marginTop: 30 }]}>
                        <OnboardingButton
                            width={130}
                            title={labels.no}
                            onChange={handleNobtn}
                            backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                            color={isActiveBtn ? colors.white : colors.blackOne}
                        />
                        <View style = {[ml10]}>
                            <OnboardingButton
                                width={130}
                                title={labels.yes}
                                onChange={handleYesBtn}
                                backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                                color={isActiveBtn ? colors.blackOne : colors.white}
                            />
                        </View>

                    </View>
                </View>

            </View>
        </Modal>
    );
}

export default PopupCardModal;
