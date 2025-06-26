import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, SpacingX, SpacingY } from "@/constants/Theme";
import { scale, verticalScale } from "@/utils/Styling";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import * as Icons from "phosphor-react-native";
import Input from "@/components/Input";
import { UserDataType, WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { TransactionType } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import { create_or_update_Wallet, deleteW } from "@/services/walletService";
import { Dropdown } from "react-native-element-dropdown";
import { expenseCategories, transactionTypes } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { create_or_update_transaction } from "@/services/transactionServices";

const TransactionModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [transaction, SetTransaction] = useState<TransactionType>({
    type: "expense",
    image: null,
    amount: 0,
    date: new Date(),
    walletId: "",
    category: "",
    description: "",
    // uid:""
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  type paramType = {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId: string;
  }
  const oldTransaction: paramType =
    useLocalSearchParams();
;
  useEffect(() => {
    if (oldTransaction?.id)
    {
      SetTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        category: oldTransaction?.category,
        description: oldTransaction?.description,
        date: new Date(oldTransaction?.date),
        walletId: oldTransaction?.walletId,
        image: oldTransaction?.image

        
      });
    }
  
  }, []);
  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields");
      return;
    }
    // console.log("hurray");
    let transdata: TransactionType = {
      type,
      amount,
      description,
      category,
      uid: user?.uid,
      walletId,
      image,
      date: new Date().toISOString().slice(0, 10),

      
    };
    // console.log("transaction data: ", transdata);
    //todo: include transaction id for updating
    if (oldTransaction?.id) { transdata.id = oldTransaction.id };
    setLoading(true);
    const res = await create_or_update_transaction(transdata);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transactions", res.msg);
    }
  };
  const deleteWallet = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const result = await deleteW(oldTransaction?.id);
    setLoading(false);
    if (result.success === true) {
      router.back();
    } else {
      Alert.alert("Wallet", result.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Delete Wallet",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
          //onPress
        },
        {
          text: "Delete",
          onPress: () => deleteWallet(),
          style: "destructive",
        },
      ]
    );
  };

  // retriving data of the wallets
  const {
    data: wallets,
    error: walletError,
    loading: WalletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const onChangefn = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    SetTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  return (
    <ModalWrapper>
      <View style={design.container}>
        {/* <Header
                          title='Update Profile'
                          leftIcon={<BackButton />}
                          style={{marginBottom: SpacingY._10}}
                      />  */}
        <BackButton />
        {/* form */}
        <ScrollView
          contentContainerStyle={design.form}
          showsVerticalScrollIndicator={false}
        >
          {/* add an input container */}
          <View style={design.inputContainer}>
            <Typo color={colors.neutral200} size={19} fontWeight={700}>
              {" "}
              Transaction Type
            </Typo>
            {/* dropdown here */}
            <Dropdown
              style={design.dropdownContainer}
              activeColor={colors.neutral700}
              //placeholderStyle={design.dropdownPlaceholder}
              selectedTextStyle={design.dropdownSelectedText}
              iconStyle={design.dropdownicon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={design.dropdownItemText}
              itemContainerStyle={design.dropdownItemContainer}
              containerStyle={design.dropwDownListContainer}
              //placeholder={!isFocus ? 'Select item' : '...'}
              value={transaction.type}
              onChange={(item) => {
                SetTransaction({ ...transaction, type: item.value });
                //setIsFocus(false);
              }}
            />
          </View>

          <View style={design.inputContainer}>
            <Typo color={colors.neutral200} size={19} fontWeight={700}>
              {" "}
              Wallet
            </Typo>
            {/* dropdown here */}
            <Dropdown
              style={design.dropdownContainer}
              activeColor={colors.neutral700}
              //placeholderStyle={design.dropdownPlaceholder}
              selectedTextStyle={design.dropdownSelectedText}
              iconStyle={design.dropdownicon}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} (₹${wallet?.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={design.dropdownItemText}
              itemContainerStyle={design.dropdownItemContainer}
              containerStyle={design.dropwDownListContainer}
              placeholder={"Select Wallet"}
              value={transaction.walletId}
              onChange={(item) => {
                SetTransaction({ ...transaction, walletId: item.value });
                //setIsFocus(false);
              }}
            />
          </View>
          {/* expense categories */}
          {transaction.type == "expense" && (
            <View style={design.inputContainer}>
              <Typo color={colors.neutral200} size={19} fontWeight={700}>
                {" "}
                Expense Category
              </Typo>
              {/* dropdown here */}
              <Dropdown
                style={design.dropdownContainer}
                activeColor={colors.neutral700}
                //placeholderStyle={design.dropdownPlaceholder}
                selectedTextStyle={design.dropdownSelectedText}
                iconStyle={design.dropdownicon}
                //Object.values(obj) extracts only the values from the object, discards the keys.
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={design.dropdownItemText}
                itemContainerStyle={design.dropdownItemContainer}
                containerStyle={design.dropwDownListContainer}
                placeholder={"Select category"}
                value={transaction.category}
                onChange={(item) => {
                  SetTransaction({ ...transaction, category: item.value });
                  //setIsFocus(false);
                }}
              />
            </View>
          )}

          {/* date picker */}

          <View style={design.inputContainer}>
            <Typo color={colors.neutral200} size={19} fontWeight={700}>
              {" "}
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={design.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View style={Platform.OS == "ios" && design.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display="spinner"
                  onChange={onChangefn}
                />

                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    style={design.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={19} fontWeight={"500"}>
                      OK
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* amount */}
          <View style={design.inputContainer}>
            <Typo color={colors.neutral200} size={19} fontWeight={700}>
              {" "}
              Amount
            </Typo>
            <Input
              keyboardType="numeric"
              placeholder="₹"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                SetTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          {/* description */}
          <View style={design.inputContainer}>
            <View style={design.flexRow}>
              <Typo color={colors.neutral200} size={19} fontWeight={700}>
                {" "}
                Description
              </Typo>
              <Typo color={colors.neutral400} size={15} fontWeight={400}>
                (Optional)
              </Typo>
            </View>
            <Input
              value={transaction?.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                SetTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={design.inputContainer}>
            <View style={design.flexRow}>
              <Typo color={colors.neutral200} size={19} fontWeight={700}>
                {" "}
                Receipt
              </Typo>
              <Typo color={colors.neutral400} size={15} fontWeight={400}>
                (Optional)
              </Typo>
            </View>
            {/* image picker input  */}
            <ImageUpload
              placeholder="Upload Image"
              file={transaction.image}
              onSelect={(file) =>
                SetTransaction({ ...transaction, image: file })
              }
              onClear={() => SetTransaction({ ...transaction, image: null })}
            />
          </View>
        </ScrollView>
        {/* submit user details */}
        <View style={design.footer}>
          {/* any future problem as we not mentioned the trash icon top delete only if oldwallet id is present */}
          {!isLoading && oldTransaction?.id && (
            <Button
              onPress={showDeleteAlert}
              style={{
                backgroundColor: colors.rose,
                paddingHorizontal: SpacingX._10,
              }}
              //loading={isLoading}
            >
              <Icons.Trash
                color={colors.white}
                size={verticalScale(29)}
                weight="duotone"
              />
            </Button>
          )}

          <Button onPress={onSubmit} style={{ flex: 1 }} loading={isLoading}>
            <Typo color={colors.black} fontWeight={"700"}>
              {oldTransaction?.id ? "Update" : "Submit"}
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const design = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SpacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: SpacingX._20,
    gap: scale(12),
    paddingTop: SpacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: SpacingY._10,
    borderTopWidth: 1,
  },
  form: {
    gap: SpacingY._30,
    paddingVertical: SpacingY._15,
    paddingBottom: SpacingY._40,
  },
  inputContainer: {
    gap: SpacingY._15,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral400,
    paddingHorizontal: SpacingX._15,
    borderCurve: "continuous",
    borderRadius: 20,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownicon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  dropdownItemText: { color: colors.white },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: SpacingX._7,
  },
  dropwDownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: SpacingY._7,
    //top: 4,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: SpacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    marginRight: SpacingX._12,
    paddingHorizontal: SpacingY._15,
    borderRadius: radius._30,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: SpacingX._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SpacingX._5,
  },
});
