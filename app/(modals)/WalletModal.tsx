import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { colors, SpacingX, SpacingY } from "@/constants/Theme";
  import { scale, verticalScale } from "@/utils/Styling";
  import ModalWrapper from "@/components/ModalWrapper";
  import Typo from "@/components/Typo";
  import Header from "@/components/Header";
  import BackButton from "@/components/BackButton";
  import { Image } from "expo-image";
  import { getProfileImage } from "@/services/imageService";
  import * as Icons from "phosphor-react-native";
  import Input from "@/components/Input";
  import { UserDataType } from "@/types";
  import Button from "@/components/Button";
  import { useAuth } from "@/contexts/authContext";
  import { updateUser } from "@/services/userService";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import * as ImagePicker from "expo-image-picker";
  import { WalletType } from "@/types";
  import ImageUpload from "@/components/ImageUpload";
  import { create_or_update_Wallet, deleteW } from "@/services/walletService";
  
  const WalletModal = () => {
    const { user, updateUserData } = useAuth();
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const [wallet, SetWallet] = useState<WalletType>({
      name: "",
      image: null,
    });
  
    const oldWallet: { name: string; image: string; id: string } =
      useLocalSearchParams();
    useEffect(() => {
      if (oldWallet?.id) {
        SetWallet({
          name: oldWallet?.name,
          image: oldWallet?.image,
        });
      }
    }, []);
  
    const onSubmit = async () => {
      let { name, image } = wallet;
      if (!name.trim() || !image) {
        Alert.alert("Wallet", "Please fill all the fields");
        return;
      }
      const data: WalletType = {
        name,
        image,
        uid: user?.uid,
      };
      if (oldWallet?.id) data.id = oldWallet.id;
      setLoading(true);
      const response = await create_or_update_Wallet(data);
      setLoading(false);
      //console.log( "response" ,response)
      if (response.success) {
        router.back();
      } else {
        Alert.alert("Wallet", response.msg);
      }
    };
    const deleteWallet = async () => {
      if (!oldWallet?.id) return;
      setLoading(true);
      const result = await deleteW(oldWallet?.id);
      setLoading(false);
      if (result.success === true) {
        router.back();
      } else {
        Alert.alert("Wallet", result.msg);
      }
    };
  
    const showDeleteAlert = () => {
      Alert.alert(
        "Delete Wallet",
        "Are you sure you want to delete this wallet?",
        [
          {
            text: "Cancel",
            style: "cancel",
            //onPress
          },
          {
            text: "Delete",
            onPress: () => deleteWallet(),
            style: "destructive",
          },
        ]
      );
    };
  
    return (
      <ModalWrapper>
        <View style={design.container}>
          {/* <Header
                          title='Update Profile'
                          leftIcon={<BackButton />}
                          style={{marginBottom: SpacingY._10}}
                      />  */}
          <BackButton />
          {/* form */}
          <ScrollView contentContainerStyle={design.form}>
            {/* add an input container */}
            <View style={design.inputContainer}>
              <Typo color={colors.neutral200} size={19} fontWeight={700}>
                {" "}
                Wallet Name
              </Typo>
              <Input
                placeholder="Eg. Salary"
                value={wallet.name}
                //value={UserData.name}
                onChangeText={(value) => SetWallet({ ...wallet, name: value })} //This spread operator (...) is used to copy all existing properties from the UserData object into a new object.
                //{...props} – Spreading Props in a Component
                // 👉 This is used to pass all received props to a child component.
                //   creates a new object by copying all existing properties from UserData.
                // Updates only the name field with the new value.
                // Calls SetUserData to update the state.
                //Using { ...UserData } ensures we keep the existing state and update only what we need.
              />
            </View>
            <View style={design.inputContainer}>
              <Typo color={colors.neutral200} size={19} fontWeight={700}>
                {" "}
                Wallet Icon
              </Typo>
              {/* image picker input  */}
              <ImageUpload
                placeholder="Upload Image"
                file={wallet.image}
                onSelect={(file) => SetWallet({ ...wallet, image: file })}
                onClear={() => SetWallet({ ...wallet, image: null })}
              />
            </View>
          </ScrollView>
          {/* submit user details */}
          <View style={design.footer}>
            {/* any future problem as we not mentioned the trash icon top delete only if oldwallet id is present */}
            {!isLoading && oldWallet?.id && (
              <Button
                onPress={showDeleteAlert}
                style={{
                  backgroundColor: colors.rose,
                  paddingHorizontal: SpacingX._10,
                }}
                //loading={isLoading}
              >
                <Icons.Trash
                  color={colors.white}
                  size={verticalScale(29)}
                  weight="duotone"
                />
              </Button>
            )}
  
            <Button onPress={onSubmit} style={{ flex: 1 }} loading={isLoading}>
              <Typo color={colors.black} fontWeight={"700"}>
                {oldWallet?.id ? "Update" : "Add Wallet"}
              </Typo>
            </Button>
          </View>
        </View>
      </ModalWrapper>
    );
  };
  
  export default WalletModal;
  
  const design = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: SpacingY._20,
    },
    footer: {
      //alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: SpacingX._20,
      gap: scale(12),
      paddingTop: SpacingY._15,
      borderTopColor: colors.neutral700,
      marginBottom: SpacingY._10,
      borderTopWidth: 1,
    },
    form: {
      gap: SpacingY._30,
      marginTop: SpacingY._15,
    },
    avatarContainer: {
      position: "relative",
      alignSelf: "center",
    },
    avatar: {
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
    editIcon: {
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
    inputContainer: {
      gap: SpacingY._15,
    },
  });
  