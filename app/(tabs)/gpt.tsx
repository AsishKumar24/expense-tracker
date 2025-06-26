import { useState } from 'react';
import { Alert, StyleSheet ,View ,Text } from 'react-native';
import Animated ,{FadeInDown} from 'react-native-reanimated';
import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useAuth } from '@/contexts/authContext';
import { colors, SpacingX, SpacingY } from '@/constants/Theme';
import { ScrollView } from 'react-native';

import { TransactionType } from '@/types';
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import axios from 'axios';
import { useRouter } from 'expo-router';
import { firestore } from '@/config/firebase';
import { verticalScale } from '@/utils/Styling';

const Welcome = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [financialAdvice, setFinancialAdvice] = useState<string | null>(null);
  const [financialSummary, setFinancialSummary] = useState<any >(null);
  const userID = user?.uid;
  const router = useRouter();
  const db = firestore

  const normalizeDate = (dateValue: Date | Timestamp | string | number): string => {
    if (dateValue instanceof Date) return dateValue.toISOString();
    if (dateValue instanceof Timestamp) return dateValue.toDate().toISOString();
    if (typeof dateValue === 'number') return new Date(dateValue).toISOString();
    return dateValue;
  };

  const sendTransactionData = async () => {
    if (!userID) {
      Alert.alert("Authentication Error", "Please sign in to analyze expenses");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const transactionsCollection = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsCollection,
        where("uid", "==", userID),
      );
      
      const querySnapshot = await getDocs(transactionsQuery);
      
      if (querySnapshot.empty) {
        Alert.alert("No New Data", "All transactions have already been analyzed");
        setIsLoading(false);
        return;
      }

      const transactionsData: TransactionType[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
       // console.log(data);
        return {
          id: doc.id,
          type: data.type,
          amount: data.amount,
          category: data.category || '',
          date: normalizeDate(data.date),
          description: data.description || '',
          image: data.image || null,
          uid: data.uid || userID,
          walletId: data.walletId,
        };
      });

      const response = await axios.post(
        "http://192.168.29.41:7777/analyze",
        {
          userId: userID,
          transactions: transactionsData,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 150000,
        }
      );

      //console.log("Analysis result:", response.data);

      // Mark as synced only after successful analysis
      // const batch = writeBatch(db);
      // querySnapshot.forEach(doc => {
      //   batch.update(doc.ref, { synced: true });
      // });
      // await batch.commit();

      // Set the financial advice and summary to display
      setFinancialAdvice(response.data.advice);
      setFinancialSummary(response.data.summary);
      
    } catch (error: any) {
      console.error("Analysis Error:", error);
      
      let errorMessage = "Failed to analyze expenses. Please try again.";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Analysis error: ${error.response.data?.error || error.response.status}`;
        } else if (error.request) {
          errorMessage = "No response from analysis server. Check your network.";
        }
      }
      
      Alert.alert("Analysis Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
  <ScrollView style={design.scrollContainer} contentContainerStyle={{ paddingBottom: 20 }}>
    <View style={design.generatedTextContainer}>
      {financialAdvice ? (
        <Typo size={16} fontWeight="400">
          {financialAdvice}
        </Typo>
      ) : (
        <Typo>No advice generated yet. Click Analyze to start!</Typo>
      )}
    </View>

    {financialSummary && (
      <View style={design.balanceView}>
        <Text style={design.summaryText}>
          Total Income: ₹{financialSummary.totalIncome?.toFixed(2)}{'\n'}
          Total Expenses: ₹{financialSummary.totalExpenses?.toFixed(2)}{'\n'}
          Net Savings: ₹{financialSummary.netSavings?.toFixed(2)}{'\n'}
          Savings Rate: {(financialSummary.savingsRate * 100).toFixed(1)}%
        </Text>
      </View>
    )}
  </ScrollView>

  <Animated.View
    entering={FadeInDown.springify().damping(12).duration(2000).delay(500)}
    style={design.buttonContainer}
  >
    <Button 
      onPress={sendTransactionData}
      disabled={isLoading}
      loading={isLoading}
    >
      <Typo size={20} color={colors.neutral800} fontWeight="600">
        {isLoading ? "Sending Transactions..." : "Analyze"}
      </Typo>
    </Button>
  </Animated.View>
</ScreenWrapper>
  );
};

const design = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: SpacingX._20,
    marginTop: verticalScale(8),
  },
  balanceView: {
    height: verticalScale(180),
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  
  buttonContainer: {
    width: "100%",
    paddingHorizontal: SpacingX._25,
    paddingVertical:SpacingY._15
  },
  generatedTextContainer: {
    flex: 0.5,
        paddingHorizontal: SpacingX._20,
        marginTop: verticalScale(8),
    
  },
});

export default Welcome;