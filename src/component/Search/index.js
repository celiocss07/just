import { useLinkProps } from '@react-navigation/native';
import React ,{useState}from 'react';
import { Platform, TouchableOpacity, View, Text, Image} from 'react-native';
import Modal from 'react-native-modal';
 
function myLocation( props) {

const [isModalVisible, setModalVisible] = useState(false);

const toggleModal = () => {
  setModalVisible(!isModalVisible);
};

  return (
    <View style={{width: "100%", justifyContent: "center", alignItems:"center", marginTop:8,}}>
      <Modal 
          
          isVisible={isModalVisible}
          style={{justifyContent: "space-between", alignItems:"center"}} 
      
      >
                <View style={{flexDirection:"row", justifyContent:"flex-start", width: "100%",  padding: 8}}>
                    <TouchableOpacity onPress={ ( ) => {toggleModal()} } style={{width:35, height:35}}>
                        < Image 
                                source={require('./../Imagens/icons8_Long_Arrow_Left_35px.png')}
                                style={{width: 35, height: 35, borderRadius: 100}}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{width:"100%", backgroundColor:"#FFF",height:"70%", padding:24,}}>
                      <View style={{width: "100%", alignItems:"center", marginBottom:16}}>
                            <TouchableOpacity 
                                  onPress={ () => {toggleModal()}}
                                  style={{backgroundColor:"grey", height:10, width: "50%", borderRadius:100}}
                            />

                            
                      </View>

                      <View style={{width: "100%"}}>
                            <Text style={{fontSize:19, lineHeight:29}}>Endereços :</Text>
                      </View>

                      <View style={{width: "100%", backgroundColor:"rgb(238, 238, 238)", borderRadius:5, marginBottom:16}}>
                          <TouchableOpacity 
                                onpres={ () => {}}
                                style={{width: "100%",flexDirection:"row" , padding: 8, alignItems:"center"}}
                            
                            >
                                <Image 
                                   source={require('./../Imagens/icons8_User_Location_50px.png')} 
                                />

                                <Text style={{marginLeft:8, fontWeight:"bold"}}>Usar minha localização actual</Text>
                          </TouchableOpacity>
                      </View>

                      <TouchableOpacity 
                            onPress={ () => {}}
                            style={{width: "100%", backgroundColor:"rgb(238, 238, 238)", borderRadius:5, marginBottom:16, flexDirection:"row", alignItems:"center", padding: 8}}
                      >
                            <View style={{}}>
                                    <Image 
                                       source={require('./../Imagens/icons8_Home_Address_50px.png')} 
                                    />
                            </View>
                            <View style={{width:"90%"}}>
                                  <Text style={{fontSize: 13}}>Casa</Text>
                                  <Text style={{fontSize: 13}}>Rua 2, Centralidade do Sequele, Cacuaco,
                                    Luanda, Angola</Text>
                                    <Text style={{color:"rgb(112, 112, 112)", fontSize: 13}}>Apt 101, Prédio 5, bloco 4</Text>
                            </View>
                      </TouchableOpacity>

                      <TouchableOpacity 
                            onPress={ () => {}}
                            style={{width: "100%", backgroundColor:"rgb(238, 238, 238)", borderRadius:5, marginBottom:16, flexDirection:"row", alignItems:"center", padding: 8, opacity:0.5}}
                      >
                            <View style={{marginRight: 8}}>
                                    <Image 
                                       source={require('./../Imagens/icons8_Add_Property_48px.png')}
                                       style={{opacity: 0.5}}
                                    />
                            </View>
                            <View style={{width:"90%"}}>
                                  <Text style={{fontSize: 13, opacity: 0.5}}>Adicionar outro Endereço</Text>
                            </View>
                      </TouchableOpacity>

                      <View style={{width: "90%"}}>

                      </View>
                </View>
      </Modal>
      <TouchableOpacity 
          onPress={ () => {toggleModal()}}
          style={{ borderRadius: 10,alignItems: "center",maxWidth:"85%", borderWidth:1,padding:4}}
      >
        <Text style={{fontSize: 13, fontStyle:"italic", textAlign:"center"}}> { props.myLocation.display_name }</Text>
      </TouchableOpacity>
    </View>
  );
};
 
export default myLocation;