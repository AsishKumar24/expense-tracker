import { View, Platform, TouchableOpacity ,StyleSheet } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBar, BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, SpacingX, SpacingY } from '@/constants/Theme';
import { verticalScale } from '@/utils/Styling';
import * as Icons from "phosphor-react-native";


export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  
  const tabBarIcons: any = {
    index: (isFocused: boolean) => (
      <Icons.House
        size={verticalScale(27)}
        weight={isFocused ? "bold" : "regular"}
        color={isFocused ? colors.primary : colors.neutral500}
      />
    ),
    statistics: (isFocused: boolean) => (
      <Icons.ChartPieSlice
        size={verticalScale(27)}
        weight={isFocused ? "bold" : "regular"}
        color={isFocused ? colors.primary : colors.neutral500}
      />
    ),
    wallet: (isFocused: boolean) => (
      <Icons.Wallet
        size={verticalScale(27)}
        weight={isFocused ? "bold" : "regular"}
        color={isFocused ? colors.primary : colors.neutral500}
      />
    ),
    gpt: (isFocused: boolean) => (
      <Icons.GoogleLogo
        size={verticalScale(27)}
        weight={isFocused ? "bold" : "regular"}
        color={isFocused ? colors.primary : colors.neutral500}
      />
    ),
    profile: (isFocused: boolean) => (
      <Icons.UserCircle
        size={verticalScale(27)}
        weight={isFocused ? "bold" : "regular"}
        color={isFocused ? colors.primary : colors.neutral500}
      />
    ),
    

     }

  return (
    <View style={design.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label  : any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={design.tabbarItem}
          >
            {
              tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const design = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    width: "100%",
    height: Platform.OS == "ios" ? verticalScale(73) : verticalScale(55) ,
    backgroundColor: "#0F0F0F",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,  

  },
  tabbarItem:
  {
    marginBottom: Platform.OS == "ios" ? SpacingY._10 : SpacingY._7,
    justifyContent: "center",
    alignItems: "center",
    marginLeft : Platform.OS == "ios" ? SpacingX._10 : SpacingX._7,
    marginRight: Platform.OS == "ios" ? SpacingX._10 : SpacingX._7,
    

  }
  

})