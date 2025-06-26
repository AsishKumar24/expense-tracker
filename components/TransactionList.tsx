import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { TransactionItemProps, TransactionListType, TransactionType } from "@/types";
import { colors, radius, SpacingX, SpacingY } from "@/constants/Theme";
import Typo from "./Typo";
import { FlashList } from "@shopify/flash-list";
import Loading from "./Loading";
import {
  expenseCategories,
  incomeCategory,
  transactionTypes,
} from "@/constants/data";
import { verticalScale } from "@/utils/Styling";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();
  const handleClick = (item:TransactionType) => {
    //transaction model will open
    router.push({
      pathname: "/(modals)/TransactionModal",
      params: {
        id: item?.id,
        type: item.type,
        amount: item.amount,
        category: item?.category,
        date: item.date?.toLocaleString(), 
        description: item?.description,
        image: item?.image,
        uid: item?.uid,
        walletId: item.walletId
      },


    })
  };
  

  return (
    <View style={design.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={design.list}>
        
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <Transactionitem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={45}
        />
      </View>
      {!loading && data.length == 0 && (
        <Typo
          size={20}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: SpacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}
      {loading && <Loading />}
    </View>
  );
};
const Transactionitem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  //console.log("descriptions" , item?.description)
 
  let category = item?.type == "income" ? incomeCategory : expenseCategories[item.category!];
  const IconComponent = category.icon;
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 90)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity style={design.row} onPress={() => handleClick(item)}>
        <View style={[design.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>
        <View style={design.categoryDes}>
          <Typo size={17}>{category.label}</Typo>
          <Typo
            size={13}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {`${item?.description}`}
          </Typo>
          <Typo size={10} color={colors.white} textProps={{ numberOfLines: 1 }}>
            Online
          </Typo>
        </View>
        <View style={design.amountDate}>
          <Typo size={17} color={item?.type == "income" ? colors.primary : colors.rose}>
           {`${item?.type == "income"?"+ ₹" : "- ₹"}${item?.amount}`}
          </Typo>
          <Typo size={13} color={colors.neutral400}>
            {item.date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
export default TransactionList;

const design = StyleSheet.create({
  container: {
    gap: SpacingY._17,
  },
  list: {
    minHeight: 3,
    //flashlist will not render if i dont give minimum height of 3
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SpacingX._12,
    marginBottom: SpacingY._12,

    backgroundColor: colors.neutral800,
    padding: SpacingY._10,
    paddingHorizontal: SpacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._10,
    // marginBottom: SpacingY._10,
    // marginLeft: SpacingX._10,
    // padding: SpacingY._5,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});
