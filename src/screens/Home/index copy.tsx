import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Logo from '../../assets/logo.svg';
import { api } from '../../services/api';

import { Car } from '../../components/Car';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList
 } from './styles';

export function Home() {
  const carData = {
    brand: 'audi',
    name: 'A5 Coupe',
    rent: {
        period: 'AO DIA',
        price: 120,
    },
    thumbnail: 'https://freepngimg.com/thumb/audi/35227-5-audi-rs5-red.png'
  }

  const [ cars, setCars ] = useState([]); 
  const navigation = useNavigation();
  const [ loading, setLoading ] = useState(true);

  function handleCarDetails () {
    navigation.navigate('CarDetails', { Car });
  }

  useEffect(() => {
    async function fetchCars() {
      try {
       const response = await api.get('/cars');
       setCars(response.data);
       //console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  return (
    <Container>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo 
            width={RFValue(108)}
            height={RFValue(12)}
          />
          <TotalCars>
            Total de 12 Carro
          </TotalCars>
        </HeaderContent>
      </Header>

      <CarList
        data={[1,2,3,4,5,6,7,8,9,10]}
        keyExtractor={({ item }) => (String(item)) }
        renderItem={({ item }) => ( 
            <Car data={carData}
                onPress={() => handleCarDetails(item)}
            />
        )}
      />

    </Container>
  );
}