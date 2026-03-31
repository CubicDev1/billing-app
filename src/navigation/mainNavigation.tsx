import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./stackNavigation";
import { RootStateProps } from "../interfaces/generalProps";
import { OverLaySpinner } from "../components/overLay";
import { connect } from "react-redux";
import { ActivityIndicator, Modal, View } from "react-native";
import { colors } from "../utils/theme/colors";
import { StyleSheet } from "react-native";

interface MainNavigationProps {
    initialRouteName: string;
    spinnerFlag: boolean;
};
const mapStateToProps = (state: any) => ({
    spinnerFlag: state.Reducer.spinnerFlag,
});

const MainNavigation = (props: MainNavigationProps) => {
    console.log("props.initialRouteName", props.spinnerFlag);
    return (
        <NavigationContainer>
            <Modal visible={props.spinnerFlag} transparent animationType="fade">
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)'
                }}>
                    <ActivityIndicator color={colors.primary || 'blue'} size="large" />
                </View>
            </Modal>
            <StackNavigation initialRouteName={props.initialRouteName} />
        </NavigationContainer>
    );
};

export default connect(mapStateToProps)(MainNavigation);

