import { View, Text ,StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/Theme'
import { useRouter } from "expo-router"
import Animated, { FadeInUp } from 'react-native-reanimated'

const index = () => {
    // const router = useRouter();
    // useEffect(() => {
    //     setTimeout(() => { router.push("/(auth)/Welcome")}, 2000);
    // },[]
    // )

    return (
      
    <View style={design.container}>
            <Animated.Image
                exiting={FadeInUp.duration(1000).delay(1700)}
            style={design.logo}    
            resizeMode="center"
            source={require("../assets/images/money-bag.png")}
            />
            </View>
            
  )
}

export default index

const design = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral900,
        
    },
    logo: {
        aspectRatio: 1.5,
        height:"auto",
    },


})
