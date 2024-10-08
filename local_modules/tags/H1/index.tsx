import { ElementProps } from '@local_modules/tags/type';
import { Platform } from 'react-native';

const H1: React.FC<ElementProps> = Platform.select({
  web: () => require('./H1.web').default,
  default: () => require('./H1.native').default,
})();

export default H1;