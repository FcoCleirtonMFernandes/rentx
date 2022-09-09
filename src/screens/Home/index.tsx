import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { StatusBar, StyleSheet, BackHandler } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';

import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

import Logo from '../../assets/logo.svg';

import { api } from '../../services/api';

import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

// fazendo a tipagem que vem da API
import { CarDTO } from '../../dtos/CarDTO';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList
 } from './styles';

export function Home() {

  const [ cars, setCars ] = useState<CarDTO[]>([]);
  const [ loading, setLoading ] = useState(true);

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return{
      transform: [
        { translateX: positionX.value},
        { translateY: positionY.value},
      ]
    }
  });

  const onGestureHandler = useAnimatedGestureHandler({
    onStart(_, context: any) {
      context.ctxPositionX = positionX.value;
      context.ctxPositionY = positionY.value;
    },
    onActive(event, context: any) {
      positionX.value = context.ctxPositionX + event.translationX;
      positionY.value = context.ctxPositionY + event.translationY;
    },
    onEnd() {
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    },
  });

  const theme = useTheme();
  const navigation = useNavigation();

  function handleCarDetails (car: CarDTO) {
    navigation.navigate('CarDetails', { car });
  }

  function handleOpenMyCars () {
    navigation.navigate('MyCars');
  }
 
  useEffect(() => {
    async function fetchCars() {
      try {
       const response = await api.get('/cars');
       //console.log(response.data);
       setCars(response.data);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  //Qdo no Home - Android - Funcao para não retornar a janela Splash
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    })
  },[]);

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
          { !loading && 
            <TotalCars>
              Total de {cars.length} Carros
            </TotalCars>
          }
        </HeaderContent>
      </Header>

      { loading ? 
        <Load /> : 
        (
          <CarList
            data={cars}
            keyExtractor={ (item) => item.id }
            renderItem={({ item }) => ( 
              <Car data={item}
                  onPress={() => handleCarDetails(item)}
              />
            )}
          />
        )
      }

      <PanGestureHandler onGestureEvent={onGestureHandler}>
        <Animated.View
          style={[
            myCarsButtonStyle,
            {
              position: 'absolute',
              bottom: 13,
              right: 22,
            }
          ]}      
        >
          <ButtonAnimated 
            onPress={handleOpenMyCars}
            style={[styles.button, {backgroundColor: theme.colors.main}]}
          >
          {/* trocando por ButtonAnimated <MyCarButton onPress={handleOpenMyCars}>*/}
            <Ionicons 
              name="ios-car-sport"
              size={32}
              color={theme.colors.shape}
            />
          {/*</MyCarButton>*/}
          </ButtonAnimated>

        </Animated.View>
      </PanGestureHandler>

    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
})