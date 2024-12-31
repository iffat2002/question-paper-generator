import React from 'react'
import { Page, Text, Document, PDFViewer, StyleSheet } from '@react-pdf/renderer';


const PDFFILE = () => {
  return (
    <Document>
        <Page style={StyleSheet.body}>
            <Text style={StyleSheet.header} fixed></Text>
            <Text style={StyleSheet.text}>

            </Text>
            <Text style={StyleSheet.PageNumber} render={({PageNumber,totalPages})=>`${pageNumber}/${totalPages} `} fixed />
        </Page>
    </Document>
  )
}

export default PDFFILE