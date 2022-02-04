import 'styled-components';
import theme from './Theme';

declare module 'styled-components' {
    type themetype = typeof theme;

    export interface DefaultTheme extends themetype {}
}