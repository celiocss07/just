import React, {useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList}  from 'react-native';
import Styles from './style';


function Meu_Staff() {

    const [loading, setLoading]  = useState(false);

    const referal = [

        {id: 1, nome: "Célio Sebastião Salvador", date: "12-12-2020",img: '../Imagens/imagem_pass.jpg'},
        {id: 2, nome: "Edmilson Congo Silvério", date: "12-12-2020",img: '../Imagens/imagem_pass.jpg'},
        {id: 3, nome: "Simão Pedro Madiadia", date: "12-12-2020",img: '../Imagens/imagem_pass.jpg'},
        {id: 4, nome: "Dário Pedro Sassa", date: "12-12-2020",img: '../Imagens/imagem_pass.jpg'},
        {id: 5, nome: "Simão Pedro Madiadia", date: "12-12-2020",img: '../Imagens/imagem_pass.jpg'},
        {id: 6, nome: "Dário Pedro Sassa", date: "12-12-2020",img: '../Imagens/imagem_pass.jpg'}

    ]

    
  return (
      <View style = {Styles.container}>

          <View style = {Styles.containerDesc}>
                <Text style = {Styles.desc}>
                Esta opção permite o passageiro adicionar os seus amigos no seu staff, sendo ele o cabeça deste staff, 
                ganhando uma comissão por cada viagem realizada por um amigo no seu staff. 
        
                </Text>
                <TouchableOpacity style={{flexDirection:"row",padding:8,justifyContent: "space-around", alignItems: "center", width:"70%",backgroundColor:"rgb(175,98,30)", borderRadius: 10, marginTop: 8}}>
                <Text style={{color: "#FFF"}}> Convidar Amigos</Text>
                <Image 
                    source={require('../Imagens/icons8_Share_30px.png')}
                />
            </TouchableOpacity>

          </View>

          <View style = {Styles.items}>

                {
                    loading ? (
                        < ActivityIndicator size = "large" color = "#da552f" />
                    ) 
                    :
                    (
                        <FlatList
                            data={referal}
                            showsVerticalScrollIndicator={false}

                            style = {{width: "90%"}}
                            keyExtractor = {referal.id}
                            renderItem={({item}) => (

                                <TouchableOpacity
                                    onPress = { () => {}}
                                    style = {Styles.item}
                                >
                                    <View style = {Styles.containerImg}>
                                        <Image 
                                            source = {require('../Imagens/imagem_pass.jpg')} 
                                            style={Styles.img}
                                        />
                                    </View>

                                    <View style = {Styles.containerTexto}>
                                        <Text style = {Styles.texto}> {item.nome} </Text>
                                        <Text style = {Styles.texto}> {item.date} </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )
                }
            
          </View>
          
      </View>
  );
}

export default Meu_Staff;