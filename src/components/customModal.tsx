import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

const CustomModal = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
                    <Text>{message}</Text>
                    <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
                        <Text style={{ color: 'blue' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;
