import React from 'react';
import { render } from '@testing-library/react-native';
import { Perfil } from '../../../src/screens/Perfil';

describe('Profile Screen', () => {
    it('Check if exist the input with placeholder Nome', () => {
        const { getByPlaceholderText } = render(<Perfil />);
        const inputNome = getByPlaceholderText('Nome');
        expect(inputNome).toBeTruthy();
    });

    it('Check if exist the input with placeholder Sobrenome', () => {
        const { getByPlaceholderText } = render(<Perfil />);
        const inputSobrenome = getByPlaceholderText('Sobrenome');
        expect(inputSobrenome).toBeTruthy();
    });

    it('Check if exist the button with title Salvar', () => {
        const { getByText } = render(<Perfil />);
        const buttonSalvar = getByText('Salvar');
        expect(buttonSalvar).toBeTruthy();
    });

    it('Check if user data as been loaded', () => {
        const { getByTestId } = render(<Perfil />);
        const inputName = getByTestId('input-name');
        const inputLastName = getByTestId('input-lastName');
        expect(inputName.props.value).toBe('Ruan Pablo');
        expect(inputLastName.props.value).toBe('Gomes Rocha');
    });

    it('Check if the title is correct', () => {
        const { getByTestId } = render(<Perfil />);
        const pageTitle = getByTestId('page-title');
        expect(pageTitle.props.children).toBe('Perfil');
    });
});