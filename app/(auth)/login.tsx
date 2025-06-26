    import { StyleSheet, Text, View ,TouchableWithoutFeedback ,Keyboard, Pressable, Alert} from 'react-native'
    import React, { useRef, useState } from 'react'
    import ScreenWrapper from '../../components/ScreenWrapper'
    import Typo from '../../components/Typo'
    import { colors, SpacingX, SpacingY } from '../../constants/Theme'
    import { verticalScale } from '../../utils/Styling'
    import BackButton from '../../components/BackButton'
    import Input from '../../components/Input'
    import Button from '../../components/Button'
    //importing all icons at one place
    import * as Icons from "phosphor-react-native"
    import { useRoute } from '@react-navigation/native'
    import { useRouter } from 'expo-router'
    import { useAuth } from '../../contexts/authContext'
    //Use useRef when you want to keep a value but don't need a re-render.
    //If you want to keep the previous state value without triggering a re-render, use useRef.
    //If we used useState, it wouldn't work because React state does not interact with the UI directly.
    // Use useState when:
    // You need UI updates (e.g., showing a counter, toggling a button).
    // The value should trigger re-renders when it changes.
    //
    //Use useRef when:

    // You need to store values across renders without triggering a re-render.
    // You need direct access to a DOM element (like focusing a TextInput).
    // You need to store previous values for comparison (without causing state updates).
    const Login = () => {
        //when user types a value we can store it somewhere we will use ref of react rather than state because state will re-render every time we enter value or change value.
        const emailRef = useRef("");
        const passwordRef = useRef("");
        const [isLoading, setIsLoading] = useState(false); 
        const router = useRouter();
        const { login: loginUser } = useAuth();
        const handleSubmit = async () => { 
            if (!emailRef.current || !passwordRef.current)
                {
                    Alert.alert("Please enter all the details ")
                    return;
            }
            setIsLoading(true);
            const res = await loginUser(emailRef.current, passwordRef.current);
            setIsLoading(false);
            if (!res.success) {
                Alert.alert("Login :", res.msg);
                
            } 

        }
    
    

        return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScreenWrapper >
            <View style={design.container}>
                {/*back button  */}
                <BackButton iconSize={28} />
                <View style={{gap:5 , marginTop: SpacingY._20}}>
                    <Typo size={32} fontWeight={"800"} >
                        Hey,
                    </Typo>
                    <Typo size={32} fontWeight={"800"}>
                        Welcome Back
                    </Typo>
                </View>
                {/* form login form */}
                <View style={design.form}>
                    <Typo size={20} color = {"#878787"}>
                        Login now to track all your Xpenses.
                    </Typo>
                </View>
                {/* login box */}
                
                <Input
                    placeholder="Enter your email"
                    onChangeText ={(value)=>(emailRef.current=value)}
                    icon={<Icons.At size={verticalScale(25)} color={colors.neutral300} />} />
                <Input
                    placeholder="Enter your Password"
                    secureTextEntry={true}  //to make password field password like text not visible.
                    onChangeText ={(value)=>(passwordRef.current=value)}
                        icon={<Icons.Password size={verticalScale(25)} color={colors.neutral300} />} />
                    
                <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
                    Forgot Password?
                </Typo>
                <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo size={20} color={colors.neutral800} fontWeight={"600"}>
                        Login
                    </Typo>
                </Button>
                {/* footer */}
                <View style={design.footer}>
                            <Typo size={15} >
                                Don't have an account?
                            </Typo>
                            <Pressable onPress={() => router.replace("/(auth)/register")}     
                            >
                                <Typo size={15} fontWeight={"bold"} color={colors.primary}>
                                Sign up
                                </Typo>
                            </Pressable>         
                </View>
            </View>
                </ScreenWrapper>
                </TouchableWithoutFeedback>
    )
    }

    export default Login

    const design = StyleSheet.create({
        container: {
            flex: 1,
            gap: SpacingY._30,
            paddingHorizontal : SpacingX._20,
        },
        welcomeText: {
            fontSize: verticalScale(20),
            fontWeight: "bold",
            //textAlign: "center",
            color: colors.text,
        },
        form: 
        {
            gap : SpacingY._20,
        },
        forgotPassword: {
            textAlign: "right",
            fontWeight: "500",
            color: colors.text,
        },
        footer:
        {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap : 2,
        },
        footerText: {
            textAlign: "center",
            color: colors.text,
            fontSize: verticalScale(15),
        }, 
    })