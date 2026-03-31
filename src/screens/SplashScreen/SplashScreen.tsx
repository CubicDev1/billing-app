import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native';
import { SplashScreenImage } from '../../utils/svg';
import { alignItemCenter, flex1, h100, justifyCenter, w100 } from '../../utils/theme/commonStyles';
import { getData, storageKeys } from '../../utils/async';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { screenName } from '../../utils/screenNames';

const ScreenSplash = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    useEffect(() => {
        initialCall();
    }, []);

    const initialCall = async () => {

        setTimeout(async () => {
            SplashScreen.hide();
            setIsLoading(false);
            var loginDetails = await getData(storageKeys.loginDetails);
            console.log('loginDetails', loginDetails);

            if (loginDetails) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: screenName.DashboardScreen }],
                });
            } else {
                console.log('SplashScreen')
                navigation.navigate(screenName.OnboardingScreen as never);
            }
        }, 1000);
    };
    return (
        <View style={[flex1,alignItemCenter,justifyCenter]}>
            <ImageBackground source={require('../../../assets/images/png/splashImage.png')} style={[w100, h100, alignItemCenter, justifyCenter, flex1]} >
                <SplashScreenImage width={163} height={46} />
            </ImageBackground>
        </View>
    )
}

export default ScreenSplash

const styles = StyleSheet.create({})