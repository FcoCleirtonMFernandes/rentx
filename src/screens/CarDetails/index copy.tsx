import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import speedSvg from '../../assets/speed.svg';
import accelerationSvg from '../../assets/acceleration.svg';
import forceSvg from '../../assets/force.svg';
import gasolineSvg from '../../assets/gasoline.svg';
import exchangeSvg from '../../assets/exchange.svg';
import peopleSvg from '../../assets/people.svg';

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
    navigation.navigate('Scheduling');
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
                imagesUrl={['https://freepngimg.com/thumb/audi/35227-5-audi-rs5-red.png']}
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
                <Accessory name="380km/h" icon={speedSvg} />
                <Accessory name="3.2s" icon={accelerationSvg} />
                <Accessory name="800 HP" icon={forceSvg} />
                <Accessory name="Gasoline" icon={gasolineSvg} />
                <Accessory name="Auto" icon={exchangeSvg} />
                <Accessory name="2 pessoas" icon={peopleSvg} />
            </Accessories>

            <About>
            Em 1964 foi lançado o 350 GTV, primeiro modelo da nova fabricante italiana de veículos. Em 1966 foi lançado o Lamborghini Miura, que foi um tremendo sucesso de vendas. 
            A fabricante passou por uma forte crise financeira na década de 70 e acabou por ir à falência.
            </About>

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