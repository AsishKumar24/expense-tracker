import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/contexts/authContext'

const StackLayout = () => {
  return (
     
      
      <Stack
          screenOptions={{
              headerShown:false,
          }}
      >
 
          <Stack.Screen name="(modals)/ProfileModal" options={{ presentation: "modal" }} />
          <Stack.Screen name="(modals)/WalletModal" options={{ presentation: "modal" }} />
          <Stack.Screen name="(modals)/TransactionModal" options={{presentation:"modal"}}/>
  
          
      </Stack>
  )
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <StackLayout />
        </AuthProvider>
    )
}

const styles = StyleSheet.create({})

// //i have used stack but never  used stack screen to it  that your app is using Tabs as the main navigator.
// If you're only using tabs, then the stack never gets used unless a screen within the tabs navigates to a stack screen.
//Using Tabs as Root: If your main layout is a tab navigator, your stack navigator (_Layout.tsx) isn't controlling the navigation.
// You used navigation directly (e.g., router.push('/login')) – You navigated to the screen without manually defining it inside your StackLayout.tsx.
// Expo Router automatically registers files as screens – If you have a login.tsx file inside app/, Expo Router treats it as a screen, even if it's not explicitly inside a <Stack.Screen />.
// Your navigation structure might be using a file-based system instead of a manually defined stack.
// // do not use .tsx after the file is named in stack.screen
