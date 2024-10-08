import { useNativeElement } from '@local_modules/tags/styleUtils.web';
import { ElementProps } from '@local_modules/tags/type';

export default function WebH1(props: ElementProps) {
  const NativeElement = useNativeElement('h1', props)
  return NativeElement
}