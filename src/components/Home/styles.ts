import styled, { css } from "styled-components/native";
import {LinearGradient } from 'expo-linear-gradient'
import { getBottomSpace } from "react-native-iphone-x-helper";

export const Container = styled(LinearGradient).attrs(({ theme }) =>({
    colors: theme.COLORS.GRADIENT
}))`
flex:1;
justify-content: center;
align-items: center;


`;


export const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator:false,
    contentContainerStyle:{
        paddingBottom: getBottomSpace() + 48

    },
})`
width:100%;
padding: 0 32px;
`;

export const Title = styled.Text`
font-size: 32px;
margin-bottom:24px;
align-items: flex-start;

${({ theme }) => css`
font-family: ${theme.FONTS.TITLE};
color: ${theme.COLORS.TITLE};
`};
`;


export const Brand = styled.Image.attrs({
    resizeMode: 'contain'
})`
height:340px;
margin-top:64px;
margin-bottom: 32px;
`;


export const ForgotPasswordButton = styled.TouchableOpacity`
align-items: flex-end;
margin-bottom: 20px;
`


export const ForgotPasswordLabel = styled.Text`
font-size: 14px;

${({ theme }) => css`
font-family: ${theme.FONTS.TITLE};
color: ${theme.COLORS.TITLE};
`};
`;