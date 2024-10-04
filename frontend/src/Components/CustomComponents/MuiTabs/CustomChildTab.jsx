import { Tab } from '@mui/material'
import React from 'react'

export default function CustomChildTab({value ,label,CutomTablepanelfunction}) {


  return (
    <Tab value={value} label={label} {...CutomTablepanelfunction}/>
  )
}
