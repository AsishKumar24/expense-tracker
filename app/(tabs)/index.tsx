//home tab
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors, SpacingX, SpacingY } from "@/constants/Theme";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/Styling";
import { useAuth } from "@/contexts/authContext";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";

import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import useUserTransactions from "@/hooks/useUserTransaction";

const Home = () => {
  // const handleLogout = async () => {
  //     //logout logic here
  //     await signOut(auth);
  // }
  const { user } = useAuth();
  const router = useRouter();
  // const {
  //   data: transactions,
  //   loading: transactionLoading,
  //   error,
  // } = useUserTransactions();
  // console.log("recent transactions", transactions);


  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30)
  ];
 
  const {
    data: transactions,
    error,
    loading: transactionLoading,
  } = useFetchData<TransactionType>("transactions",
    constraints);
   //console.log("recent transactions", transactions  );
  // console.log("user" , user?.uid)
  return (
    <ScreenWrapper>
      <View style={desgin.container}>
        {/* header */}
        <View style={desgin.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Arigato,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={desgin.searchIcon}>
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.primary}
              weight="duotone"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={desgin.scrollViewStyle}
          showsVerticalScrollIndicator={true}
        >
          <View>
            <HomeCard />
          </View>
          <TransactionList
            //data={recentTransactions[0].data}
            //invalid recentTransactions.data
            data={transactions}
            //data={recentTransactions}
            title={"Recent Transactions"}
            emptyListMessage={"No Transaction Available"}
            loading={transactionLoading}
          />
        </ScrollView>
        <Button
          style={desgin.floatingButton}
          onPress={() => router.push("/(modals)/TransactionModal")}
        >
          <Icons.Plus size={verticalScale(25)} />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const desgin = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SpacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SpacingY._10,
    alignItems: "center",
  },
  searchIcon: {
    backgroundColor: colors.neutral900,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
  },
  scrollViewStyle: {
    marginTop: SpacingY._10,
    paddingBottom: verticalScale(100),
    gap: SpacingY._25,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    //backgroundColor: colors.primary,
    position: "absolute", // so that it does not mess with the content
    bottom: verticalScale(30),
    right: verticalScale(15),
  },
});
