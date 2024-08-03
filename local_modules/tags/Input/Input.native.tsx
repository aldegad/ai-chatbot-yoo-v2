
import { normalizeStyles } from '@local_modules/tags/normalize';
import { InputElementProps } from '@local_modules/tags/type';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardTypeOptions, NativeSyntheticEvent, StyleSheet, TextInput, TextInputChangeEventData } from 'react-native';

export default function NativeInput({ 
  style, 
  onChange, 
  onEnter,
  type,
  ...rest
}: InputElementProps) {
  const flattenStyle = StyleSheet.flatten(style);

  const onInputChange = useCallback((e:NativeSyntheticEvent<TextInputChangeEventData>) => {
    onChange?.({
      native: e,
      instance: {
        value: e.nativeEvent.text,
      },
    });
  }, [onChange]);

  const [keyboardType, setKeyboardType] = useState<KeyboardTypeOptions>("default");
  const [secureTextEntry, setSecureTextEntry] = useState(false);

  useEffect(() => {
    if(type == 'password') {
      setSecureTextEntry(true);
    } else {
      setSecureTextEntry(false);
    }

    if(type === 'email') {
      setKeyboardType('email-address');
    } else {
      setKeyboardType('default');
    }
  }, [type])
  
  return <TextInput 
    cursorColor={flattenStyle.cursorColor}
    selectionColor={flattenStyle.cursorColor}
    selectionHandleColor={flattenStyle.cursorColor}
    style={[normalizeStyles.input, style]}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    onChange={onInputChange}
    onSubmitEditing={e => onEnter()}
    {...rest}></TextInput>;
}