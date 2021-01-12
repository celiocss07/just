import React, { Component, useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, Linking, TextInput, Alert,KeyboardAvoidingView, Platform } from 'react-native';
import axios from "axios";
import Style from './style'
import api from './../../api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';


// import { Container } from './styles';

export default function Login( props) {
    
    
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [status, setStatus] = useState("Null");
    const [display, setDisplay] = useState('none');
    const [showAlert, setShowAlert] = useState(false);
    const [messageModal, setMessageModal] = useState('none');
    const [titleModal, setTitleModal] = useState('none');
    const [colorButton, setColorButton] = useState('green');
    
   
    async function intialLogin() {
        // console.log(this.state.data)
         //const { password, username} = this.state.data
         console.log("Credencias => ",password, userName)
       await api.post('/login',{
            
                password:password,
                username: userName,
                

         })
        .then( async response => {
           // console.log("sms => ",response.data)
            setStatus("Autorizado")
            setDisplay('none')
            props.navigation.navigate('Menu')
            await AsyncStorage.clear()
            let userData = await AsyncStorage.setItem('userData', JSON.stringify(response.data))
            let resData = await AsyncStorage.getItem('userData')
            console.log("\n ==============================================")
            console.log(JSON.parse(resData))
        })
        .catch( async err => {

            if(err.response){
                console.log("cdkwmc",err.response.data)
                setStatus("Não Autorizado")
                setDisplay('flex')
                await AsyncStorage.clear()

            }else{
                setColorButton('red')
                setMessageModal("Verifique sua conexão de internet!")
                setTitleModal("Erro de conexão")
                setShowAlert(true)
                console.log("cdkwmc",err)
            }
           
            
        })
       
        

        
    }
  
   
    return (
        <KeyboardAvoidingView 
            style={[Style.container, Style.darkBg]} 
            behavior={Platform.OS =="ios" ? "padding" : "height"}
        
        >
            <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={titleModal}
          message={messageModal}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Sair"
          confirmButtonColor={colorButton}
          onConfirmPressed={() => {
            setShowAlert(false)
          }}
          
        />
            <View style={Style.containerLogo}>
                    <Image 
                      source= { require('../Imagens/Logo.png')}
                      style={Style.logo}
                     />
            </View>  
                
            <View style={Style.containerTitle}>
                    <Text style={Style.msg('flex')}>Usuário ou senha inválidos!</Text>
            </View>

            <View style = {Style.containerForm}>

                  <TextInput 
                        placeholder = "Digite o seu E-mail" 
                        style = {Style.inputForm}
                        onChangeText = { text => setUserName(text) }
                      />

                  <TextInput 
                        placeholder = "Digite a sua Senha" 
                        style = { Style.inputForm} 
                        secureTextEntry={true}
                        onChangeText = { text => setPassword(text) }

                    />
                    
                    
                     <TouchableOpacity 
                    style = {Style.buttonForm}
                    onPress = {() => intialLogin()}
                    >
                      <Text style = {Style.buttonFormText}>Entrar</Text>
                  </TouchableOpacity>

                  <Text style={{color:"#333",marginTop:16}}>Esqueceu a 
                        <Text 
                            style={Style.text}
                            onPress={() => props.navigation.navigate('Cadastro')}
                        >  Senha?</Text> 
                  </Text>


                  <Text style={{color:"#333",margin:8, alignSelf:"center"}}>
                      <Text style={{color:"black"}}>--------------------------------</Text> 
                      <Text style={{fontWeight:"bold"}}> ou </Text>  
                      <Text>----------------------------</Text>

                    </Text>

                  <TouchableOpacity 
                    style = {[Style.buttonForm, Style.buttonFormNew]}
                    onPress = {() => {

                       props.navigation.navigate('Cadastro')
                        
                    }}
                    >
                      <Text style = {Style.buttonFormText}>Criar conta</Text>
                  </TouchableOpacity>

            </View>
  
              
            <View style={Style.containerTitle}>
                    <Text style={{color:"#707070"}}>@2020copyright_SOLTEC</Text>
            </View>
        </KeyboardAvoidingView>
    )
  
}

