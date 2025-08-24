import { firestore } from '@/config/firebase'
import { TransactionType, WalletType, ResponseType } from '@/types'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { UPLOAD_IMAGE_TO_CLOUDINARY } from './imageService'
import { create_or_update_Wallet } from './walletService'
import { scale } from '@/utils/Styling'
import { colors } from '@/constants/Theme'
import { getLast12Months, getLast7Days, getYearsRange } from '@/utils/common'

export const create_or_update_transaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: 'Invalid transaction data' }
    }
    if (id) {
      //todo : update existing transaction
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, 'transactions', id)
      )
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType
      // we have to revert only on three condition if the type and wallet and amount changes
      const revertOriginalIf =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId
      if (revertOriginalIf) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        )
        if (!res?.success) {
          return { success: false }
        }
      }
    } else {
      //update wallet for new transaction
      //update wallet
      //Why is order of parameters still important in TypeScript?
      //walletId! means it is never undefined
      let res = await updateWalletForNewTransaction(
        walletId!,
        type,
        Number(amount!)
      )
      if (!res?.success) {
        return { success: false, msg: res?.msg }
      }
    }
    if (image) {
      const ppUploadRes = await UPLOAD_IMAGE_TO_CLOUDINARY(
        image,
        /*folder name*/ 'transactions'
      )
      if (!ppUploadRes.success) {
        return {
          success: false,
          msg: ppUploadRes.msg || 'error uploading Receipt image'
        }
      }
      transactionData.image = ppUploadRes.data
    }

    const transactionRef = id
      ? doc(firestore, 'transactions', id)
      : doc(collection(firestore, 'transactions'))
    await setDoc(transactionRef, transactionData, { merge: true })

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id }
    }
  } catch (error: any) {
    console.log('error creating or updating transaction', error)
    return { success: false, msg: error?.msg }
  }
}

const updateWalletForNewTransaction = async (
  walletId: string,
  type: string,
  amount: number
) => {
  try {
    const walletRef = doc(firestore, 'wallets', walletId)
    const walletSnapshot = await getDoc(walletRef)
    if (!walletSnapshot.exists()) {
      console.log('error updating wallet for new transaction')
      return { success: false, msg: 'wallet Not found' }
    }
    const walletdata = walletSnapshot.data() as WalletType
    if (type == 'expnse' && walletdata.amount! - amount < 0) {
      //walletdata.amount! means it is not undefined we are promising that it is not undefined
      return {
        success: false,
        msg: 'Selected wallet do not have sufficient balance'
      }
    }
    const updateType = type == 'income' ? 'totalIncome' : 'totalExpense'
    const updatedWalletAmount =
      type == 'income'
        ? Number(walletdata.amount) + amount
        : Number(walletdata.amount) - amount
    const updatedTotals =
      type == 'income'
        ? Number(walletdata.totalIncome) + amount
        : Number(walletdata.totalExpense) + amount
    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals // we used [] because we had to update more than  one
    })

    return { success: true }
  } catch (error) {}
}

//update the existing transaction
const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    //old : const because it can't be reassigned
    const originalWalletSnapshot = await getDoc(
      doc(firestore, 'wallets', oldTransaction.walletId)
    )
    const originalWallet = originalWalletSnapshot.data() as WalletType
    //new : let bcoz it can reassigned
    let newWalletSnapshot = await getDoc(doc(firestore, 'wallets', newWalletId))
    let newWallet = newWalletSnapshot.data() as WalletType

    const revertType =
      oldTransaction.type == 'income' ? 'totalIncome' : 'totalExpense'

    const revertIncomeExpense: number =
      oldTransaction.type == 'income'
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount)

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense //wallet amount , after the transaction is removed

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount)

    // if user tries to convert income to expense on the same wallet
    //or if the user tries to increase the expense amount and dont have enough balance
    if (newTransactionType == 'expense') {
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: 'The selcetd wallet dont have enough balance'
        }
      }

      //if user tires to add expense from a new wallet but the wallet dont have enough balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: 'The selcetd wallet dont have enough balance'
        }
      }
    }

    await create_or_update_Wallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount
    })

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // refetch the newWallet because we may have just updated it
    newWalletSnapshot = await getDoc(doc(firestore, 'wallets', newWalletId))
    newWallet = newWalletSnapshot.data() as WalletType

    const updateType =
      newTransactionType == 'income' ? 'totalIncome' : 'totalExpense'
    const updatedTransactionAmount: number =
      newTransactionType == 'income'
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount)
    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount
    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    )

    return { success: true }
  } catch (error) {}
}

export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    // Fetch transactions within the last 7 days for the specified user
    const transactionQueries = query(
      collection(db, 'transactions'),
      where('date', '>=', Timestamp.fromDate(sevenDaysAgo)),
      where('date', '<=', Timestamp.fromDate(today)),
      orderBy('date', 'desc'),
      where('uid', '==', uid)
    )

    const querySnapshot = await getDocs(transactionQueries)
    const weeklyData = getLast7Days()
    const transactions: TransactionType[] = []

    // Map transactions to the correct day in weeklyData and build the transactions array
    querySnapshot.forEach((doc: any) => {
      const transaction = doc.data() as TransactionType
      transaction.id = doc.id // Include document ID in the transaction data
      transactions.push(transaction)

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split('T')[0] // as Mon, Tue
      const dayData = weeklyData.find(day => day.date === transactionDate)

      if (dayData) {
        if (transaction.type === 'income') dayData.income += transaction.amount
        else if (transaction.type === 'expense')
          dayData.expense += transaction.amount
      }
    })

    // flatMap takes each day’s data and creates two entries
    // — one for income and one for expense
    // — then flattens these entries into a single array
    const stats = weeklyData.flatMap(day => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary
      },
      {
        value: day.expense,
        frontColor: colors.rose
      }
    ])

    return {
      success: true,
      data: {
        stats,
        transactions // Include all transaction details
      }
    }
  } catch (error) {
    console.error('Error fetching weekly transactions:', error)
    return {
      success: false,
      msg: 'Failed to fetch weekly transactions'
    }
  }
}
