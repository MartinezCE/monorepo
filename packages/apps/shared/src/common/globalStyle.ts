import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

export default createGlobalStyle`
    html {
        scroll-behavior: smooth;
        overflow-y: scroll;
        &.scroll-lock {
            height: 100%;
            overflow: hidden;
            width: 100%;
        }
    }
    
    * {
        font-family: 'Apercu Pro', sans-serif;
        box-sizing: border-box;
    }

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        vertical-align: baseline;
    }
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    :root {
        --black: #000000;
        --white: #FFFFFF;
        font-size: 62,5%;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-Bold.woff2') format('woff2'),
            url('/fonts/ApercuPro-Bold.woff') format('woff');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-BoldItalic.woff2') format('woff2'),
            url('/fonts/ApercuPro-BoldItalic.woff') format('woff');
        font-weight: bold;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-Italic.woff2') format('woff2'),
            url('/fonts/ApercuPro-Italic.woff') format('woff');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-LightItalic.woff2') format('woff2'),
            url('/fonts/ApercuPro-LightItalic.woff') format('woff');
        font-weight: 300;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-Light.woff2') format('woff2'),
            url('/fonts/ApercuPro-Light.woff') format('woff');
        font-weight: 300;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro Mono';
        src: url('/fonts/ApercuPro-Mono.woff2') format('woff2'),
            url('/fonts/ApercuPro-Mono.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-MediumItalic.woff2') format('woff2'),
            url('/fonts/ApercuPro-MediumItalic.woff') format('woff');
        font-weight: 500;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-Medium.woff2') format('woff2'),
            url('/fonts/ApercuPro-Medium.woff') format('woff');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Apercu Pro';
        src: url('/fonts/ApercuPro-Regular.woff2') format('woff2'),
            url('/fonts/ApercuPro-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    h1 {
        font-size: ${({ theme }) => theme.fontSizes[10]};
        line-height: ${({ theme }) => theme.lineHeights[8]};
    }
    
    h2 {
        font-size: ${({ theme }) => theme.fontSizes[9]};
        line-height: ${({ theme }) => theme.lineHeights[7]};
    }
    
    h3 {
        font-size: ${({ theme }) => theme.fontSizes[8]};
        line-height: ${({ theme }) => theme.lineHeights[6]};
    }
    
    h4 {
        font-size: ${({ theme }) => theme.fontSizes[7]};
        line-height: ${({ theme }) => theme.lineHeights[5]};
        
        @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
            font-size: ${({ theme }) => theme.fontSizes[5]};
            line-height: ${({ theme }) => theme.lineHeights[3]};
        }
    }
    
    h5 {
        font-size: ${({ theme }) => theme.fontSizes[6]};
        line-height: ${({ theme }) => theme.lineHeights[4]};

        @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
            font-size: ${({ theme }) => theme.fontSizes[5]};
            line-height: ${({ theme }) => theme.lineHeights[3]};
        }
    }
    
    h6 {
        font-size: ${({ theme }) => theme.fontSizes[5]};
        line-height: ${({ theme }) => theme.lineHeights[3]};
        
        @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
            font-size: ${({ theme }) => theme.fontSizes[4]};
            line-height: ${({ theme }) => theme.lineHeights[1]};
        }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-weight: 500;
        color: ${({ theme }) => theme.colors.extraDarkBlue}
    }

    p {
        font-weight: 300;
        line-height: ${({ theme }) => theme.lineHeights[2]};

        @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
            font-size: ${({ theme }) => theme.fontSizes[2]};
            line-height: ${({ theme }) => theme.lineHeights[1]};
        }
    }

    span {
        font-size: ${({ theme }) => theme.fontSizes[4]};
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }

    p, span {
        color: ${({ theme }) => theme.colors.darkGray};
    }

    button {
        font-size: ${({ theme }) => theme.fontSizes[2]};
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }

    img {
        image-rendering: -moz-crisp-edges; /* Firefox */
        image-rendering: -o-crisp-edges; /* Opera */
        image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
    }

    strong {
        font-weight: 500;
    }

    .Toastify__toast-body {
        white-space: pre-line;
    }

    .rc-tooltip {
        top: -77px !important;
        z-index: 1;
    }

`;
