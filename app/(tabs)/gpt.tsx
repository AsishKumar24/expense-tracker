import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Icons from 'phosphor-react-native';
import axios from 'axios';
import { where } from 'firebase/firestore';

import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, SpacingX, SpacingY } from '@/constants/Theme';
import { scale, verticalScale } from '@/utils/Styling';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { expenseCategories, incomeCategory } from '@/constants/data';
import { create_or_update_transaction } from '@/services/transactionServices';
import { TransactionType, WalletType } from '@/types';

// ⚠️ Point this at the machine running expense-tracker-backend.
// Use your computer's LAN IP (same as the /analyze feature) so a real device
// can reach it. For an Android emulator use http://10.0.2.2:7777.
const API_URL = 'http://192.168.29.41:7777';

type ChatRole = 'user' | 'bot';
type ChatMessage = { id: string; role: ChatRole; text: string };

// Shape the backend returns for a "log" intent.
type ParsedTransaction = {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  walletName: string | null;
};

const GptChat = () => {
  const { user } = useAuth();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // Live list of the user's wallets (needed to attach a logged transaction).
  // Only build the uid filter once the user is loaded — passing undefined to
  // where() throws, and the hook re-subscribes when this constraint changes.
  const { data: wallets } = useFetchData<WalletType>(
    'wallets',
    user?.uid ? [where('uid', '==', user.uid)] : []
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'bot',
      text: "Hi! I'm your money assistant. Tell me things like \"spent 200 on coffee\" or \"got 5000 salary\" and I'll log them for you. You can also just ask for budgeting tips. 💸",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const pushBot = (text: string) =>
    setMessages(prev => [...prev, { id: `${Date.now()}-b`, role: 'bot', text }]);

  // Turn the parsed transaction into a real Firestore write via the existing service.
  const logTransaction = async (
    t: ParsedTransaction,
    reply: string
  ): Promise<string> => {
    if (!user?.uid) return 'Please sign in first.';
    if (!wallets.length)
      return "You don't have a wallet yet — create one in the Wallet tab first, then I can log this. 👛";

    const amount = Number(t.amount);
    if (!amount || amount <= 0)
      return "I couldn't work out the amount — how much was it?";

    // Match the wallet name the model picked, otherwise fall back to the first wallet.
    let wallet = wallets[0];
    if (t.walletName) {
      const match = wallets.find(
        w => w.name?.toLowerCase() === String(t.walletName).toLowerCase()
      );
      if (match) wallet = match;
    }

    const type = t.type === 'income' ? 'income' : 'expense';
    const category =
      type === 'income' ? incomeCategory.value : t.category || 'others';

    const payload: Partial<TransactionType> = {
      type,
      amount,
      category,
      description: t.description || '',
      walletId: wallet.id!,
      date: new Date(),
      uid: user.uid,
      image: null,
    };

    const res = await create_or_update_transaction(payload);
    if (res.success) {
      const label = type === 'income' ? 'income' : category;
      return `${reply}\n\n✅ Logged ₹${amount} ${label} to "${wallet.name}".`;
    }
    return res.msg || "Couldn't save that transaction — try again?";
  };

  const errorText = (e: any): string => {
    if (axios.isAxiosError(e)) {
      if (e.response)
        return `Server error: ${e.response.data?.error || e.response.status}`;
      if (e.request)
        return 'No response from the chat server. Check your network / server IP.';
    }
    return 'Something went wrong. Please try again.';
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      // Send the last few turns for context (keep the payload small).
      const history = messages
        .slice(-8)
        .map(m => ({ role: m.role, text: m.text }));
      const categories = Object.values(expenseCategories).map(c => c.value);
      const walletNames = wallets.map(w => w.name);

      const res = await axios.post(
        `${API_URL}/chat`,
        { message: text, history, categories, wallets: walletNames },
        { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
      );

      const data = res.data;
      let reply: string = data?.reply || '…';

      if (data?.intent === 'log' && data?.transaction) {
        reply = await logTransaction(data.transaction as ParsedTransaction, reply);
      }
      pushBot(reply);
    } catch (e: any) {
      console.log('chat error', e);
      pushBot(errorText(e));
    } finally {
      setSending(false);
    }
  };

  const renderBubble = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          design.bubble,
          isUser ? design.userBubble : design.botBubble,
        ]}
      >
        <Typo
          size={15}
          color={isUser ? colors.neutral900 : colors.white}
          fontWeight="400"
        >
          {item.text}
        </Typo>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.neutral900 }}>
      <KeyboardAvoidingView
        style={design.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={design.header}>
          <Typo size={22} fontWeight="600">
            Assistant
          </Typo>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderBubble}
          contentContainerStyle={design.listContent}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />

        {sending && (
          <View style={design.typingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Typo size={13} color={colors.neutral400}>
              {'  '}Thinking…
            </Typo>
          </View>
        )}

        <View style={design.inputRow}>
          <TextInput
            style={design.input}
            placeholder="Message… e.g. spent 200 on coffee"
            placeholderTextColor={colors.neutral400}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!sending}
            multiline
          />
          <TouchableOpacity
            style={[design.sendBtn, (!input.trim() || sending) && design.sendBtnOff]}
            onPress={sendMessage}
            disabled={!input.trim() || sending}
          >
            <Icons.PaperPlaneRight
              size={verticalScale(22)}
              color={colors.neutral900}
              weight="fill"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default GptChat;

const design = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: SpacingX._20,
    paddingBottom: SpacingY._10,
  },
  listContent: {
    paddingHorizontal: SpacingX._15,
    paddingBottom: SpacingY._15,
    gap: SpacingY._10,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: SpacingX._15,
    paddingVertical: SpacingY._10,
    borderRadius: radius._15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius._3,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral800,
    borderBottomLeftRadius: radius._3,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SpacingX._20,
    paddingBottom: SpacingY._7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SpacingX._10,
    paddingHorizontal: SpacingX._15,
    paddingVertical: SpacingY._10,
    borderTopWidth: 1,
    borderTopColor: colors.neutral800,
  },
  input: {
    flex: 1,
    maxHeight: verticalScale(120),
    minHeight: verticalScale(44),
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    paddingHorizontal: SpacingX._15,
    paddingTop: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(8),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(8),
    color: colors.white,
    fontSize: scale(15),
  },
  sendBtn: {
    height: verticalScale(44),
    width: verticalScale(44),
    borderRadius: radius._20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: {
    backgroundColor: colors.neutral600,
  },
});
