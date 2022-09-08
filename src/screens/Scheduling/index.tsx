import React, { useState } from 'react';
import { format } from 'date-fns';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar, Alert } from 'react-native';
import { useTheme } from 'styled-components';

import { getPlatformDate } from '../../utils/getPlatformDate';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { 
    Calendar,
    DayProps,
    generateInterval,
    MarkedDatesProps 
} from '../../components/Calendar';

import ArrowSvg from '../../assets/arrow.svg';

import { CarDTO } from '../../dtos/CarDTO';

import { 
    Container, 
    Header,
    Title,
    Period,
    DateInfo,
    DateTitle,
    DateValeu,
    Content,
    Footer
} from './styles';

interface Params{
  car: CarDTO;
}

interface RentalPeriod {
  start: number;
  startFormatted: string;
  end: number;
  endFormatted: string;
}

export function Scheduling() {
  const [ lastSelectedDate, setLastSelectedDate ] = useState<DayProps>({} as DayProps);
  const [ markedDates, setMarkedDates ] = useState<MarkedDatesProps>({} as MarkedDatesProps);
  const [ rentalPeriod, setRentalPeriod ] = useState<RentalPeriod>({} as RentalPeriod);
  
  const theme = useTheme();

  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params;

  function handleConfirmRental() {
    if(!rentalPeriod.start || !rentalPeriod.end) {
      Alert.alert('Selecione o intervalo para alugar');
      return;
    }

    navigation.navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates),
    });
  }

  function handleGoBack() {
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    //funcao para pegar a data selecionada
    /* pegar a primeira data selecionada */
    const firstDate = Object.keys(interval)[0];
    /* pegar da primeira data selecionada até a última selecionada */
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      start: start.timestamp,
      end: end.timestamp,
      startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted:   format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
    //FIM funcao para pegar a data selecionada
  }

  return (
    <Container>
        <Header>
            <StatusBar 
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <BackButton 
                onPress={handleGoBack}
                color={ theme.colors.shape }
            />

            <Title>
                Escolha uma {'\n'}
                data de início e {'\n'}
                fim do aluguel
            </Title>

            <Period>
                <DateInfo>
                    <DateTitle>DE</DateTitle>
                    <DateValeu selected={!!rentalPeriod.startFormatted}>
                      {rentalPeriod.startFormatted}
                    </DateValeu>
                </DateInfo>

                <ArrowSvg />
                
                <DateInfo>
                    <DateTitle>ATÉ</DateTitle>
                    <DateValeu selected={!!rentalPeriod.endFormatted}>
                      {rentalPeriod.endFormatted}
                    </DateValeu>
                </DateInfo>
            </Period>
        </Header>

        <Content>
            <Calendar 
                markedDates={markedDates}
                onDayPress={handleChangeDate}
            />
        </Content>

        <Footer>
            <Button 
                title='Confirmar' 
                onPress={handleConfirmRental}
                enable={!!rentalPeriod.startFormatted}
            />
        </Footer>

    </Container>
  );
}