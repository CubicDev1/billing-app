import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import styled from "styled-components";
import { colors } from "./theme/colors";
import { alignItemCenter, bg_color_primary, bg_color_white, border_radius10, border_radius5, bottom_width05, flex1, flexRow, h50, justifyBetween, justifyCenter, mh5, mv15, mv5, p10, ph10, size_10, size_12, size_14, size_15, size_16, size_18, size_24, size_28, size_32, weight_400, weight_500, weight_600, weight_700 } from "./theme/commonStyles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface TextProps {
    color?: string;
}

const backgroundColor = 'backgroundColor';
const justifyContent = 'justifyContent';
const paddingVertical = 'paddingVertical';
const paddingHorizontal = 'paddingHorizontal';
const marginHorizontal = 'marginHorizontal';
const marginVertical = 'marginVertical';
const borderRadius = 'borderRadius';
const alignItems = 'alignItems';
const flexDirection = 'flexDirection';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainContainer: {
        flex: 1,
    },
    subContainer: {
        flex: 1,
        // paddingHorizontal: 20,
    },
    couponModal: {
        backgroundColor: colors.white,
        height: 90,
        width: '95%',
        margin: 10,
        elevation: 6,
        borderRadius: 5
    }
});

const {
    row,
    mainContainer,
    subContainer,
} = styles;

//Text
export const H18white700 = styled(Text)`
    color :${colors.white};
    ${size_18};
    ${weight_700};
`
export const RowView = styled(View) <{ height?: number }>`
  ${row};
  ${props => (props.height ? 'height:' + props.height + 'px;' : '')}
`;

export const KeyboardAScrollView = styled(KeyboardAwareScrollView).attrs({
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'handled',
    enableAutomaticScroll: true,
    extraHeight: Platform.OS == 'ios' ? 90 : 75,
})``;

export const TopNotch = styled(SafeAreaView) <{ secondary?: boolean }>`
  flex: 0;
  ${backgroundColor}: ${props =>
        props.secondary ? colors.primary : colors.white};
`;

export const MainContainer = styled(SafeAreaView) <{ secondary?: boolean }>`
  ${mainContainer};
  ${backgroundColor}: ${props =>
        props.secondary ? colors.primary : colors.white};
`;

export const SubContainer = styled(View) <{
    secondary?: boolean;
    space_between?: boolean;
}>`
  ${subContainer};
  ${backgroundColor}: ${props =>
        props.secondary ? colors.primary : colors.white};
  ${props => (props.space_between ? 'justifyContent:space-between' : '')}
`;

export const H24BlackOne700 = styled(Text)`
    color :${colors.blackOne};
    ${size_24};
    ${weight_700};
`

export const H16white700 = styled(Text)`
    color :${colors.white};
    ${size_16};
    ${weight_700};
`
export const H12whiteOne600 = styled(Text)`
    color :${colors.whiteOne};
    ${size_12};
    ${weight_600};
`
export const H28white700 = styled(Text)`
    color :${colors.white};
    ${size_28};
    ${weight_600};
`
export const H12white600 = styled(Text)`
    color :${colors.white};
    ${size_12};
    ${weight_600};
`

export const H12BlackOne600 = styled(Text)`
    color :${colors.blackOne};
    ${size_12};
    ${weight_600};
`
export const H12BlackTwo600 = styled(Text)`
    color :${colors.blackTwo};
    ${size_12};
    ${weight_600};
`
export const H12BlackTwo500 = styled(Text)`
    color :${colors.blackTwo};
    ${size_12};
    ${weight_500};
`
export const H12Blue600 = styled(Text)`
    color :${colors.blue};
    ${size_12};
    ${weight_600};
`
export const H14blackOne600 = styled(Text)`
    color :${colors.blackOne};
    ${size_14};
    ${weight_600};
`
export const H10blackTwo600 = styled(Text)`
    color :${colors.blackTwo};
    ${size_10};
    ${weight_600};
`
export const H12blackTwo600 = styled(Text)`
    color :${colors.blackTwo};
    ${size_12};
    ${weight_600};
`
export const H12redFour600 = styled(Text)`
    color :${colors.redFour};
    ${size_12};
    ${weight_600};
`
export const H12GreyTwo400 = styled(Text)`
    color :${colors.greyTwo};
    ${size_12};
    ${weight_400};
`
export const H14blackTwo600 = styled(Text)`
    color :${colors.blackTwo};
    ${size_14};
    ${weight_600};
`
export const H14blackTwo400 = styled(Text)`
    color :${colors.blackTwo};
    ${size_14};
    ${weight_400};
`
export const H14blackOne500 = styled(Text)`
    color :${colors.blackOne};
    ${size_14};
    ${weight_500};
`
export const H14White400Underline = styled(Text)`
    color :${colors.white};
    ${size_14};
    ${weight_400};
    text-decoration-line: underline;
`
export const H14Primary400Underline = styled(Text)`
    color :${colors.primary};
    ${size_14};
    ${weight_400};
    text-decoration-line: underline;
`
export const H12Primary400 = styled(Text)`
    color :${colors.primary};
    ${size_12};
    ${weight_400};
`
export const H12Primary600 = styled(Text)`
    color :${colors.primary};
    ${size_12};
    ${weight_600};
`
export const H10grey600 = styled(Text)`
    color :${colors.grey};
    ${size_10};
    ${weight_600};
`
export const H10White600 = styled(Text)`
    color :${colors.white};
    ${size_10};
    ${weight_600};
`
export const H10green600 = styled(Text)`
    color :${colors.green};
    ${size_10};
    ${weight_600};
`
export const H10Danger600 = styled(Text)`
    color :${colors.danger};
    ${size_10};
    ${weight_600};
`
export const H16BlackOne700 = styled(Text)`
    color :${colors.blackOne};
    ${size_16};
    ${weight_700};
`

export const H16BlackOne500 = styled(Text)`
    color :${colors.blackOne};
    ${size_16};
    ${weight_500};
`
export const H32white700 = styled(Text)`
    color :${colors.white};
    ${size_32};
    ${weight_700};
`
export const H15white400 = styled(Text)`
    color :${colors.white};
    ${size_15};
    ${weight_400};
`
export const H18BlackOne700 = styled(Text)`
    color :${colors.blackOne};
    ${size_18};
    ${weight_700};
`

export const H16White700 = styled(Text)`
    color :${colors.white};
    ${size_16};
    ${weight_700};
`
export const H16greySix700 = styled(Text)`
    color :${colors.greySix};
    ${size_16};
    ${weight_700};
`
export const H14greySix600 = styled(Text)`
    color :${colors.greySix};
    ${size_14};
    ${weight_600};
`
export const H16Primary700 = styled(Text)`
    color :${colors.primary};
    ${size_16};
    ${weight_700};
`
export const H14400 = styled(Text)`
    ${size_14};
    ${weight_400};
`

export const H14primary600 = styled(Text) <TextProps>`
    color: ${(props) => props.color || colors.primary};
    ${size_14};
    ${weight_600};
`;
export const H28blackOne700 = styled(Text)`
    color :${colors.blackOne};
    ${size_28};
    ${weight_700};
    `
export const H16blackTwo400 = styled(Text)`
    color :${colors.blackTwo};
    ${size_16};
    ${weight_400};
    `
export const H14Weight_600 = styled(Text)`
    ${size_14};
    ${weight_600};
    `
export const H18blackOne700 = styled(Text)`
    ${size_18};
    ${weight_700};
    color:${colors.blackOne};
    `

export const H10white600 = styled(Text)`
    ${size_10};
    ${weight_600};
    color:${colors.white};
    `
export const H10primary600 = styled(Text)`
    ${size_10};
    ${weight_600};
    color:${colors.primary};
    `
export const H15blackOne600 = styled(Text)`
    ${size_15};
    ${weight_600};
    color:${colors.blackOne};
    `
export const H15blackOne500 = styled(Text)`
    ${size_15};
    ${weight_500};
    color:${colors.blackOne};
    `
export const H15blackTwo400 = styled(Text)`
    ${size_15};
    ${weight_400};
    color:${colors.blackTwo};
    `
export const H12redTwo600 = styled(Text) <TextProps>`
    ${size_12};
    ${weight_600};
    color: ${(props) => props.color || colors.redTwo};
    `
export const H12redTwo500 = styled(Text) <TextProps>`
    ${size_12};
    ${weight_500};
    color: ${(props) => props.color || colors.redTwo};
    `
export const H12danger600 = styled(Text)`
    ${size_12};
    ${weight_600};
    color:${colors.danger};
    `
export const H16danger600 = styled(Text)`
    ${size_16};
    ${weight_600};
    color:${colors.danger};
    `
export const H12blackTwo400 = styled(Text)`
    ${size_12};
    ${weight_400};
    color:${colors.blackTwo};
    `

export const H12blackOne400 = styled(Text)`
    ${size_12};
    ${weight_400};
    color:${colors.blackOne};
    `
export const H14Danger400 = styled(Text)`
    ${size_14};
    ${weight_400};
    color:${colors.danger};
    `
export const H14GreenOne400 = styled(Text)`
    ${size_14};
    ${weight_400};
    color:${colors.greenOne};
    `
//View
export const SplashScreenContainer = styled(View)`
    ${flex1};
    ${justifyCenter};
    ${alignItemCenter};
`;
export const OnboardingContainer = styled(View)`
    ${flex1};
    ${justifyCenter};
    ${alignItemCenter};
    ${bg_color_primary};
`;
export const MainListCard = styled(TouchableOpacity)`
    ${bg_color_white};
    ${p10};
    ${border_radius10};
    ${mv5};
    ${mh5};
    elevation:1;
`;
interface SmallCardProps {
    backgroundColor?: string;
    marginVertical?: number;
}
export const SmallCard = styled(View) <SmallCardProps>`
height:25px;
backgroundColor: ${props => props.backgroundColor || colors.redOne}; 
${border_radius5};
${justifyCenter};
${alignItemCenter};
`
export const BottomWidth = styled(View) <SmallCardProps>`
  ${bottom_width05};
  borderColor: ${colors.greyTwo};
`;
interface ViewProps {
    height?: number;
    width?: number;
}
export const IconInputContainer = styled(View) <ViewProps>`
borderWidth: 1px;
borderColor:${colors.greyFive};
${border_radius10};
backgroundColor:${colors.greyOne};
${alignItemCenter};
${justifyBetween};
${flexRow};
${ph10}
height: ${props => props.height || '38px'}; 
width: ${props => (props.width ? `${props.width}px` : '100%')};
`;
//TouchableOpacity

interface LongButtonProps {
    width?: number
    backgroundColor?: string;
    height?: number,
}

export const LongButton = styled(TouchableOpacity) <LongButtonProps>`
    ${h50};
    ${props => props.width && `width: ${props.width}px;`};
    ${props => props.height && `width: ${props.height}px;`};
    ${border_radius10};
    ${justifyCenter};
    ${alignItemCenter};
    background-color: ${props => props.backgroundColor || colors.white}; 
    ${mv15};
    `;
//TextInput

export const InputData = styled(TextInput)`
${size_14};
${weight_400};
`;