import React from 'react';
import { View, StyleSheet , Modal} from 'react-native';
import DatePicker from 'react-native-neat-date-picker';
import { colors } from '../utils/theme/colors';

export type CommonDatePickerProps = {
  showDatePickerSingle: boolean;
  onCancelSingle: () => void;
  onConfirmSingle: (date: Date) => void;
  date?: boolean;
  minDate?: boolean;
};

export const CommonDatePicker: React.FC<CommonDatePickerProps> = ({
  showDatePickerSingle,
  onCancelSingle,
  onConfirmSingle,
  date,
  minDate
}) => {
  return (
    <Modal
      visible={showDatePickerSingle}
      // backdropOpacity={0.5}
      transparent={true}
      backdropColor = 'rgba(0,0,0,0.2)'
      animationType='fade'
      onRequestClose={onCancelSingle} // Close when clicking outside
      onTouchCancel={onCancelSingle} // Android back button support
      // useNativeDriver
    >
      <View style={styles.modalContainer}>
        <DatePicker
          isVisible={showDatePickerSingle}
          mode={'single'}
          onCancel={onCancelSingle}
          maxDate={date ? new Date() : undefined}
          minDate={minDate ? new Date() : undefined}
          onConfirm={(date) => onConfirmSingle(date as Date)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderRadius: 10,
    alignItems: 'center',
    
  },
});
