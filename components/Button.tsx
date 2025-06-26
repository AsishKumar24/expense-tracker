import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { CustomButtonProps } from "@/types";
import { colors, radius } from "@/constants/Theme";
import Loading from "./Loading";
import { verticalScale } from "@/utils/Styling";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View style={[design.button, style, { backgroundColor: "transparent" }]}>
        {/* loading component */}
        <Loading />
      </View>
    );
  }
  return (
    //here adding style means we can use style and overwrite the styles whenever we want
    <TouchableOpacity onPress={onPress} style={[design.button, style]}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const design = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._20,
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    height: verticalScale(43),
  },
});
