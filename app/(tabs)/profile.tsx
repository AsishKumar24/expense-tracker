import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, radius, SpacingX, SpacingY } from '@/constants/Theme';
import { verticalScale } from '@/utils/Styling';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/contexts/authContext';
import Typo from '@/components/Typo';
import { Image } from "expo-image";
import { getProfileImage } from '@/services/imageService';
import { accountOptionType } from '@/types';
import * as Icons from "phosphor-react-native"
import Animated, { FadeInDown } from 'react-native-reanimated';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
const Profile = () => {
  const { user } = useAuth();
  const handleLogout = async () =>
  {
    await signOut(auth);
  }
  const router = useRouter();
  const  accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: (
        <Icons.User
          size={26}
          color={colors.white}
          weight='fill'
      />),
      bgColor: '#4F46E5',
      routeName : "../(modals)/ProfileModal"
    },
    {
      title: "Settings",
      icon: (
        <Icons.Wrench
          size={26}
          color={colors.white}
          weight='fill'
      />),
      bgColor: 'rgb(0, 141, 94)',
      // routeName : '' {no page for the setting}
    },
    {
      title: "Privacy Policy",
      icon: (
        <Icons.Keyhole
          size={26}
          color={colors.white}
          weight='fill'
      />),
      bgColor: colors.neutral600,
      // routeName : '' {no page for the setting}
    },
    {
      title: "Logout",
      icon: (
        <Icons.SignOut
          size={26}
          color={colors.white}
          weight='fill'
      />),
      bgColor: "rgb(209, 16, 48)",
      // routeName : '' {no page for the setting}
    },

  ];

  const showLogoutAlert = () =>
  {
    Alert.alert("confirm ", "Are you sure?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
        style : "destructive"
        
      },
    ]

    )
    
  }

  const handlePress =  (item: accountOptionType) =>
  {
    if (item.title == "Logout")
    {
      showLogoutAlert();
    }
    if (item.routeName)
    {
      // navigate to the selected route
      router.push(item.routeName);
    }
  }
  return (
    <ScreenWrapper >
      <View style={design.container}>
        <Header title="Profile" style={{ marginVertical: SpacingY._10 }} />
        {/* user info */}
        <View style={design.userInfo}>
          {/* avatar  */}
          <View>
            {/* user image */}
            <Image
              source={getProfileImage (user?.image)}
              style={design.avatar}
              contentFit="cover"
              transition={100}
            /> 


          </View>
          {/* name and email */}
          <View style={design.nameContainer}>
            <Typo size={24} fontWeight={"700"} color={colors.neutral100} >
              {user?.name}

            </Typo>

            <Typo size={15}  color={colors.neutral400} >
              {user?.email}

            </Typo>

          </View>
        </View> 
        {/* account options */}
        <View style={design.accountOptions}>
          {
            accountOptions.map((item, index)=>{
              return (
                <Animated.View 
                  entering={FadeInDown.delay(index * 50).springify().damping(14)} key={index} style={design.listItem}>
                 
                  <TouchableOpacity
                    style={design.flexRow}
                    onPress={()=> handlePress(item)}
                  >
                    {/* to add the icon and name of that in a row we used flex row */}
                    <View style={[design.listIcon, { backgroundColor: item.bgColor }]}>
                      {item.icon && item.icon}
                    </View>
                    {/* flex 1 so that it takes whole space */}
                    <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>{item.title}</Typo>
                    {/* adding > icons at the flex end */}
                    <Icons.ArrowArcRight size={24} color={colors.neutral400} />
                  </TouchableOpacity>

                </Animated.View>
              );

            })}
          

        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Profile;

const design = StyleSheet.create({
  container:
  {
    flex: 1,
    paddingHorizontal: SpacingX._20,
  },
  userInfo:
  {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap : SpacingY._15,
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
    // borderWidth: 2,
    // borderColor: colors.neutral500,
    // shadowColor: "black",
  },
  editIcon:
  {
    position: "absolute",
    top: -verticalScale(30),
    right: -verticalScale(30),
    backgroundColor: colors.neutral900,
    borderRadius: 50,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
  },
  nameContainer: 
  {
    gap: verticalScale(4),
    alignItems: "center",
    //justifyContent: "center",
  },
  listIcon:
  {
    width: verticalScale(40),  // Increased from 30 to 50
    height: verticalScale(40), // Increased from 30 to 50
    backgroundColor: colors.neutral500,
    borderRadius: radius._15,
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    
  },
  listItem:
  {
    marginBottom: verticalScale(17),
  },
  accountOptions:
  {
    marginTop : SpacingY._35,
  },
  flexRow:
  {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    gap: SpacingX._10,
  },





})