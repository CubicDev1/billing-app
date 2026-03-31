import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { colors } from '../utils/theme/colors';

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    height: string | number | any;
    children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, height, children }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                <TouchableOpacity style={{  flex: 1, justifyContent: 'flex-end',
                alignItems: 'center',}} onPress={onClose} />
                <View style={{ backgroundColor: colors.white, height: height, padding: 20, borderRadius : 20 }}>
                    {children}
                </View>
            </View>
        </Modal>
    );
}

export default CustomModal;