import React, { useState, useEffect, createRef} from 'react';
import { View, StyleSheet, Text, TouchableOpacity,Image} from 'react-native';
import Modal from 'react-native-modal'
import RadioButton from '../radioButton';
import OneSignal from 'react-native-onesignal';
import AwesomeAlert from 'react-native-awesome-alerts';
//import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import api from '../../api';
import Axios from 'axios';
//DRIVER KEY APP :: 51d47682-4dcc-415b-a0d8-a58f9ef6c9b6

// import { Container } from './styles';
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        width: "100%",
        position: "absolute",
        bottom: 0,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
        borderColor: "#DDD",
        borderWidth: 1,
        borderStyle: "solid",
        alignItems:"center",
        padding: 20
    },

    TypeTitle: {
        fontSize:19,
        color: "#222"
    },
    TypeDescription: {
        fontSize: 13,
        color:"#666"
    },
    TypeImage: {
        height: 60,
        width: 80,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 0,
        marginLeft: 0
    },
    RequestButton: {
        backgroundColor:"rgb(0,104,138)",
        justifyContent: "center",
        alignItems: "center",
        height: 44,
        width: "45%",
        alignSelf: "stretch",
        marginTop: 10,
        borderRadius: 5
    },
    RequestButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15
    }



})

function Detalhes( props ){

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisiblePagamento, setModalVisiblePagamento] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [isModalVisibleDate, setModalVisibleDate] = useState(false);
    const [taxi, setTaxi] = useState(true);
    const [frete, setFrete] = useState(false);
    const [motoTaxi, setMotoTaxi] = useState(false);
    const [number, setNumber] = useState(1);
    const [servico, setServico] = useState("Táxi");
    const [plano, setPlano] = useState("Classe A");
    const [conforto, setConforto] = useState(false);
    const [economico, setEconomico] = useState(true);
    const [tipoPagamento, setTipoPagamento] = useState("Dinheiro");
   const [image, setImage] = useState(require('./../Imagens/Taxi2.png'));
   const [date, setDate] = useState(new Date())
   const [showAlert, setShowAlert] = useState(false);
   const [messageModal, setMessageModal] = useState('none');
   const [titleModal, setTitleModal] = useState('none');
   const [colorButton, setColorButton] = useState('green');
   const dias = [
       {label: "1", value:"1", hidden:true},{label: "2", value:"2"},{label: "3", value:"3"},
       
       {label: "4", value:"4"},{label: "5", value:"5"},{label: "6", value:"6"},
       
       {label: "7", value:"7"},{label: "8", value:"8"},{label: "9", value:"9"},
       
       
       {label: "10", value:"10"},{label: "11", value:"11"},{label: "12", value:"12"},
         
   ]
   const Ano = [
    {label: "2020", value:"2020", hidden:true},{label: "2021", value:"2021"}
]
const Mes = [
    {label: "Janeiro", value:"janeiro", hidden:true},{label: "Fevereiro", value:"fevereiro"},
    {label: "Março", value:"marco", hidden:true},{label: "Abril", value:"abril"},
    {label: "Maio", value:"maio", hidden:true},{label: "Junho", value:"junho"},
    {label: "Julho", value:"julho", hidden:true},{label: "Agosto", value:"agosto"},
    {label: "Setembro", value:"setembro", hidden:true},{label: "Outubro", value:"outubro"},
    {label: "Novembro", value:"novembro", hidden:true},{label: "Dezembro", value:"dezembro"},
   
]
 let reservar = "";
  

  

   const ser = {
    classe_A: require('./../Imagens/classe_A.jpg'),
    classe_B: require('./../Imagens/Classe_B.jpg'),
   }


   function changeImage() {
       setImage(ser.Taxi)
   }

   
   const sentReserve = ( ) => {
    
    reservar.price = props.distance*200/1000;
    reservar.passenger = number;
    reservar.paymethod = "card";
    reservar.reservedate = "2020-12-28"

    



   

    api.post("/reserve", {
        "reservefrom": reservar.reservefrom,
        "reserveto": reservar.reserveto,
        "reservedate":reservar.reservedate,
        "paymethod": reservar.paymethod,
        "passenger": reservar.passenger,
        "price": reservar.price,
        "expectedduration": reservar.expectedduration,
        "distance": reservar.distance,
        "player_id":reservar.player_id

    })
    .then( (Response) => {
        console.log("RESERVAR => ", Response.data)
        console.log("FEITO COM SUCESSO => ",Response.config)

        const instance2 = Axios.create({
            timeout: 1000,
            headers: {'Authorization': 'Basic NzU0OGZiNzItMzE4NS00ZjBiLTlmYWItNGEyMDU1ZjcyNDkz'}
          });

        instance2.post("https://onesignal.com/api/v1/notifications",{
            
    
            "app_id": "51d47682-4dcc-415b-a0d8-a58f9ef6c9b6",
            "included_segments": ["Subscribed Users"],
            "data": {"Reserva": `${JSON.stringify(Response.data)}`, "reservecode": `${Response.data.reservecode}`},
            "headings": {"en": "Viagem solicitada"},
            "contents": {"en": `Origem: ${JSON.parse(JSON.parse(JSON.stringify(Response.data)).from).address} \n\n Destino: ${JSON.parse(JSON.parse(JSON.stringify(Response.data)).to).address} \n\n Distancia: ${parseInt(JSON.parse(JSON.stringify(Response.data)).distance) / 1000} Km  \n\n Preço: ${parseInt(JSON.parse(JSON.stringify(Response.data)).price)} Kz`},
            "buttons": [{"id": "id2", "text": "Ignorar", "icon": "ic_menu_share"}, {"id": "id1", "text": "Aceitar", "icon": "ic_menu_send"}]
    
        },
        
        ).then( response => {
                        
                        console.log("Driver solicitado => ", response.data)

                        const instance = Axios.create({
                            timeout: 1000,
                            headers: {'Authorization': 'Basic ZmIwN2I1MmUtMzgxNi00OTg5LTk2MGYtZGU3Zjc0Mjk3ZjVj'}
                          });

                      
                        instance.post("https://onesignal.com/api/v1/notifications",{

                      
                            "app_id": "38fc263f-daad-441d-a48e-801050e92f10",
                            "include_player_ids": [`${reservar.player_id}`],
                            "headings": {"en": "Viagem solicitada"},
                            "contents": {"en": `Seu pedido foi enviada. Obrigado por escolher viajar com a CALL TÁXI!`},

                      
                        })
                        .then( response => console.log("FUIII => ", response.data))
                        .catch( err => console.log(" ERRO => " , err.response.data))


        })
        .catch( err => console.log(" ERRO => " , err.response.data))
    })
    .catch( err => {
        if(err.response){
            console.log("ERROR => ", err.response.data)
        }else{
            setMessageModal("Verifique sua conexão de internet!")
            setTitleModal("Erro de conexão")
            setShowAlert(true)
        }
        
        
    })

    
}
   const verify = (value) => {
            if(value === 'Classe A'){
                setTaxi(true)
                setFrete(false)
                setMotoTaxi(false)
                setImage(ser.Taxi)
                setServico("Táxi")
            }
             if(value === 'frete'){
                setTaxi(false)
                setFrete(true)
                setMotoTaxi(false)
                setImage(ser.Frete)
                setServico("Frete")


            }
            if(value === 'Classe B'){
                setTaxi(false)
                setFrete(false)
                setMotoTaxi(true)
                setImage(ser.MotoTaxi)
                setServico("MotoTaxi")


            }
            
   }
   

   function moreNumber() {
       if(number == 4){
           setNumber(1)
       }else{
           setNumber(number+1)
       }
   }
   function lessNumber() {
    if(number == 1){
        setNumber(number)
    }else{
        setNumber(number-1)
    }
}
  
    const toggleModal2 = () => {
      setModalVisible2(!isModalVisible2);
    };
    const toggleModalDate = () => {
        setModalVisibleDate(!isModalVisibleDate);
      };
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };
      const toggleModalPagamento = () => {
        setModalVisiblePagamento(!isModalVisiblePagamento);
      };
        useEffect(
            () => {
                reservar = props.reserve;
                OneSignal.init('38fc263f-daad-441d-a48e-801050e92f10');
                
        console.log("dde",reservar)

        return () => {
          
            
          }
            }
        , [])

      
        return(
            <View style={styles.container}>
                <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={titleModal}
          message={messageModal}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor={colorButton}
          onConfirmPressed={() => {
            setShowAlert(false)
          }}
          
        />
                <Modal isVisible={isModalVisible2}>
                  <View style={{flex: 1, justifyContent:"space-around", alignItems: "center"}}>

                      <View style={{width: "100%", height:"50%", justifyContent:"space-around"}}>

                          <TouchableOpacity style={{width: "100%", flexDirection: "row",backgroundColor:"#FFF", height:"40%", alignItems:"center", borderRadius: 16}}

                                onPress={() => {
                                    setEconomico(true)
                                    setConforto(false)
                                    setImage(ser.classe_A)

                                    setPlano("Classe A")
                                }}
                          >
                                <View style={{width:"10%", justifyContent:"center", alignItems:"center"}}>
                                    <RadioButton checked={economico}   onPress={() => {
                                        
                                    }} />
                                    
                                </View>
                                <View style={{width:"40%", alignItems:"center",justifyContent:"center", borderRightWidth:2}}>
                                    <Image  
                                        source={require('./../Imagens/classe_A.jpg')}
                                        style={{width:"70%", height:"40%"}}
                                    />
                                </View>

                                <View style={{width:"50%", justifyContent:"center", alignItems:"center"}}>
                                    <Text style={{fontSize: 19.5, fontWeight:"bold", fontStyle:"italic", textAlign: "center"}}> Classe A</Text>
                                    
                                </View>

                                
                          </TouchableOpacity>

                          <TouchableOpacity style={{width: "100%", flexDirection: "row",backgroundColor:"#FFF", height:"40%", alignItems:"center", borderRadius: 16}}
                                onPress={() => {
                                    setPlano("Classe B")
                                    setEconomico(false)
                                    setConforto(true)
                                    setImage(ser.classe_B)

                                }}
                          >
                                <View style={{width:"10%", justifyContent:"center", alignItems:"center"}}>
                                    <RadioButton checked ={conforto}  onPress={() => {
                                            
                                        }}
                                    />
                                    
                                </View>
                                <View style={{width:"40%", alignItems:"center",justifyContent:"center", borderRightWidth:2}}>
                                    <Image  
                                        source={require('./../Imagens/Classe_B.jpg')}
                                        style={{width:"70%", height:"40%"}}
                                    />
                                </View>

                                <View style={{width:"50%", justifyContent:"center", alignItems:"center"}}>
                                    <Text style={{fontSize: 19.5, fontWeight:"bold", fontStyle:"italic", textAlign: "center"}}> Classe B</Text>
                                    
                                </View>

                                
                          </TouchableOpacity>

                          
                      </View>
                   

                      <TouchableOpacity 
                            style={{width:50, height: 50, justifyContent: "center",alignItems: "center",backgroundColor: "rgba(0, 0, 0, 0.8)", borderRadius:100}}
                            onPress={toggleModal2}
                     >
                        <Text style={{color:"#FFF", fontWeight: "bold", fontSize:19}}> X </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>

                <Modal isVisible={isModalVisiblePagamento}>
                  <View style={{flex: 1, justifyContent:"space-between", alignItems: "center", marginTop: "40%"}}>

                    <View style={{backgroundColor:"#FFF", height:"40%", width:"90%", borderRadius: 10, paddingBottom: 24}}>

                                    <View style={{width:"100%", justifyContent:"center", alignItems:"center", padding:24}}>

                                    <Text style={{fontWeight:"bold", fontSize: 19.5}}>Pagamento</Text>

                                    </View>

                                    <View style={{width:"80%", paddingLeft:24}}>
                                    <TouchableOpacity
                                          style={{flexDirection:"row", alignItems:"center", width:"100%", padding:8, marginBottom: 8}}
                                          onPress={ () => {
                                              setTipoPagamento("Dinheiro")
                                              setModalVisiblePagamento(!isModalVisiblePagamento);
                                          }}
                                    >

                                        <Image 
                                              source={require('./../Imagens/icons8_Cash_in_Hand_40px_1.png')} 

                                          />
                                        <Text style={{fontSize:19, marginLeft:16, fontWeight:"bold"}}>Dinheiro</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity
                                          style={{flexDirection:"row", alignItems:"center", width:"100%", padding:8, marginBottom: 8}}
                                          onPress={ () => {
                                            setTipoPagamento("Multicaixa")
                                            setModalVisiblePagamento(!isModalVisiblePagamento);
                                        }}
                                    >

                                        <Image 
                                              source={require('./../Imagens/icons8_Bank_Cards_40px.png')} 

                                          />
                                        <Text style={{fontSize:19, marginLeft:16, fontWeight:"bold"}}>Multicaixa</Text>

                                    </TouchableOpacity>
                            </View>
                    </View>

                   

                    <TouchableOpacity style={{width:50, height: 50, justifyContent: "center",alignItems: "center",backgroundColor: "rgba(0, 0, 0, 0.8)", borderRadius:100}} onPress={toggleModalPagamento} >
                        <Text style={{color:"#FFF", fontWeight: "bold", fontSize:19}}> X </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>


                <Modal isVisible={isModalVisible2}>
                  <View style={{flex: 1, justifyContent:"space-around", alignItems: "center"}}>

                      <View style={{width: "100%", height:"50%", justifyContent:"space-around"}}>

                          <TouchableOpacity style={{width: "100%", flexDirection: "row",backgroundColor:"#FFF", height:"40%", alignItems:"center", borderRadius: 16}}

                                onPress={() => {
                                    setEconomico(true)
                                    setConforto(false)

                                    setPlano("Economico")
                                }}
                          >
                                <View style={{width:"10%", justifyContent:"center", alignItems:"center"}}>
                                    <RadioButton checked={economico}   onPress={() => {
                                        
                                    }} />
                                    
                                </View>
                                <View style={{width:"40%", alignItems:"center",justifyContent:"center", borderRightWidth:2}}>
                                    <Image  
                                        source={require('./../Imagens/economico.jpg')}
                                        style={{width:"80%", height:"60%"}}
                                    />
                                </View>

                                <View style={{width:"50%", justifyContent:"center", alignItems:"center"}}>
                                    <Text style={{fontSize: 19.5, fontWeight:"bold", fontStyle:"italic", textAlign: "center"}}> Económico</Text>
                                    
                                </View>

                                
                          </TouchableOpacity>

                          <TouchableOpacity style={{width: "100%", flexDirection: "row",backgroundColor:"#FFF", height:"40%", alignItems:"center", borderRadius: 16}}
                                onPress={() => {
                                    setPlano("Conforto")
                                    setEconomico(false)
                                    setConforto(true)
                                }}
                          >
                                <View style={{width:"10%", justifyContent:"center", alignItems:"center"}}>
                                    <RadioButton checked ={conforto}  onPress={() => {
                                            
                                        }}
                                    />
                                    
                                </View>
                                <View style={{width:"40%", alignItems:"center",justifyContent:"center", borderRightWidth:2}}>
                                    <Image  
                                        source={require('./../Imagens/conforto.jpg')}
                                        style={{width:"80%", height:"60%"}}
                                    />
                                </View>

                                <View style={{width:"50%", justifyContent:"center", alignItems:"center"}}>
                                    <Text style={{fontSize: 19.5, fontWeight:"bold", fontStyle:"italic", textAlign: "center"}}> Conforto</Text>
                                    
                                </View>

                                
                          </TouchableOpacity>

                          
                      </View>
                   

                      <TouchableOpacity 
                            style={{width:50, height: 50, justifyContent: "center",alignItems: "center",backgroundColor: "rgba(0, 0, 0, 0.8)", borderRadius:100}}
                            onPress={toggleModal2}
                     >
                        <Text style={{color:"#FFF", fontWeight: "bold", fontSize:19}}> X </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>

                <Modal isVisible={isModalVisibleDate}>
                            <View style={{width:"100%", height: "100%", justifyContent:"space-around", alignItems:"center"}}>
                            <View style={{width:"100%", height: "40%", backgroundColor:"#FFF", borderRadius: 20,justifyContent:"space-around", alignItems:"center" }}>
                            
                             
                            <View style={{flexDirection: "row",justifyContent:"space-around", padding:8, alignItems:"center"}}>
                            {/*<DropDownPicker
                                        items={Ano}
                                        defaultValue={"2020"}
                                        containerStyle={{height: 40, marginLeft:8, width:"30%"}}
                                        style={{backgroundColor: '#fafafa' }}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem={item => {
                                            setDate(item.value)
                                        }}
                            />
                           
                               
                            <DropDownPicker
                                        items={Mes}
                                        defaultValue={"dezembro"}
                                        containerStyle={{height: 40,width:"30%",marginLeft:8}}
                                        style={{backgroundColor: '#fafafa', }}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem={item => {
                                            setDate(item.value)
                                        }}
                            />
                            
                            
                            <DropDownPicker
                                        items={dias}
                                        defaultValue={"1"}
                                        containerStyle={{height: 40, width:"20%",marginLeft:8}}
                                        style={{backgroundColor: '#fafafa', }}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem={item => {
                                            setDate(item.value)
                                        }}
                            />*/}
                           
                            </View>

                            <TouchableOpacity
                                    onPress={ () => {}}
                                    style={{ justifyContent: 'center', alignItems: "center", width:"60%", backgroundColor:"#8CC84B", height:45, borderRadius:10}}
                            >
                                <Text style={{color: "#fff",fontWeight: "bold",fontSize: 15}}>
                                    Guardar
                                </Text>
                            </TouchableOpacity>
                            </View>
                            
                            
                            
                            <TouchableOpacity 
                                    style={{width:50, height: 50, justifyContent: "center",alignItems: "center",backgroundColor: "rgba(0, 0, 0, 0.8)", borderRadius:100}}
                                    onPress={toggleModalDate}
                            >
                                 <Text style={{color:"#FFF", fontWeight: "bold", fontSize:19}}> X </Text>
                            </TouchableOpacity>
                            </View>
                            
                </Modal>


                <View style={{flexDirection: "row", width:"100%", justifyContent:"space-between", paddingLeft:40, paddingRight:40,paddingTop:10,paddingBottom:10, backgroundColor:"rgb(238,238,238)"}}>
                <View style={{flexDirection: "row", justifyContent:"space-around", alignItems:"center"}}  >
                                    <Text style={styles.TypeTitle} onPress={toggleModal}> {servico} </Text>
                <Image 
                            source= { require('../Imagens/Chevron_Down_50px.png')}
                            style= { {width:12, height: 12, marginLeft:5}}
                        />
                </View>
                
                <View style={{flexDirection: "row", justifyContent:"space-around", alignItems:"center"}}>
                <Text style={styles.TypeTitle} onPress={toggleModal2}> {plano} </Text>
                <Image 
                            source= { require('../Imagens/Chevron_Down_50px.png')}
                            style= { {width:12, height: 12, marginLeft:5}}
                        />
                </View>


                </View>

                <View style={{flexDirection: "row", alignItems: "center",justifyContent:"space-around", width:"100%", PaddingTop: 10, borderBottomWidth:1}}>
                    <View>
                    <Image source={image} style={styles.TypeImage} />
                    </View>
                   
                   
                    <View  style={{alignItems: "center",justifyContent:"space-around"}}>
                        <Text style={{fontSize:13, color:"rgb(107,107,107)", marginBottom:8}}>Passageiro(s)</Text>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems:"center"}}>

                        <TouchableOpacity
                        onPress={() => {lessNumber()}}
                        style={{borderRadius: 100, backgroundColor: "rgba(0,0,0, 0.1)", justifyContent:"center", alignItems:"center", width:25}}
                        >
                            <Text style={{fontSize: 19, fontWeight:"bold", color:"rgb(175,98,30)"}}>-</Text>
                        </TouchableOpacity>
                            
                                    <Text style={{fontSize:19, color:"#222", fontWeight:"bold", marginLeft:8, marginRight:8}}> {number}</Text>

                        <TouchableOpacity
                        onPress={() => {moreNumber()}}
                        style={{borderRadius: 100, backgroundColor: "rgba(0,0,0, 0.1)", justifyContent:"center", alignItems:"center",width:25}}
                        >
                            <Text style={{fontSize: 19, color:"rgb(175,98,30)"}}>+</Text>
                        </TouchableOpacity>

                        </View>
                   
                    </View >
                        

                    
                </View>

                <View style={{flexDirection: "row", width: "100%",paddingTop:10, paddingBottom:10,justifyContent:"center"}}>
                    <View style = {{justifyContent: "center" ,width:"50%", alignItems: "center", borderRightColor:"#222",borderRightWidth:2}}>
                        <Text style={{fontSize:13, color:"rgb(107,107,107)"}}>Pagamento</Text>
                        <Text style={{fontSize:19, color:"#222", fontWeight:"bold"}} onPress = {toggleModalPagamento}> {tipoPagamento} </Text>
                    </View>

                    <View style = {{justifyContent: "center" ,width:"50%", alignItems: "center"}}>
                        <Text style={{fontSize:13, color:"rgb(107,107,107)"}}>Cotação</Text>
                        <Text style={{fontSize:19, color:"#222", fontWeight: "bold"}}> { parseInt((parseFloat(props.distance)*200)/1000)} Kz</Text>
                    </View>
                    
                </View>

                <View>
      
     
    </View>
                
                

               

                <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%",paddingTop:10}}>
                <TouchableOpacity style={styles.RequestButton} onPress={() => {
                    sentReserve()
                }}>
                    <Text style={styles.RequestButtonText}>Viajar agora</Text>
                </TouchableOpacity>
                
                </View>
            </View>
        )
    }

    export default Detalhes;
