import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import CustomIcon from '../utils/icons';
import { colors } from '../utils/theme/colors';
import { alignItemCenter, flexRow, justifyCenter, mh15 } from '../utils/theme/commonStyles';
import { commonStyles, getLongButtonStyle, getTextColorStyle } from '../utils/commonStyles';

export type LongPurpleButtonProps = {
  title: string;
  width?: number | string;
  height?: number | string;
  onChange?: () => void;
  backgroundColor?: string;
  color?: any;
  icon?: boolean;
  disabled?: boolean;
};

export const OnboardingButton: React.FC<LongPurpleButtonProps> = ({
  title,
  onChange,
  backgroundColor,
  color,
  icon,
  width = '100%',
  height,
  disabled,
}) => {
  return (
    <View>
      <TouchableOpacity
        style={[
          commonStyles.longButton,
          getLongButtonStyle({ width, height, backgroundColor })
        ]}
        onPress={onChange}
        disabled={disabled}
      >
        <View style={[flexRow, justifyCenter, alignItemCenter]}>
          <Text style={[commonStyles.h14primary600, getTextColorStyle(color)]}>
            {title}
          </Text>

          {icon && (
            <View style={[mh15]}>
              <CustomIcon
                name="arrowright"
                size={16}
                color={colors.white}
                type="AntDesign"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
