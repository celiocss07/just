import React from 'react';
import { View, StyleSheet } from 'react-native';

// import { Container } from './styles';

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        
        alignItems: "center",
        padding: 16
    },
    containerDesc: {
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24
    },
    desc: {
        fontSize: 13,
        fontStyle: "italic",
        textAlign: "justify"
    },
    items: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },

    item: {
        width: "100%",
        flexDirection: "row",
        backgroundColor:"#FFF",
        borderColor: "#603915",
        borderRadius: 5,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,

    },
    containerImg: {
        width: "30%",
        justifyContent: "center",
        alignItems: "center"
    },
    img: {
        width:"60%",
        height: 50,
        borderRadius: 100
    },
    containerTexto: {
        justifyContent: "center"
    },
    texto: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000",
        lineHeight: 23
    }





})

export default Styles;