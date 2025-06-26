        import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
        import React, { useEffect, useState } from 'react'
        import { colors, SpacingX, SpacingY } from '@/constants/Theme'
        import { scale, verticalScale } from '@/utils/Styling'
        import ModalWrapper from '@/components/ModalWrapper'
        import Typo from '@/components/Typo'
        import Header from '@/components/Header'
        import BackButton from '@/components/BackButton'
        import { Image } from 'expo-image'
        import { getProfileImage } from '@/services/imageService'
        import * as Icons from "phosphor-react-native"
        import Input from '@/components/Input'
        import { UserDataType } from '@/types'
        import Button from '@/components/Button'
        import { useAuth } from '@/contexts/authContext'
        import { updateUser } from '@/services/userService'
        import { useRouter } from 'expo-router'
        import * as ImagePicker from 'expo-image-picker';


        const ProfileModal = () => {
            const { user, updateUserData } = useAuth();
            const router = useRouter();
            const [UserData, SetUserData] = useState<UserDataType>({
                name: "",
                image : null
            
            })


            useEffect(() => 
                {
                    SetUserData({
                        name: user?.name || "",
                        image: user?.image || null
                    })
                }, [user]) // dependent on user data state if userdata updates then setuserData also updates

            const onSubmit = async () =>
            {
                let { name, image } = UserData;
                // update user data here
                //name.trim() is a JavaScript string method that removes whitespace from both the beginning and end of a string.
                if (!name.trim()) {
                    Alert.alert("User", "Please fill all the fields")
                }
                else {
                    setLoading(true);
                    const response = await updateUser(user?.uid as string, UserData)
                    setLoading(false);
                    if (response.success)
                    {
                        updateUserData(user?.uid as string)
                        router.back();
                        console.log(response.msg)

                    }
                    else {
                        Alert.alert("User", response.msg)
                    }
                }

            }
            const [isLoading, setLoading] = useState(false);

            const pickImage = async () => {
                // No permissions request is necessary for launching the image library
                let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                });
            
                console.log(result);
            
                if (!result.canceled) {
                    SetUserData({ ...UserData, image: result.assets[0] });
                }
            };

        

        return (
            <ModalWrapper>
                <View style={design.container} >
                    {/* <Header
                        title='Update Profile'
                        leftIcon={<BackButton />}
                        style={{marginBottom: SpacingY._10}}
                    />  */}
                    <BackButton/>
                    {/* form */}
                    <ScrollView contentContainerStyle={design.form}>
                        <View style={design.avatarContainer}>
                            <Image
                                source={getProfileImage(UserData.image)}
                                style={design.avatar}
                                contentFit='cover'
                                transition={100}  
                            />
                            {/* we will create a button which will open gallery to upload */}
                            <TouchableOpacity onPress={pickImage} style={design.editIcon}>
                                <Icons.Eraser size={ verticalScale(20)} />
                            </TouchableOpacity>
                        </View>
                        {/* add an input container */}
                        <View style={design.inputContainer}>
                            <Typo color={colors.neutral200} size={19} fontWeight={700}>Name</Typo>
                            <Input
                                placeholder='Name'
                                value={UserData.name}
                                //value={UserData.name}
                                onChangeText={(value)=> SetUserData({...UserData , name : value})} //This spread operator (...) is used to copy all existing properties from the UserData object into a new object.
                                    //{...props} – Spreading Props in a Component
                                    // 👉 This is used to pass all received props to a child component.
                                //   creates a new object by copying all existing properties from UserData.
                                // Updates only the name field with the new value.
                                // Calls SetUserData to update the state.
                            //Using { ...UserData } ensures we keep the existing state and update only what we need.   
                            />     
                        </View>
                    </ScrollView>
                    {/* submit user details */}
                    <View style={design.footer}>
                        <Button onPress={onSubmit} style={{flex : 1}} loading={isLoading} >
                            <Typo color={colors.black} fontWeight={"700"}>
                                Update
                            </Typo>  
                        </Button>
                        
                    </View>

            </View>
                </ModalWrapper>
        )
        }

        export default ProfileModal

        const design = StyleSheet.create({
            container:
            {
            
                flex: 1,
                justifyContent: "space-between",
                paddingHorizontal: SpacingY._20,
            },
            footer:
            {
                //alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                paddingHorizontal: SpacingX._20,
                gap: scale(12),
                paddingTop: SpacingY._15,
                borderTopColor: colors.neutral700,
                marginBottom: SpacingY._10,
                borderTopWidth : 1,
            },
            form:
            {
                gap: SpacingY._30,
                marginTop: SpacingY._15,
            },
            avatarContainer:
            {
                position: "relative",
                alignSelf:"center",
            },
            avatar:
            {
                alignSelf: "center",
                backgroundColor: colors.neutral300,
                height: verticalScale(135),
                width: verticalScale(135),
                borderRadius: 200,
                //borderWidth: 2,
                borderColor: colors.neutral500,
                // shadowColor: "black",
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.5,
                // shadowRadius: 2,
                // elevation: 2,
            },
            editIcon:
            {
                position: "absolute", //The button will be positioned SpacingY._7 units from the bottom and SpacingY._7 units from the right of the screen. //if no left right then bottom right container
                //bottom: SpacingY._7, //This moves the element upwards from the bottom of its positioned parent by the value of SpacingY._7.
                top: SpacingY._7,
                //right: SpacingY._7, //Effect: The element will be positioned SpacingY._7 distance from the right edge of the parent container (or screen if the parent has no position set).
                backgroundColor: colors.neutral100,
                borderRadius: 100,
                padding: SpacingY._7,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "black",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
            },
            inputContainer:
            {
                gap: SpacingY._15,
            },
        
        })