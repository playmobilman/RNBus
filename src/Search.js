import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Keyboard, StyleSheet, TextInput, View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Spinner from "react-native-loading-spinner-overlay";

export default function Search() {
  const [data, setData] = useState([]);
  const [linea, setLinea] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // uso el hook useRef que me permited
  // almacenar una variable muteable en .current
  // y no se reinicia su valor como una variable común
  // ni actualiza el componente al cambiar como el useState
  // docs: https://reactjs.org/docs/hooks-reference.html#useref
  const timer = useRef(null);

  // useEffect(() => {
  // const getBuses = async () => {
  //   const response = await Axios.post(
  //     "http://www.montevideo.gub.uy/buses/rest/stm-online",
  //     {
  //       empresa: "50",
  //       lineas: [144],
  //     }
  //   );

  //   setData(
  //     response.data.features.map((feature) => ({
  //       longitude: feature.geometry.coordinates[0],
  //       latitude: feature.geometry.coordinates[1],
  //       id: feature.properties.id,
  //     }))
  //   );
  // };

  //   getBuses();
  // }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const getBuses = async () => {

    
      setIsLoading(true);
      const response = await Axios.post(
        "http://www.montevideo.gub.uy/buses/rest/stm-online",
        {
          empresa: "50",
          lineas: [linea],
        }
      );
  
      const mappedData = response.data.features.map((feature) => ({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        id: feature.properties.id, // guardamos el id, para poder utilizarlo como key de los Marker
      }));
  
      setData(mappedData);
      setIsLoading(false);
    
  };

  const handleSearch = async () => {
    Keyboard.dismiss();

    // reiniciamos el intervalo antes de setear uno nuevo.
    // de esta manera, no se crean varios intervalos
    if (timer.current) {
      clearInterval(timer.current);
    }

    // llamamos a getData, para que la info se muestre cuando hacemos onPress.
    // luego le pedimos que cada 15 segundos se llame de nuevo.
    // guardamos el intervalo en una variable para poder reiniciarlo luego en el onPress.
    await getBuses();

    timer.current = setInterval(async () => await getBuses(), 15000);
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} textContent={'Cargando...'} textStyle={styles.spinnerTextStyle}/>
      <TextInput
        style={styles.txtLine}
        placeholder="Línea"
        value={linea}
        onChangeText={setLinea}
      />
      <Button title="Buscar línea" onPress={handleSearch} />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -34.909557,
          longitude: -56.169695,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {data.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    alignContent: "flex-start",
    justifyContent: "center"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  map: {
    width: "90%",
    height: "60%",
    borderWidth: 1,
    marginTop: 20,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  },
  txtLine: {
    width: "90%",
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 5,
    marginBottom: 15,
    fontSize: 20
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    opacity: .2
  }
});
