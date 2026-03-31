import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { colors } from '../utils/theme/colors';

interface DashedLineProps {
  height: number;
  color?: string;
  dashLength?: number;
  dashGap?: number;
  style?: ViewStyle;
}

const DashedLine = ({
  height,
  color = '#000000',
  dashLength = 5,
  dashGap = 3,
  style,
}: DashedLineProps) => {
  const calcDashStyle = () => {
    return {
      width: dashLength,
      height: 1, // Fixed height for vertical dashed line
      backgroundColor: color,
      marginLeft: dashGap / 2,
      marginRight: dashGap / 2,
    };
  };

  return (
    <View style={[styles.container, style]}>
      {[...Array(Math.floor(height / (dashLength + dashGap))).keys()].map((index) => (
        <View key={index} style={calcDashStyle()} />
      ))}
    </View>
  );
};

export default DashedLine;

interface DashedBorderViewProps {
  children: ReactNode;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
}

export const DashedBorderView: React.FC<DashedBorderViewProps> = ({
  children,
  borderColor = colors.greyTwo,
  borderWidth = 1,
  borderStyle = 'solid',
}) => {
  const borderStyles: ViewStyle = {
    borderWidth: borderWidth,
    borderStyle: borderStyle,
    borderColor: borderColor,
  };

  return <View style={[styles.containerTwo, borderStyles]}>{children}</View>;
};


interface DashedLinesProps {
  color?: string;
  totalLengthPercentage?: number; // Total length of dashed lines as a percentage of screen width
  dashThickness?: number;
  dashGap?: number;
  style?: object;
}

export const DashedLines: React.FC<DashedLinesProps> = ({
  color = '#000',
  totalLengthPercentage = 30, // Default total length of dashed lines is 30% of the screen width
  dashThickness = 1,
  dashGap = 2,
  style = {},
}) => {
  const screenWidth = Dimensions.get('window').width;
  const totalLength = (screenWidth * totalLengthPercentage) / 100; // Total length of the dashed lines
  const dashLength = totalLength / 20; // Each dash is a fraction of the total length
  const dashCount = Math.floor(totalLength / (dashLength + dashGap)); // Calculate how many dashes fit within the total length

  return (
    <View style={[styles.lineContainer, style]}>
      {Array.from({ length: dashCount }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dash,
            {
              backgroundColor: color,
              width: dashLength,
              height: dashThickness,
              marginRight: dashGap,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerTwo: {
    borderStyle: 'dashed',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8
  },
  // lineContainer: {
  //   flexDirection: 'row',
  //   width: '100%',
  //   alignItems: 'center',
  // },
  // dash: {
  //   borderRadius: 2, // Optional for rounded edges
  // },
  lineContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  dash: {
    marginRight: 2, // default gap between dashes
  },
});