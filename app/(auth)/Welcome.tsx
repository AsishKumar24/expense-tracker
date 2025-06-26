  import { View, Text ,StyleSheet, TouchableOpacity, Image } from 'react-native'
  import React from 'react'
  import ScreenWrapper from '@/components/ScreenWrapper'
  import Typo from '@/components/Typo'
  import { colors, SpacingX, SpacingY } from '@/constants/Theme'
  import { verticalScale } from '@/utils/Styling'
  import Button from '@/components/Button'
  //we gonna use reanimated library given by expo router
  import Animated, { FadeIn, FadeInDown, FadeInLeft } from "react-native-reanimated";
  import { useRoute } from '@react-navigation/native'
  import { useRouter } from 'expo-router'
  const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
        <View style={design.container}>
          {/* login button and image */}
          <View>
            <TouchableOpacity onPress={()=> router.push("/(auth)/login")} style={design.loginButton}>
              <Typo  style={{fontWeight : "500"}}>Sign in</Typo>
            </TouchableOpacity>
            <Animated.Image
              entering={FadeIn.duration(1000)}
              source={require("../../assets/images/—Pngtree—hand drawn doodle icons illustrating_20309972.png")}
              style={design.welcomeImage}
              resizeMode="contain"
            />
          </View>
          {/* footer */}
          <View style={design.footer}>
            <Animated.View entering={FadeInDown.delay(500) } style={{ alignItems: "center"}}>
              <Typo size={30} fontWeight={"800"} >
              "Guard your coins, grow your fortune!" 💰✨
              </Typo>
            </Animated.View>
            <Animated.View entering={FadeIn.springify().damping(12).duration(500)}>
              <Typo size={18} color={colors.neutral600}>
              Finance thoda sorted rakho 
                <Typo size={18} color={colors.neutral600}>
                , warna 'sale' wali jhopdi mein rehna padega!
                </Typo>
              </Typo>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.springify().damping(12).duration(2000).delay(500)}
              style={design.buttonContainer}>
              {/* button */}
              <Button onPress={()=> router.push("/(auth)/register")}>
                <Typo size={20} color={colors.neutral800} fontWeight={"600"}>
                  Let's Begin
                </Typo>
              </Button>

            </Animated.View>
        

          </View>
        </View>
            
        </ScreenWrapper>

    )
  }

  export default Welcome;

  const design = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingTop: SpacingY._7,
    },
    welcomeImage: {
      width: "100%",
      height: verticalScale(400),
      alignSelf: "center",
      marginTop: verticalScale(50),
      //we could have used spacing but we used scaling in pixel  
    },
    loginButton: {
      alignSelf: "flex-end",
      marginRight: SpacingX._20,
    },
    footer: {
      backgroundColor: colors.neutral900,
      alignItems: "center",
      paddingTop: verticalScale(27),
      paddingBottom: verticalScale(45),
      gap: SpacingY._20,
      shadowColor: "white",
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.20,
      shadowRadius: 30,
      elevation:10,
    },
    buttonContainer: {
      width: "100%",
      paddingHorizontal: SpacingX._25,
      
    },


  })
