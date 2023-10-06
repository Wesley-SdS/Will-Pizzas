import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

import { Container } from './style';

export function ButtonBack({...rest}: TouchableOpacity){
    const { COLORS } = useTheme();

    return(
        <Container {...rest}>
            <MaterialIcons name='chevron-left' size={18} color={COLORS.TITLE} />
        </Container>
    )
}