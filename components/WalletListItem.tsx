import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { verticalScale } from '@/utils/Styling'
import { colors, radius, SpacingX, SpacingY } from '@/constants/Theme'
import { WalletType } from '@/types'
import { Router } from 'expo-router'
import { Image } from 'expo-image'
import Typo from './Typo'
import * as Icons from "phosphor-react-native"
import Animated, { FadeInDown } from 'react-native-reanimated'

const WalletListItem = ({
    item,
    index,
    router
    // destructuring happens first and then the types are defined
}: {
    item: WalletType;
    index: number;
    router: Router;
}) => {
    const openWallet = () =>
    {
        router.push({
            pathname: "/(modals)/WalletModal",
            params: {
                id: item?.id,
                name: item?.name,
                image : item?.image
            }

        })
    }
    return (
        <Animated.View
            entering={
                FadeInDown.delay(index*50).springify().damping(13)
            }
        
        
        >
            <TouchableOpacity style={design.container} onPress={openWallet}>
                <View style={design.imageContainer}>
                    <Image
                        style={{ flex: 1 }}
                        source={item?.image}
                        contentFit="cover"
                        transition ={100}
                    />
                </View>
                <View style={design.nameContainer}>
                    <Typo size={16}>{item?.name}</Typo>
                    <Typo size={14} color={colors.neutral400}>₹{item?.amount}</Typo>

                </View>
                <Icons.CaretRight
                    color={colors.white}
                    size={20}
                    weight="regular"
                />

            </TouchableOpacity>
        </Animated.View>
    )
};


export default WalletListItem

const design = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom : verticalScale(17),
    },
    imageContainer: {
        height: verticalScale(49),
        width: verticalScale(50),
        borderWidth: 1,
        borderColor: colors.neutral600,
        borderRadius: radius._12,
        borderCurve: "continuous",
        overflow: "hidden",
        
        
    },
    nameContainer: 
    {
        flex: 1,
        gap: 2,
        marginLeft: SpacingX._10,
    }
})