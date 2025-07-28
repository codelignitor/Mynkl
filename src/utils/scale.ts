import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const STANDARD_WIDTH = 430;
const deviceWidth = width < height ? width : height;
const scaleFactor = deviceWidth / STANDARD_WIDTH;

export const ss = (size: number) => {
  return PixelRatio.roundToNearestPixel(scaleFactor * size);
}; 