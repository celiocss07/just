import React, {useState, useEffect, useRef} from 'react';
import { View, ActivityIndicator,Alert, StyleSheet, Text,FlatList, TouchableOpacity, Image, TextInput, PermissionsAndroid } from 'react-native';
import OneSignal from 'react-native-onesignal';
//import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './../../api'
import io from "socket.io-client";
import RadioButton from '../radioButton';
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from 'react-native-geolocation-service';
import {lineString as makeLineString, point} from '@turf/helpers';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import LocationIQ from 'react-native-locationiq';
import Search2 from './../Search/index'
import Details from './../Detalhes';
import { useLinkProps } from '@react-navigation/native';
//import { FlatList } from 'react-native-gesture-handler';

// import { Container } from './styles';

const keyLocationIq = "pk.10758bee77f30d4994f54417f9392320";
LocationIQ.init(keyLocationIq);


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
    backgroundColor: "#7159c1",
    justifyContent: "space-between",
    alignItems:"center",
        
        
    },
    searchBox: {
        width: 340,
        height: 50,
        fontSize: 18,
        borderRadius: 8,
        borderColor: '#aaa',
        color: '#000',
        backgroundColor: '#fff',
        borderWidth: 1.5,
        paddingLeft: 15,
        position:'absolute',
        top:60
      },
      autocompleteContainer: {
        zIndex: 10,
    },
    searchResultsContainer: {
        width: 340,
        height: 200,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 110,
    },
    resultItem: {
      width: '100%',
      justifyContent: 'center',
      height: 40,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      paddingLeft: 15,
    }
})



function App( props) {

    const accessToken = 'sk.eyJ1IjoiY2VsaW9jc3MwNyIsImEiOiJja2l1YW5yZmoxMmE2MndzY2NpemZsa2Z4In0.fYcTu72K4MG9FrzkEychRA';
      MapboxGL.setAccessToken(accessToken);
      const [route, setRoute] = useState(null);
      const [text, setText] = useState(null);
      const [results, setResults] = useState([
        "cd"
      ]);
      
      const [location, setLocation] = useState([13.194855, -8.8900920]);
      const startingPoint = [13.231143898150401, -8.830630195018045];
      let destinationPoint = [ 13.18406215, -8.88854895 ];
      const directionsClient = MapboxDirectionsFactory({accessToken});
      const [startDestinationPoints, setStartDestinationPoints] = useState([startingPoint,  destinationPoint,location])
      const [show, setShow] = useState(null)
      const [click, setClick] = useState(null)
      const [distance, setDistance] = useState(2)
      const [address, setAddress] = useState({display_name:"Minha Localização"})
      const [reserve , setReserve] = useState({
        "reservefrom":{
          "lat": "address.lat",
          "lon":"address.lon",
          "address": "address.display_name"
        },
        "reserveto":{
          "lat": "toDestination.lat",
          "lon":"toDestination.lon",
          "address": "toDestination.display_name"
        },
        "rervedate":"",
        "paymethod": "card/cash",
        "passenger": "",
        "price": "",
        "expectedduration":"res.body.routes[0].duration",
        "distance":"res.body.routes[0].distance",
        "player_id": ",domj34"
      })
      const [to , setTo] = useState({lat:-8.830630195018045,lon:13.231143898150401,address:"Calemba2"})
      

      function geoCoding(vector) {

        /*LocationIQ.search("maianga")
        .then(json => {
            var lat = json[0].lat;
            var lon = json[0].lon;
            //console.log(json);
        })
        .catch(error => console.warn(error));
*/
        LocationIQ.reverse(vector)
        .then(json => {
            var address = json;
            console.log("RESULTADO => ",address);
            setAddress(address)
        })
        .catch(error => console.warn(error));

        
      }

      //Criador de rotas
      const fetchRoute = async (toDestination) => {
        console.log("TODESTINATION => ", toDestination)
       
        
        const reqOptions = {
          waypoints: [
            {coordinates: location},
            {coordinates: destinationPoint},
          ],
          profile: 'driving-traffic',
          geometries: 'geojson',
  };

  const res = await directionsClient.getDirections(reqOptions).send();
  console.log("DIRECIONS => ",res.body.routes[0]);
  console.log("DIRECIONS 00000 => ",to);

  var aux = {
    "reservefrom":{
      "lat": address.lat,
      "lon":address.lon,
      "address": address.display_name
    },
    "reserveto":{
      "lat": toDestination.lat,
      "lon":toDestination.lon,
      "address": toDestination.display_place
    },
    "rervedate":"",
    "paymethod": "card/cash",
    "passenger": "",
    "price": "",
    "expectedduration":res.body.routes[0].duration,
    "distance":res.body.routes[0].distance,
    "player_id": player_id
  }
  console.log("BURRRISSSE => ",aux)
  setReserve(aux)
  
  setDistance(res.body.routes[0].distance)
  const newRoute = await makeLineString(res.body.routes[0].geometry.coordinates);
  setRoute(newRoute);
  startDestinationPoints.push(location)

  if(res.body.routes[0]){
    setClick(true)
  }else{
    Alert.alert("Waiting...")
  }
//console.log(startDestinationPoints)

};

const [carros, setCarros] = useState([{latitude:-8.82871,longitude:13.8976}])
async function Driver() {
      api.get("/drivers-status",{

      })
      .then( response => {
        //console.log(" Position Drivers => ", response.data)
        setCarros(response.data)
      })
      .catch( err => {
        if(err.response){
          console.log(" Erro na requisição => ", err.response.data)
        }else{
          console.log(" Erro na app => ", err)
        }
      })
} 

//Pedido de permissão para localização
async function permission() {
    PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
          ],
          {
              title: 'Give Location Permission',
              message: 'App needs location permission to find your position.'
          }
      ).then(granted => {
        console.log(granted);
        
        resolve();
      }).catch(err => {
        console.warn(err);
        reject(err);
      });
  }
  const searchLocation = async (keySearch) => {
    setText(keySearch)
    
    if(keySearch.length > 3){
      
      axios
      .request({
        method: 'post',
        url: `https://api.locationiq.com/v1/autocomplete.php?key=${keyLocationIq}&q=${text}&countrycodes=AO&accept-language=pt`,
      })
      .then((response) => {
        console.log("TAMANHO => ",response.data.length)
       
          setResults(response.data
            
          )
        setShow(true)
        
        
        

        console.log(results)
        //console.log(" RESULTADOS => ",response.data);
      })
      .catch((e) => {
        console.log("ERRO => ",e);
      });}else{
        setResults(["cd"])
        setShow(false)
      }
  };

  
//Markers no mapa
/*const renderAnnotations = () => {
    return (
      startDestinationPoints.map((point, index) => (
        <MapboxGL.PointAnnotation
            key={`${index}-PointAnnotation`}
            id={`${index}-PointAnnotation`}
            coordinate={point}> 
            
        </MapboxGL.PointAnnotation>
      ))
    );
  }*/

  const image =  require("./../Imagens/sport-car.png") ;
  const renderAnnotations = () => {
   

    
      return (
        carros.map((point, index) => (
          
  <MapboxGL.MarkerView 
        coordinate={[point.longitude,point.latitude]} 
        id={`${index}-PointAnnotation`}
        key={`${index}-PointAnnotation`}
        draggable={true}
        
        
        >
        <View
          style={{
            width: 100,
            height: 50,
            borderRadius: 50,
            justifyContent:"center",
            alignItems:"center",
            flex:1
            
          }}
        >
        
          <Image source={image} style={{
          }} />
        </View>
      </MapboxGL.MarkerView>
  
          
        ))
      );
    
    
  }



    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };
      let idFrom = "jdj";

      async function info(){
          let data = await AsyncStorage.getItem('userData')
           data =  JSON.parse(data)
           data = await data.user.iduser
           idFrom = await  data
           await console.log("MEU TOKEN => ",data)
           await console.log("\n \n ++++++++",idFrom)
           
          
          await  console.log("jnle ", idFrom)
           
          
          
          
      }
      

const [loading, setLoading] = useState(false);
const [det, setDet] = useState(false);
const [coordinates, setCoordinates] = useState({});
const [isModalVisible, setModalVisible] = useState(false);
const [player_id, setPlayer_id] = useState([]);
const [message, setMessage] = useState([]);
const socket = io("http://teste-api.soltec.ao");
const [sms, setSms] = useState([
    
]);

const estilo = {
    color: "red"
}


socket.on("typing", (data) => console.log(sms))
let idTo ="";
async function connect() {
    await info()

    
       
        socket.emit("user_connected","6")
        socket.on("user_connected", (user) => console.log("Bom => ", user) )
    
   
}

const render = ({item}) => {
    
    if(item.idfrom == 1 ) {
       return(
        <View style={{width:"100%", flexDirection:"row",justifyContent:"flex-start",padding:8}}>
        <View style={{width:"70%", flexDirection:"row",justifyContent:"flex-start", backgroundColor:"rgba(0,104,138, 0.3)", padding:8, borderRadius:8}}>
                <Text style={{color:"black"}}>{item.message}</Text>
                </View>
    </View>
       )
     } else{
            return(
                <View style={{width:"100%", flexDirection:"row",justifyContent:"flex-end", padding:8}}>
                <View style={{width:"70%", flexDirection:"row",justifyContent:"flex-end", backgroundColor:"rgb(0,104,138)", padding:8, borderRadius:8}}>
                <Text style={{color:"black"}}>{item.message}</Text>
                </View>
            </View>
            )
     } 
       
    
    
}
  async function sendMessage() {
     

       await socket.emit("send_message", {
            from: "6",
            to: "1",
            message
        })
      await  sms.push({
            from: "6",
            to: "1",
            message
        })
        estilo.color="black"
  }

useEffect(
   () => {
      
        Geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              
              geoCoding([position.coords.latitude, position.coords.longitude])
              setLocation([position.coords.longitude,position.coords.latitude ])
              
              //console.log(startDestinationPoints)
              
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
              permission()
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

        connect()
        
         Driver()
      
        

        OneSignal.init('38fc263f-daad-441d-a48e-801050e92f10');
        OneSignal.addEventListener('received', onReceived);
        
        OneSignal.addEventListener('ids', onIds);
        OneSignal.addEventListener('opened', onOpened)
       
        
        OneSignal.getPermissionSubscriptionState((status) => {
          console.log(status);
      });
        socket.on("new_message",async (data) => {
            await sms.push(data)
            await console.log("mensagens => ", sms)
            
        })

        return () => {
          OneSignal.removeEventListener('received', onReceived);
          OneSignal.removeEventListener('opened', onOpened);
          OneSignal.removeEventListener('ids', onIds);
        }
    }
,[])

async function onReceived(notif ) {

    console.log("Notificação => ", notif)

}

async function onOpened(result) {
  //let reservecode = JSON.parse(JSON.parse(result.notification.payload.rawPayload).custom).a.reservecode;
  console.log('Mensagem: ', result.notification.payload)

   
    
     destinationPoint = await [location[0], location[1]]
    await fetchRoute({lat:"", lon:"", display_place:""})
    await setClick(false)
    setText("")
    
}
function onIds(device) {
  console.log('Device info: ', device);
  //
  setPlayer_id(device.userId)
}

function Notification(){

  //console.log("TESTES => ", JSON.parse(JSON.parse(JSON.stringify(data)).payload.additionalData.Reserva).from) 
      //SoundPlayer.play()
   //console.log("VOCÊ => ", (JSON.parse(notif.from).address).substring(1,5))
       return(

           <View style={{
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
                          padding: 16
                      }}>

                <View style={{alignItems:"flex-start",width:"100%", padding:16}}>

                <View style={{width:"100%", flexDirection: "row",justifyContent:"center", paddingBottom:16}}>
                      <Text style={{fontStyle: "italic", fontSize: 19.5}}>Dados do motorista</Text>
                </View>


                <View style={{width:"100%", flexDirection: "row",justifyContent:"flex-start",paddingBottom:16}}>
                      <Text style={{fontWeight: "bold"}}>Nome: </Text><Text> CÉLIO CSS</Text>
                </View>

                  <View style={{width:"100%", flexDirection: "row",justifyContent:"flex-start",paddingBottom:8}} >
                  <Text style={{fontWeight: "bold"}}>Carro:  </Text><Text> Hyunday, Elantra, LD-23-34-DF, Azul</Text>
                  </View>

                  <View style={{flexDirection: "row", alignItems:"center", width: "100%", justifyContent:"flex-start",marginTop:8}}> 
                      <Text style={{fontWeight: "bold"}}>Telemóvel: </Text>
                     
                      <Text> +244 993 409 340 </Text>
                  </View>
                  
                </View>
                
           </View>
       )
   }

async function getinfo(){

      
    
    //setLoading(true)
    await info()
    await api.post("/get-message", {

        from: "6",
        to: "1"
   })
    .then( async response => {
        console.log(" CANCELADA => ",response.data)
        setSms(response.data)
       //await setReferal(response.data.info);
       //await console.log("HELLO", referal)
        //await AsyncStorage.clear()
        //let userData = await AsyncStorage.setItem('userData', JSON.stringify(response))
        //info()
        setLoading(false)
    } )
    .catch(err => {
        console.log("cdkwmc",err)
       // Alert.alert("Dados incompletos!")
        setLoading(false)

    })
} 

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = '…';
const [inputVisible, setInputVisible] = useState(true)
const [confirmDriver, setConfirmDriver] = useState(false)
const [reservecode, setReserveCode] = useState(123)

  return (
      <View style={styles.container}>
            <Modal isVisible={isModalVisible}
                    style={{justifyContent: "flex-start", alignItems:"center"}}
            >
                <View style={{flexDirection:"row", justifyContent:"flex-start", width: "100%",  padding: 8}}>
                    <TouchableOpacity onPress={ ( ) => {toggleModal()} } style={{width:35, height:35}}>
                        < Image 
                                source={require('./../Imagens/icons8_Long_Arrow_Left_35px.png')}
                                style={{width: 35, height: 35, borderRadius: 100}}
                        />
                    </TouchableOpacity>
                </View>
                
                


                

                <View style={{width: "100%", backgroundColor: "#FFF", padding: 24, justifyContent:"flex-start", height:"90%"}}>
                
                        <View style={{width:"100%", height:"90%"}}>
                                <FlatList 
                                        data={sms}
                                        keyExtractor={ (item) => `${item.idmessage}`}
                                        renderItem={ render}
                                        
                                />
                        </View>

                        <View style={{width: "100%", backgroundColor:"#FFF", padding: 8, elevation: 10, flexDirection: "row", justifyContent:"space-between"}}>
                    <TextInput 
                        placeholder = "Digite o seu E-mail" 
                        style = {{borderWidth: 1, borderRadius: 10,padding:8, paddingLeft: 16, width: "85%"}}
                        onChangeText = { text => setMessage(text) }
                      />
                      <TouchableOpacity
                            onPress={ () => sendMessage()}
                            style={{ height: 40, marginLeft:8}}
                    >
                            <Image 
                                  source={require('./../Imagens/icons8_Sent_35px.png')}
                                  style={{width: 40, height: 40}}
                            />
                    </TouchableOpacity>

                </View>

                </View>

                
          </Modal>
          <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        zoomLevel={12}
        style={{...StyleSheet.absoluteFillObject}}
        zoomEnabled={true}
        
        
        >
           <MapboxGL.Camera
           
              zoomLevel={12}
              centerCoordinate={location}
              animationMode={'flyTo'}
              animationDuration={0}
              
          	>
          </MapboxGL.Camera>
          
          {renderAnnotations()}
          {
            route && (
              <MapboxGL.ShapeSource id='shapeSource' shape={route}>
                <MapboxGL.LineLayer id='lineLayer'  style={{lineWidth: 5, lineJoin: 'round', lineColor: 'rgb(0,104,138)', lineCap:'round', }}  />
              </MapboxGL.ShapeSource>
            )
          }
      </MapboxGL.MapView>
      <Search2 myLocation ={address} />

      {
        inputVisible ? (
          <TextInput
              placeholder="Para onde?"
              placeholderTextColor="#000"
              style={styles.searchBox}
              onChangeText={(keySearch) => searchLocation(keySearch)}
              onFocus={() => {
                setClick(false)
                setText("")
              }}
              value={text}
            />
        )
        :
        (
          <View />
        )
      }

         
        {
            
              show === true ? (<FlatList
                data={results}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() =>{
                        setTo(item)
                        //setText(item.display_place)
                        setShow(false)
                        setText(item.display_name)
                        
                        console.log("ITEM => ", item)
                        startDestinationPoints.push( [parseFloat(item.lon), parseFloat(item.lat)])
                        destinationPoint = [parseFloat(item.lon), parseFloat(item.lat)]
                        
                       
                        //Alert.alert(`${[parseFloat(item.lon), parseFloat(item.lat)]}`)
                        fetchRoute(item)
                        
                      }}>
                      <Text>{item.display_place}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.osm_id}
                style={styles.searchResultsContainer} 
                showsVerticalScrollIndicator={true} 
            />) : (
              <View/>
            )
          
}
          {console.log(coordinates)}
         
         { click === true ? (<Details distance = {distance} reserve={reserve} />):(<View/>)}
         {
           confirmDriver ? ( Notification() ) : ( <View />)
         }
         
          {/*<View style={{justifyContent: "center", alignItems: "flex-end", width:"100%", padding: 24}}>
          <TouchableOpacity
                onPress={ async () => {
                   await getinfo()
                   await toggleModal()
                }}
                style={{width: 60, height: 60, backgroundColor:"#FFF", justifyContent:"center", alignItems:"center", borderRadius:100, elevation: 10}}
                
          >
              <Image 
                    source={require('./../Imagens/icons8_Chat_40px.png')}
                    style={{width: 50, height: 50, borderRadius: 100}}
              />
          </TouchableOpacity>
              </View>*/}

          
      </View>
  );
}

export default App;