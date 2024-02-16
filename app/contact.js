import { View, Text } from 'react-native'
import React from 'react'
import Nav from './components/nav'

const contact = () => {
    
  return (
    <View>
      <Nav contact={true} />
      <Text>kontakt</Text>
    </View>
  )
}

export default contact