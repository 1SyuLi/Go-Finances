import React from 'react';
import { render } from '@testing-library/react-native';
import { Perfil } from '../../../src/screens/Perfil';

test('Check if exist the input with placeholder Nome', () => {
    const { getByPlaceholderText } = render(<Perfil />);
    const inputNome = getByPlaceholderText('Nome');
    expect(inputNome).toBeTruthy();
});

test('Check if exist the input with placeholder Sobrenome', () => {
    const { getByPlaceholderText } = render(<Perfil />);
    const inputSobrenome = getByPlaceholderText('Sobrenome');
    expect(inputSobrenome).toBeTruthy();
});

test('Check if exist the button with title Salvar', () => {
    const { getByText } = render(<Perfil />);
    const buttonSalvar = getByText('Salvar');
    expect(buttonSalvar).toBeTruthy();
});
