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
  
    const rentTotal = Number(dates.length * car.price);
  
    async function handleConfirmRental() {
      try {
        setLoading(true);

        const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);
        const unavailable_dates = [
          // pegandos todas as datas já salvas
          ...schedulesByCar.data.unavailable_dates,
          // mas a data selecionada na tela
          ...dates,
        ];

        await api.post('/schedules_byuser', {
          user_id: '1',
          car,
          start_date: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
          end_date: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy')
        });

        // Uma das formas de Enviar dados a API
        // api.put sobrescreve / api.post Add uma nova linha
        api.put(`/schedules_bycars/${car.id}`, {
          id: car.id,
          unavailable_dates
        })
        .then(() => 
          navigation.navigate('Confirmation', {
            title: 'Carro alugado!',
            message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`,
            nextScreenRoute: 'Home',
          })
        )
        .catch(() => {
          Alert.alert('Houve um erro no agendamento.');
          setLoading(false);;
        })        
/*
        navigation.navigate('Confirmation', {
          title: 'Carro alugado!',
          message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`,
          nextScreenRoute: 'Home',
        });
        */
      } catch (error) {
        console.error(error);
        setLoading(false);
        Alert.alert('Houve um erro no agendamento. Por favor tente novamente mais tarde');
      }
    }
  
    function handleGoBack() {
      navigation.goBack();
    }
 
    useEffect(() => {
      setRentalPeriod({
        start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
        end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy')
      })
    }, []);
   /*
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
                imagesUrl={car.thumbnail}
            />
        </CarImages> 

        <Content>
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
              <DateValue>{rentalPeriod.start}</DateValue>
            </DateInfo>

            <Feather
              name="chevron-right"
              size={RFValue(10)}
              color={theme.colors.text}
            />

            <DateInfo>
              <DateTitle>ATÉ</DateTitle>
              <DateValue>{rentalPeriod.end}</DateValue>
            </DateInfo>
          </RentalPeriod>

          <RentalPrice>
            <RentalPriceLabel>Total</RentalPriceLabel>
            <RentalPriceDetails>
                <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
                <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
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