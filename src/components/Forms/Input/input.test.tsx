import React from 'react';

import { render } from '@testing-library/react-native';
import { Input } from '.';

import { ThemeProvider } from 'styled-components/native';
import theme from '../../../Global/Styles/theme';


const Providers: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

describe('Input Component', () => {
    it('Must have specific border color when active', () => {
        const { getByTestId, debug } = render(
            <Input
                testID='input-email'
                placeholder='Email'
                keyboardType='email-address'
                autoCorrect={false}
                active={true}
            />,
            {
                wrapper: Providers,
            }
        );

        const input = getByTestId('input-email');
        expect(input.props.style[0].borderColor).toEqual(theme.colors.attention);
        expect(input.props.style[0].borderWidth).toEqual(3);
    });
})