// hooks/useUserTransactions.ts
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { TransactionType } from '@/types'
import { where, orderBy, limit, QueryConstraint } from 'firebase/firestore'

const useUserTransactions = () => {
  const { user } = useAuth()

  // if user not ready yet, skip running query
  const constraints: QueryConstraint[] | null = user?.uid
    ? [where('uid', '==', user?.uid), orderBy('date', 'desc') , limit(30)]
    : null

  const fallback = { data: [], error: null, loading: false }

  const result = constraints
    ? useFetchData<TransactionType>('transactions', constraints)
    : fallback

  return result // returns { data, error, loading }
}

export default useUserTransactions
