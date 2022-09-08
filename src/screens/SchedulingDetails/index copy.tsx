import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { useNetInfo } from '@react-native-community/netinfo';
import { Alert } from 'react-native';

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

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { api } from '../../services/api';

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
    Footer,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuota,
    RentalPriceTotal
} from './styles';

type RouteNameType = {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  }
  
  interface Params {
    car: CarDTO,
    dates: string[];
  }
  
  interface RentalPeriod {
    start: string;
    end: string;
  }

export function SchedulingDetails() {
    const [ carUpdated, setCarUpdated ] = useState<CarDTO>({}as CarDTO);
    const [ rentalPeriod, setRentalPeriod ] = useState<RentalPeriod>({} as RentalPeriod);
    const [ loading, setLoading ] = useState(false);
  
    const netInfo = useNetInfo();
    const theme = useTheme();
    const navigation = useNavigation<RouteNameType>();
    const route = useRoute();
    const { car, dates } = route.params as Params;
  
    //const rentTotal = Number(dates.length * car.price);
  
    async function handleConfirmRental() {
      try {
        setLoading(true);
  /*
        await api.post('/rentals', {
          user_id: '1',
          car_id: car.id,
          start_date: new Date(dates[0]),
          end_date: new Date(dates[dates.length - 1]),
          total: rentTotal,
        });
    */
        navigation.navigate('Confirmation', {
          title: 'Carro alugado!',
          message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`,
          nextScreenRoute: 'Home',
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
        Alert.alert('Houve um erro no agendamento. Por favor tente novamente mais tarde');
      }
    }
  
    function handleGoBack() {
      navigation.goBack();
    }
  /*
    useEffect(() => {
      setRentalPeriod({
        start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
        end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy')
      })
    }, []);
  
    useEffect(() => {
      async function fetchCarUpdated() {
        const response = await api.get(`/cars/${car.id}`);
        setCarUpdated(response.data);
      }
  
      if(netInfo.isConnected === true) {
        fetchCarUpdated();
      }
    }, [netInfo.isConnected]);
*/
  return (
    <Container>
        <Header>
            <BackButton
                onPress={handleGoBack}
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
                    <Brand>Lamborghini</Brand>
                    <Name>Huracan</Name>
                </Description>

                <Rent>
                    <Period>Ao Dia</Period>
                    <Price>R$ 500</Price>
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

            <RentalPeriod>
                <CalendarIcon>
                    <Feather
                    name="calendar"
                    size={RFValue(24)}
                    color={theme.colors.shape}
                    />
                </CalendarIcon>

                <DateInfo>
                    <DateTitle>DE</DateTitle>
                    <DateValue>{/*rentalPeriod.start*/}</DateValue>
                </DateInfo>

                <Feather
                    name="chevron-right"
                    size={RFValue(10)}
                    color={theme.colors.text}
                />

                <DateInfo>
                    <DateTitle>ATÉ</DateTitle>
                    <DateValue>{/*rentalPeriod.end*/}</DateValue>
                </DateInfo>
            </RentalPeriod>

            <RentalPrice>
                <RentalPriceLabel>Total</RentalPriceLabel>
                <RentalPriceDetails>
                    <RentalPriceQuota> 5 x 100</RentalPriceQuota>
                    <RentalPriceTotal>R$ 500 </RentalPriceTotal>
                </RentalPriceDetails>
            </RentalPrice>
 

        </Content>

        <Footer>
            <Button
                title="Alugar agora"
                color={theme.colors.success}
                onPress={handleConfirmRental}
                enable={!loading}
                loading={loading}
            />
        </Footer>

    </Container>
  );
}