import React, { isValidElement, cloneElement, useMemo, ReactNode } from 'react';
import { DivProps } from '@local_modules/tags/Div/Div.type';
import Span from '../Span';
import { wrapTextNodesWeb } from '@local_modules/tags/styleUtils';

const Div = ({ children, style }: DivProps) => {
  const wrappedChildren = useMemo(() => wrapTextNodesWeb(children), [children]);
  
  return <div style={style}>{wrappedChildren}</div>;
};

export default Div;
