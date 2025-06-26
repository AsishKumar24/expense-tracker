import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Typo from './Typo'
import { HeaderProps } from '@/types'

const Header = ({title = "" , leftIcon , style}: HeaderProps) => {
  return (
    <View style={[design.container , style && style ]}>
          {/* if we have left icon then view that left icon with styling and {left icon} */}
          {leftIcon && <View style={design.leftIcon}>{leftIcon} </View>}
          {
              title &&
              (
                  <Typo
                      size={22}
                      fontWeight={"600"}
                      style={{
                          textAlign: "center",
                          width: leftIcon? "82%" : "100%"
                          
                      }}
                  >
                      {title}
                  </Typo>
              )
          }
    </View>
  )
}

export default Header

const design = StyleSheet.create({
    container:
    {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        

    },
    leftIcon:
    {
        alignSelf : "flex-start"
    },
})
