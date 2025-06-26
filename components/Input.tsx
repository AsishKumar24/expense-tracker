import { StyleSheet, Text, TextInput, View , Keyboard , TouchableWithoutFeedback} from 'react-native'
import React, { useState } from 'react'
import { InputProps } from '@/types'
import { colors, radius, SpacingX } from '@/constants/Theme'
import { verticalScale } from '@/utils/Styling'
//props is used if we wanna override any styling
//Without &&, if props.containerStyle is undefined or null,
// React Native might throw an error when processing the style array. Using && ensures that props.containerStyle is only added when it exists.
// another style style={[design.container, props.containerStyle ?? []]} [] throws an empty array if not specified
//Refs are an escape hatch to hold onto values that aren’t used for rendering. You won’t need them often.
const Input = (props: InputProps) => {
   
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[design.container, props.containerStyle && props.containerStyle]}>
         
          <TextInput
              style={[design.input, props.inputStyle]}
              placeholderTextColor={colors.neutral400}
              ref={props.inputRef && props.inputRef}
    
                
            
                //editable={false}
                  //value="" this renders every fucking time and not help in having a new name  
                //onChangeText={setText}
             {...props}//Spreading props to allow additional TextInput properties
          />
           {
              props.icon && props.icon
          }
          
            </View>
            </TouchableWithoutFeedback>
  )
}

export default Input

const design = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.8,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        //for icon
        paddingHorizontal: SpacingX._15,
        gap: SpacingX._10,
    },
    input: {
        flex:1,
        alignContent: "flex-start",
        color: colors.white,
        fontSize: verticalScale(16.5),
        paddingHorizontal: SpacingX._15,
    },
})