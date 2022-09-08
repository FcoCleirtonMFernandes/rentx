import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { CarDTO } from '../../dtos/CarDTO';

import { 
    Container,
    Header,
    CarImages,
    Content,
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
  const navigation = useNavigation();
  const routes = useRoute();
  const { car } = routes.params as Params ;

  function handleConfirmRental() {
    navigation.navigate('Scheduling', {car});
  }
  
  function handleBack() {
    navigation.goBack();
  }

  return (
    <Container>
        <Header>
            <BackButton 
                onPress={handleBack}
            />
        </Header>

        <CarImages>
            <ImageSlider 
                imagesUrl={[car.photos]}
            />
        </CarImages>

        <Content>
            <Details>
                <Description>
                    <Brand>{car.brand}</Brand>
                    <Name>{car.name}</Name>
                </Description>

                <Rent>
                    <Period>{car.period}</Period>
                    <Price>R$ {car.price}</Price>
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

        </Content>

        <Footer>
            <Button 
                title='Escolher período do aluguel'
                onPress={handleConfirmRental}
            />
        </Footer>

    </Container>
  );
}