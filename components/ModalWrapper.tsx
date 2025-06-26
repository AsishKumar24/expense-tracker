import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, SpacingY } from '@/constants/Theme'
import { ModalWrapperProps } from '@/types'
//style && style ensures that the style prop is only applied if it is defined.
const ModalWrapper = ({
    style,
    children,
    bg=colors.neutral900
}:ModalWrapperProps) => {
    return (
      <View style={[design.container, { backgroundColor: bg }, style && style,]}>
        
        {children}
        
    </View>
  )
}

export default ModalWrapper

const design = StyleSheet.create({
    container:
    {
        flex: 1,
        paddingTop: Platform.OS == "ios" ? SpacingY._15 : 50,
        paddingBottom : Platform.OS == "ios" ? SpacingY._20 : SpacingY._10
    },
})