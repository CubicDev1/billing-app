//import liraries
import React from 'react';
import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { colors } from '../utils/theme/colors';

// create a component
interface OverLaySpinnerProps {
  visible: boolean;
}
export const OverLaySpinner: React.FC<OverLaySpinnerProps> = ({ visible }) => {
  return visible ? (
    <View style={{
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
      zIndex: 9999, // Ensure it appears on top
    }}>
      <ActivityIndicator color={colors.primary} size={'large'} />
    </View>
  ) : (
    <></>
  );
};


// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
// export default OverLaySpinner;
