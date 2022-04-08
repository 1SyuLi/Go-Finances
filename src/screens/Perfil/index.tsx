import React from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
} from 'react-native';

export function Perfil() {

    function sayHello() {
        console.log('Hello World');
    }

    return (
        <View>
            <Text>Perfil</Text>

            <TextInput
                placeholder='Nome'
                autoCorrect={false}
            />

            <TextInput
                placeholder='Sobrenome'
                autoCorrect={false}
            />

            <Button
                title='Salvar'
                onPress={sayHello}
            />
        </View>
    )
}