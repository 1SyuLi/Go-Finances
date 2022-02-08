import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';
import theme from '../../Global/Styles/theme';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles';


export function SignIn(){
    const [isLoading, setIsloading] = useState(false);

    const { signInWithGoogle, signInWithApple } = useAuth();

    async function handleSignInWithGoogle(){
        try {
            setIsloading(true)
            return await signInWithGoogle();
            
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possivel conectar a conta Google')
        }finally{
            setIsloading(false)
        }
    }

    async function handleSignInWithApple(){
        try {
            setIsloading(true)
            return await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possivel conectar a conta Apple')
        }finally{
            setIsloading(false)
        }
    }

    return(
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>


                <SignInTitle>
                    Faça seu login com {'\n'}
                    umas das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton 
                        title='Entrar com Google' 
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />
                    <SignInSocialButton 
                        title='Entrar com Apple'
                        svg={AppleSvg}
                        onPress={handleSignInWithApple}
                    />
                </FooterWrapper>

               {
                   isLoading && <ActivityIndicator  color={theme.colors.primary} size="large" style={{marginTop: 18}}/>
               } 
            </Footer>
        </Container>
    )
}
