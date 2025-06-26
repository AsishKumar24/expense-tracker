import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, SpacingX, SpacingY } from '@/constants/Theme'
import { verticalScale } from '@/utils/Styling'
import * as Icons from "phosphor-react-native"
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { where , orderBy} from 'firebase/firestore'
import { WalletType } from '@/types'
import Loading from '@/components/Loading'
import WalletListItem from '@/components/WalletListItem'
const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();
  //total balance calculation

  
  const {
    data: wallets,
    error,
    loading
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc")
  ]);
  //console.log("wallets :" , wallets.length);
    const totalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);
     

  return (
    <ScreenWrapper style ={{backgroundColor : colors.black}}>
      <View style={design.container}>
        {/* balance view*/}
        <View style={design.balanceView}>
          <View style={{ alignItems: 'center' }}>
            <Typo size={45} fontWeight={500}>
            ₹{totalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={15} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        {/* wallets */}
        <View style={design.wallets}>
          {/* header + my wallet + *(+)icon */}
          <View style={design.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              My Wallets
            </Typo>
            <TouchableOpacity onPress={()=> router.push("/(modals)/WalletModal")}>
              <Icons.StackPlus
                weight="duotone"
                color={colors.primary}
                size={verticalScale(26)}
              />
            </TouchableOpacity>

          </View>
          {/* wallet list */}
          {loading && <Loading />}
          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );

            }}
          contentContainerStyle={design.listStyles}
          />
          

        </View>

      </View>
   </ScreenWrapper>
  )
}

export default Wallet

const design = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  balanceView: {
    height: verticalScale(180),
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: verticalScale(20),
    // paddingVertical: verticalScale(10),
    marginBottom : SpacingY._10
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral800,
    borderTopRightRadius : radius._30,
    // paddingHorizontal: verticalScale(20),
    // paddingVertical: verticalScale(10),
    // marginBottom: verticalScale(10),
    borderTopLeftRadius: radius._30,
    padding: SpacingX._20,
    paddingTop : SpacingX._25
  },
  listStyles: {
    paddingVertical: SpacingY._25,
    paddingTop : SpacingY._15,
  },
})