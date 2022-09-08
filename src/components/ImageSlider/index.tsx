import React, { useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';

import {
  Container,
  ImageIndexes,
  ImageIndex,
  CarImageWrapper,
  CarImage,
} from './styles';

interface ChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

interface Props {
  imagesUrl: {
    id: string,
    photo: string,
  }[];
}

export function ImageSlider({ imagesUrl }: Props) {
  const [ imageIndex, setImageIndex ] = useState(0);

  const indexChanged = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
    setImageIndex(index);
  });
  
  return (
    <Container>
      <ImageIndexes>
        {imagesUrl.map((item, index) => (
          <ImageIndex
            key={item.id}
            active={index === imageIndex}
          />
        ))}
      </ImageIndexes>

      
        <FlatList
          data={imagesUrl}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={indexChanged.current}
          renderItem={({ item }) => (
            <CarImageWrapper>
              <CarImage
                source={{ uri: item.photo }}
                resizeMode="contain"
              />
            </CarImageWrapper>
          )}
        />
    </Container>
  );
}