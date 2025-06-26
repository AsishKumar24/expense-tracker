import { Href } from "expo-router"
import { Firestore, Timestamp } from "firebase/firestore"
import { Icon } from "phosphor-react-native";
import React, { ReactNode } from "react";
//Promise<>
// This indicates that the function is asynchronous and returns a Promise.
// A Promise is used for handling asynchronous operations in JavaScript (e.g., API calls, database interactions).
//it is ;like waiting for an answer from the server
//When we use a Promise in JavaScript, it guarantees that the computer will give us a result—but we have to wait.
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    ImageStyle,
    PressableProps,
    TextInput,
    TextInputProps,
    TextProps,
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    

} from "react-native";

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
}

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    children: any | null;
    style?: TextStyle;
    textProps?: TextProps;

};

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
    onPress?: () => void;
    loading?: boolean;
    hasShadow?: boolean;
    children : React.ReactNode;
};

export type BackButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
};
export type InputProps  = TextInputProps & {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
    placeholder?: string;
    onChangeText?: (value: string) => void;
    secureTextEntry?: boolean;
    value?: string; //label?: string;
    //error?:string;

};
export type AuthContextType = {
    user: UserType;
    setUser: Function;
    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; msg?: string }>;
    register: (
        email: string,
        password: string,
        name: string

        
    ) => Promise<{ success: boolean; msg?: string }>;
    
    updateUserData: (userId: string) => Promise<void>;
};
export type UserType = {
    uid?: string;
    email?: string | null;
    name: string | null;
    image?: any;
} | null;
export type HeaderProps = {
    title?: string,
    style?: ViewStyle,
    leftIcon?: ReactNode
    rightIcon?: ReactNode,
//     onLeftIconPress?: () => void,
//     onRightIconPress?: () => void 
}
export type accountOptionType = {
    title: string,
    icon: React.ReactNode;
    bgColor: string;
    routeName?: any;
}
export type ModalWrapperProps = {
    style?: ViewStyle,
    children: React.ReactNode;
    bg?: string;
}
export type UserDataType = {
    name: string;
    image?: any;
}
export type ResponseType = {
    success: boolean,
    data?: any,
    msg?: string,
    
}
export type WalletType = {
    id?: string;
    name: string;
    amount?: number;
    totalIncome?: number;
    totalExpense?: number;
    image: any;
    uid?: string;
    created?: Date;
}
export type ImageUploadProps = {
    file?: any;
    onSelect: (file: any) => void;
    onClear: () => void;
    containerStyle?: ViewStyle;
    imageStyle?: ViewStyle;
    placeholder?: string;
}
export type TransactionType = {
  id?: string
  type: string
  amount: number
  category?: string
    date: Date | Timestamp | string | number;
  description?: string
  image?: any
  uid?: string
  walletId: string
}

export type TransactionListType = {
    data  : TransactionType[];
    title?: string;
    loading?: boolean;
    emptyListMessage?: string;   
}

export type TransactionItemProps = {
    item: TransactionType;
    index: number;
    handleClick: Function;
};
export type CategoryType = {
    label: string,
    value: string;
    icon: Icon;
    bgColor: string;
}
export type ExpenseCategoriesType = {
    [key: string]: CategoryType
}