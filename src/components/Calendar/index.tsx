export { ptBR };import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import { generateInterval } from './generateInterval';

import {
  Calendar as CustomCalendar,
  LocaleConfig,
  CalendarProps,
} from 'react-native-calendars';

import { ptBR } from './localeConfig';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

// interfase para o Periodo Selecionado
interface MarkedDatesProps {
  [date: string]: {
    color: string;
    textColor: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
  },
} 

// interfase para o DIA Selecionado
interface DayProps {
  dateString: string
  day: string;
  month: string;
  year: number;
  timestamp: number;
}

interface Props extends CalendarProps {
  markedDates: MarkedDatesProps;
}

function Calendar({ markedDates, onDayPress }: Props) {
  const theme = useTheme();

  return(
    <CustomCalendar
      renderArrow={( direction ) => (
        <Feather
          name={ direction == 'left' ? 'chevron-left' : 'chevron-right' }
          size={24}
          color={theme.colors.text}
        />
      )}

      headerStyle={{
        backgroundColor: theme.colors.background_secondary,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.text_detail,
        paddingBottom: 10,
        paddingTop: 10,
      }}

      theme={{
        textDayFontFamily: theme.fonts.primary_400,
        textDayHeaderFontFamily: theme.fonts.primary_500,
        textDayHeaderFontSize: 10,
        textMonthFontFamily: theme.fonts.secondary_600,
        textMonthFontSize: 20,
        monthTextColor: theme.colors.title,
        arrowStyle: {
          marginHorizontal: -15,
        }
      }}

      firstDay={1}
      minDate={String(new Date())}
      markingType="period"
      markedDates={markedDates}
      onDayPress={onDayPress}
    />
  );
}

export {
  Calendar,
  MarkedDatesProps,
  DayProps,
  generateInterval,
}