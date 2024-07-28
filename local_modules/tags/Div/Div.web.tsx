import React, { useMemo } from 'react';
import { wrapTextNodesWeb } from '@local_modules/tags/styleUtils.web';
import { ElementProps } from '@local_modules/tags/type';

export default function WebDiv({ children, style }: ElementProps) {
  const wrappedChildren = useMemo(() => wrapTextNodesWeb(children), [children]);
  
  return <div style={style}>{wrappedChildren}</div>;
}