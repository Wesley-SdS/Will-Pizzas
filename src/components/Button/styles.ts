import styled, { css } from "styled-components/native";
import { RectButton } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';

export type TypeProps = 'primary' | 'secondary';

type ContainerProps = {
  type: TypeProps;
}

export const Container = styled(RectButton)<ContainerProps>`
  flex: 1;
  width:100%;
  border-radius: 12px;
  max-height: 56px;
  min-height: 56px;
  margin-bottom: 10px;  
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, type }) =>
    type === 'primary' ? theme.COLORS.SUCCESS_900 : theme.COLORS.PRIMARY_800};
    
`;

export const Title = styled.Text`
  font-size: 14px;

  ${({ theme }) => css`
    color: ${theme.COLORS.TITLE};
    font-family: ${theme.FONTS.TEXT};
  `};
`;

export const Load = styled(ActivityIndicator).attrs(({ theme }) => ({
  color: theme.COLORS.TITLE
  
}))``;