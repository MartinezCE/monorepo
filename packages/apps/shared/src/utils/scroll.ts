export const lockScroll = () => document.getElementsByTagName('html')[0].setAttribute('class', 'scroll-lock');
export const letScroll = () => document.getElementsByTagName('html')[0].removeAttribute('class');
