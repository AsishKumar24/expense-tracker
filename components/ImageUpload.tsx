import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ImageUploadProps } from '@/types'
import * as Icons from "phosphor-react-native"
import { colors, radius } from '@/constants/Theme'
import Typo from './Typo'
import { scale, verticalScale } from '@/utils/Styling'
import { Image } from 'expo-image'
import { getfilePath } from '@/services/imageService'
import * as ImagePicker from 'expo-image-picker';

const ImageUpload = ({
    file = null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder=" " ,

}: ImageUploadProps) => {
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
                        onSelect(result.assets[0]);
                    }
                };
    
  return (
    <View>
          {!file && (
              <TouchableOpacity
                  onPress={pickImage}
                  style={[design.inputContainer, containerStyle && containerStyle]}>
                  <Icons.FileArrowUp color={colors.neutral350} />
                  {placeholder && <Typo size={15}>{ placeholder}</Typo>}
              </TouchableOpacity>
          )}
          {file && (
              <View style={[design.image, imageStyle&&imageStyle] }>
                  <Image
                      style={{ flex: 1 }}
                      source={getfilePath(file)}
                      contentFit="cover"
                      transition ={100}
                  />
                  <TouchableOpacity
                      style={design.deleteicon}
                      onPress= {onClear}
                  >
                      <Icons.Trash
                          size={verticalScale(21)}
                          weight="duotone"
                          color ={colors.white}
                      />
                      
                  </TouchableOpacity>
             </View>
          )}
    </View>
  )
}

export default ImageUpload

const design = StyleSheet.create({
    inputContainer: {
        height: verticalScale(54),
        backgroundColor: colors.neutral700,
        borderRadius: radius._17,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        gap: 8,
        borderWidth: 0.8,
        borderColor: colors.neutral500,
        borderStyle : "dashed"
    },
    image: {
        height: scale(150),
        width: scale(150),
        borderRadius: radius._15,
        borderCurve: "continuous",
        overflow: "hidden"

    },
    deleteicon: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: colors.neutral500,
        borderRadius: radius._15,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 2,
        zIndex: 1000,

    },
})