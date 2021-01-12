import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, Linking, TextInput, Alert,CheckBoxProps, KeyboardAvoidingView } from 'react-native';
import axios from "axios";
import Style from './style';
import api from './../../api'

// import { Container } from './styles';

export default function Login( props) {
    
    const [pass, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [status, setStatus] = useState("Null");
    const [display, setDisplay] = useState('none');

     async function intialLogin() {
         
        
         console.log("dd",pass, userName)
        function sms(){
            axios.post(`http://52.30.114.86:8080/mimosms/v1/message/send?token=0b87022483b178a41242f2e6b6521542945989920`,{ sender: 'CallTaxi', recipients:'945989920', text:'Testando Server point' } ,config)
            .then(function(response){
              console.log("surviving....");
              console.log(response.data)
            })
              .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
              });
            }

      api.post("/sign-up", {
              
                username: userName,
                password: pass,
                password_repeat: pass,
                email: userEmail,
                phonenumber: userPhone
            
        })
        .then(response => {
            console.log(response.data)
            props.navigation.navigate('Verificacao')
        } )
        .catch(err => {
            console.log("cdkwmc",err.response.data)
            Alert.alert("Dados incompletos!")
        })
    }
  
    return (
        <KeyboardAvoidingView 
        style = { Style.container}
        behavior={Platform.OS =="ios" ? "padding" : "height"}
        >
            <View style={Style.containerLogo}>

                <Image 
                  source= { require('../Imagens/Logo.png')}
                  style= { Style.logo}
                 />

                <View style={Style.containerTitle}>
                    <Text style={Style.msg('flex')}>Cadastre-se</Text>
                </View>

            </View>

           

            <View style = {Style.containerForm}>
                  <TextInput 
                        placeholder = "Nome de usuário" 
                        style = { Style.inputForm}
                        onChangeText = {(e) => {
                            setUserName(e)
                        }}
                    />
                    <TextInput 
                        placeholder = "Telemóvel" 
                        style = { Style.inputForm}
                        keyboardType={"phone-pad"}
                        onChangeText = {(e) => {
                            setUserPhone(e)
                        }}
                    />
                  
                      <TextInput 
                            placeholder = "E-mail" 
                            style = { Style.inputForm} 
                            
                            onChangeText = {(e) => {
                                setUserEmail(e)
                            }}
                      
                      />
                      <TextInput 
                            placeholder = "Password" 
                            style = { Style.inputForm} 
                            secureTextEntry={true} 
                            onChangeText = {(e) => {
                                setPassword(e)
                            }}
                      
                      />

                      <TextInput 
                            placeholder = "Repita a sua Password" 
                            style = { Style.inputForm}
                            secureTextEntry={true} 
                            onChangeText = {(e) => {
                       
                            }}
                        />

                        <TouchableOpacity 
                            style = {Style.buttonForm}
                            onPress = {() => {
                                intialLogin()
                            }}
                         >
                            <Text style = {Style.buttonFormText}>Próximo</Text>

                        </TouchableOpacity>

                         
                        <Text 
                            style={Style.text}
                            onPress={() => props.navigation.navigate('Login')}
                        > Já tenho conta! </Text> 
                  
              </View>
  
              <View style={Style.containerTitle}>
                    <Text style={{color:"#707070"}}>@2020copyright_SOLTEC</Text>
            </View>
  
              
  
        </KeyboardAvoidingView>
    )
  
}

