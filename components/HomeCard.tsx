import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { scale, verticalScale } from "@/utils/Styling";
import { colors, SpacingX, SpacingY } from "@/constants/Theme";
import * as Icons from "phosphor-react-native";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType, WalletType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import useUserTransactions from "@/hooks/useUserTransaction";

const HomeCard = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    error,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  //console.log("wallet data" , wallets ?? [])
  //reduce((acc, num) => acc + num, 0)//0 here is initial value we can use 0, {} , []
  //   | Name | Is it an array? | What is it? |
  // |------|------------------|-------------|
  // | `wallets` | ✅ Yes | An array of wallet objects |
  // | `totals` | ❌ No | An object (accumulator) |
  // | `balance`, `income`, `expense` | ❌ No | Numeric properties inside the `totals` object |
 
  const getTotals = () => {
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expense = totals.expense + Number(item.totalExpense);
        return totals;
      },
      { balance: 0, income: 0, expense: 0 }
    );
  };
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={design.bgImage}
    >
      <View style={design.container}>
        <View>
          {/* balance */}
          <View style={design.totalBalanceRow}>
            <Typo color={colors.neutral500} size={18} fontWeight={"500"}>
              Total Balance
            </Typo>
            <Icons.DotsThreeOutline weight="fill" />
          </View>
          <Typo size={30} fontWeight={"bold"} color={colors.black}>
            ₹ {getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>
        {/* total expenses and income */}
        <View style={design.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={design.incomeExpense}>
              <View style={design.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight={"bold"}
                />
              </View>
              <Typo size={15} color={colors.neutral500} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo
                size={19}
                color={colors.green}
                fontWeight={"600"}
                style={{ textAlign: "justify" }}
              >
                ₹ {getTotals()?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>
          {/* expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={design.incomeExpense}>
              <View style={design.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight={"bold"}
                />
              </View>
              <Typo size={15} color={colors.neutral500} fontWeight={"500"}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={19} color={colors.rose} fontWeight={"600"}>
                ₹ {getTotals()?.expense?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const design = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: SpacingX._20,
    paddingHorizontal: scale(23),
    height: "107%",
    width: "100%",
    justifyContent: "center",
    // backgroundColor: "red"
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    //paddingVertical: scale(20),
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: scale(36),
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: SpacingY._7,
    borderRadius: 30,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: SpacingY._7,
  },
});
