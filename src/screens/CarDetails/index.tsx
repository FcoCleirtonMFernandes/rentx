import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

import Animated, { 
    useSharedValue, 
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { CarDTO } from '../../dtos/CarDTO';

import { api } from '../../services/api';

import { 
    Container,
    Header,
    CarImages,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    Accessories,
    About,
    Footer
} from './styles';

//criando interfase pra receber os parametos
interface Params {
    car: CarDTO;
}

export function CarDetails() {
  const [carUpdated, setCarUpdated] = useState<CarDTO>({}as CarDTO);

  const netInfo = useNetInfo();
  const theme = useTheme();
  const navigation = useNavigation();
  const routes = useRoute();
  const { car } = routes.params as Params ;

  //fazer a animação para sumir a figura de carro, qdo ativar o scroll
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
    //console.log(event.contentOffset.y);
  });

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
        height: interpolate(
            scrollY.value,
            [0, 200],
            [200, 0],
            Extrapolate.CLAMP
        ),
    }
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return{
        opacity: interpolate(
            scrollY.value,
            [0, 150],
            [1, 0],
            Extrapolate.CLAMP
        )
    }
  });
  //fim

  function handleConfirmRental() {
    navigation.navigate('Scheduling', {car});
  }
  
  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdated(response.data);
    }

    if(netInfo.isConnected === true) {
      fetchCarUpdated();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
        <StatusBar 
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
        />
        <Animated.View
            style={[
                headerStyleAnimation,
                styles.header,
                { backgroundColor: theme.colors.background_secondary }
            ]}
        >
            <Header>
                <BackButton 
                    onPress={handleBack}
                />
            </Header>

            <Animated.View
                style={sliderCarsStyleAnimation}
            >
                <CarImages>
                {/*<ImageSlider
                        /*imagesUrl={[car.photos]} 
                    />*/} 
                </CarImages>
            </Animated.View>
        </Animated.View>

        <Animated.ScrollView
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: getStatusBarHeight() + 160,
            }}
            showsVerticalScrollIndicator= {false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
        >
            <Details>
                <Description>
                    <Brand>{car.brand}</Brand>
                    <Name>{car.name}</Name>
                </Description>

                <Rent>
                    <Period>{car.rent.period}</Period>
                    <Price>R$ {car.rent.price}</Price>
                </Rent>
            </Details>

            <Accessories>
                {
                    car.accessories.map(accessory => (
                    <Accessory
                        key={accessory.type}
                        name={accessory.name}
                        icon={getAccessoryIcon(accessory.type)}
                    />
                    ))
                }
            </Accessories>

            <About>{car.about}</About>

        </Animated.ScrollView>

        <Footer>
            <Button 
                title='Escolher período do aluguel'
                onPress={handleConfirmRental}
            />
        </Footer>

    </Container>
  );
}

const styles = StyleSheet.create({
    header: {
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 1,
    },
});