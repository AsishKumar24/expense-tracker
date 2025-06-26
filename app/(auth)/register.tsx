        import { StyleSheet, Text, View ,TouchableWithoutFeedback ,Keyboard, Pressable, Alert} from 'react-native'
        import React, { useRef, useState } from 'react'
        import ScreenWrapper from '@/components/ScreenWrapper'
        import Typo from '@/components/Typo'
        import { colors, SpacingX, SpacingY } from '@/constants/Theme'
        import { verticalScale } from '@/utils/Styling'
        import BackButton from '@/components/BackButton'
        import Input from '@/components/Input'
        import Button from '@/components/Button'
        //importing all icons at one place
        import * as Icons from "phosphor-react-native"
        import { useRoute } from '@react-navigation/native'
        import { useRouter } from 'expo-router'
        import { useAuth } from '@/contexts/authContext'

        const Register = () => {
            //when user types a value we can store it somewhere we will use ref of react rather than state because state will re-render every time we enter value or change value.
            const emailRef = useRef("");
            const passwordRef = useRef("");
            const nameref = useRef("");
            
            const [isLoading, setIsLoading] = useState(false); 
            const router = useRouter();
            const { register: registerUser } = useAuth();
            const handleSubmit = async () => { 
                if (!emailRef.current || !passwordRef.current || !nameref.current)
                    {
                        Alert.alert("Sign up", "Please enter all the details ")
                        return;
                }
                setIsLoading(true);
                const res = await registerUser(
                    emailRef.current,
                    passwordRef.current,
                    nameref.current
                )
                setIsLoading(false);
                console.log("register result:", res);
                if (!res.success)
                {
                    Alert.alert("Sign up", res.msg);
                    //return;
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
                            Let's
                        </Typo>
                        <Typo size={32} fontWeight={"800"}>
                            Get Started
                        </Typo>
                    </View>
                    {/* form login form */}
                    <View style={design.form}>
                        <Typo size={20} color = {"#878787"}>
                            Create an Xpense account.
                        </Typo>
                    </View>
                    {/* login box */}
                    <Input
                        placeholder="Enter your Name"
                        onChangeText ={(value : any)=>(nameref.current=value)}
                        icon={<Icons.IdentificationCard size={verticalScale(25)} color={colors.neutral300} />} />
                    
                    <Input
                        placeholder="Enter your email"
                        onChangeText ={(value : any)=>(emailRef.current=value)}
                        icon={<Icons.At size={verticalScale(25)} color={colors.neutral300} />} />
                    <Input
                        placeholder="Enter your Password"
                        secureTextEntry={true}  //to make password field password like text not visible.
                        onChangeText ={(value : any)=>(passwordRef.current=value)}
                            icon={<Icons.Password size={verticalScale(25)} color={colors.neutral300} />} />
                        
                    {/* <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
                        Forgot Password?
                    </Typo> */}
                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo size={20} color={colors.neutral800} fontWeight={"600"}>
                            Sign up
                        </Typo>
                    </Button>
                    {/* footer */}
                    <View style={design.footer}>
                                <Typo size={15} >
                                    Already have an account?
                                </Typo>
                                <Pressable onPress={() => router.replace("/(auth)/login")}     
                                >
                                    <Typo size={15} fontWeight={"bold"} color={colors.primary}>
                                    Login
                                    </Typo>
                                </Pressable>         
                    </View>
                </View>
                    </ScreenWrapper>
                    </TouchableWithoutFeedback>
        )
        }

        export default Register

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