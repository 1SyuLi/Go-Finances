import React from "react";
import { TouchableOpacityProps } from "react-native";

import {
    Container,
    Title,
    Icon,
} from './styles';

const icons = {
    positive: 'arrow-up-circle',
    negative: 'arrow-down-circle'
}

interface Props extends TouchableOpacityProps{
    title: string;
    type: 'positive' | 'negative';
    isActive: boolean;
}

export function TransactionTypeButton({ isActive, type, title, ...rest}:Props){

    return(
        <Container {...rest} isActive={isActive} type={type}>
            <Icon name={icons[type]} type={type}/>
            <Title>{title}</Title>

        </Container>
    )
}