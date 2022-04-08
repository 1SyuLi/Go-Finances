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
            <Text testID='page-title'>Perfil</Text>

            <TextInput
                testID='input-name'
                placeholder='Nome'
                autoCorrect={false}
                value={'Ruan Pablo'}
            />

            <TextInput
                testID='input-lastName'
                placeholder='Sobrenome'
                autoCorrect={false}
                value={'Gomes Rocha'}
            />

            <Button
                testID='save-button'
                title='Salvar'
                onPress={sayHello}
            />
        </View>
    )
}