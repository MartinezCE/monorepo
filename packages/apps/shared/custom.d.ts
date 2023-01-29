type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: StaticImageData;
  export default content;
}
