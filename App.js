import React, { useState, useEffect } from "react";
import { View, PermissionsAndroid, TextInput, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from "react-native";

import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from 'react-native-geolocation-service';
import {lineString as makeLineString} from '@turf/helpers';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import LocationIQ from 'react-native-locationiq';
import axios from 'axios';

const keyLocationIq = "pk.10758bee77f30d4994f54417f9392320";

LocationIQ.init(keyLocationIq);



 function App  () {

      const accessToken = 'sk.eyJ1IjoiY2VsaW9jc3MwNyIsImEiOiJja2l1YW5yZmoxMmE2MndzY2NpemZsa2Z4In0.fYcTu72K4MG9FrzkEychRA';
      MapboxGL.setAccessToken(accessToken);
      const [route, setRoute] = useState(null);
      const [text, setText] = useState(null);
      const [results, setResults] = useState([
        "cd"
      ]);
      const [location, setLocation] = useState([13.194855, -8.8900917]);
      const startingPoint = [13.231143898150401, -8.830630195018045];
      let destinationPoint = [ 13.18406215, -8.88854895 ];
      const directionsClient = MapboxDirectionsFactory({accessToken});
      const [startDestinationPoints, setStartDestinationPoints] = useState([startingPoint,  destinationPoint,location])
      const [isShow, setIsShow] = useState(false)
 
      function geoCoding() {

        LocationIQ.search("maianga")
        .then(json => {
            var lat = json[0].lat;
            var lon = json[0].lon;
            //console.log(json);
        })
        .catch(error => console.warn(error));

        LocationIQ.reverse(-8.830630195018045, 13.231143898150401)
        .then(json => {
            var address = json.address;
            console.log(address);
        })
        .catch(error => console.warn(error));

        
      }
  //Criador de rotas
      const fetchRoute = async () => {
            const reqOptions = {
              waypoints: [
                {coordinates: location},
                {coordinates: destinationPoint},
              ],
              profile: 'driving-traffic',
              geometries: 'geojson',
      };

      const res = await directionsClient.getDirections(reqOptions).send();
      //console.log(res.body.routes[0].geometry.coordinates);
      const newRoute = await makeLineString(res.body.routes[0].geometry.coordinates);
      setRoute(newRoute);
      startDestinationPoints.push(location)
    //console.log(startDestinationPoints)

  };


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
         setIsShow(true)
        
        
        

        console.log(results)
        //console.log(" RESULTADOS => ",response.data);
      })
      .catch((e) => {
        console.log("ERRO => ",e);
      });}else{
        setResults(["cd"])
        setIsShow(false)
      }
  };

  //Markers no mapa
  const renderAnnotations = () => {
    return (
      startDestinationPoints.map((point, index) => (
        <MapboxGL.PointAnnotation
            key={`${index}-PointAnnotation`}
            id={`${index}-PointAnnotation`}
            coordinate={point}> 
            
        </MapboxGL.PointAnnotation>
      ))
    );
  }

  

  useEffect(() => {
    
      Geolocation.getCurrentPosition(
          (position) => {
            //console.log(position);
            //setLocation([position.coords.longitude,position.coords.latitude])
            
            //console.log(startDestinationPoints)
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    
    //fetchRoute();
  }, [])
  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        zoomLevel={16}
        style={{...StyleSheet.absoluteFillObject}}
        >
           <MapboxGL.Camera
              zoomLevel={10}
              centerCoordinate={location}
              animationMode={'flyTo'}
              animationDuration={0}
          	>
          </MapboxGL.Camera>
          
          {renderAnnotations()}
          {
            route && (
              <MapboxGL.ShapeSource id='shapeSource' shape={route}>
                <MapboxGL.LineLayer id='lineLayer'  style={{lineWidth: 5, lineJoin: 'round', lineColor: 'rgb(175, 98, 30)', lineCap:'round', }}  />
              </MapboxGL.ShapeSource>
            )
          }
      </MapboxGL.MapView>
      <TextInput
              placeholder="Para onde?"
              placeholderTextColor="#000"
              style={styles.searchBox}
              onChangeText={(keySearch) => searchLocation(keySearch)}
              value={text}
            />
        {
             isShow ? (
              <FlatList
                data={results}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() =>{
                        //setText(item.display_place)
                        setIsShow(false)
                        setText(item.display_name)
                        startDestinationPoints.push( [parseFloat(item.lon), parseFloat(item.lat)])
                        destinationPoint = [parseFloat(item.lon), parseFloat(item.lat)]
                        Alert.alert(`${[parseFloat(item.lon), parseFloat(item.lat)]}`)
                        fetchRoute()
                      }}>
                      <Text>{item.display_place}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.osm_id}
                style={styles.searchResultsContainer} 
                showsVerticalScrollIndicator={true} 
            />
          ):(
            <Text>ol</Text>
          )
}

    </View>
  )
}export default App;

const styles = StyleSheet.create({
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
  },
  container: {
    
    ...StyleSheet.absoluteFill,
    backgroundColor: "#7159c1",
    justifyContent: "space-between",
    alignItems:"center",
    
    
  },
  autocompleteContainer: {
    zIndex: 10,
},
searchResultsContainer: {
    width: 340,
    height: 200,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
},
resultItem: {
  width: '100%',
  justifyContent: 'center',
  height: 40,
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
  paddingLeft: 15,
}
});