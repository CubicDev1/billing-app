import { View, Text } from 'react-native'
import React from 'react'
import moment from 'moment'

export function DateFormater(date: string) {
    return (
       moment(date).format("DD MMM YYYY")
    )
}