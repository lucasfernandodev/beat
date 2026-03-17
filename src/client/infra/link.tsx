import type { FC } from 'react';
import { Link as LinkR, type LinkProps } from 'react-router';

export const Link: FC<LinkProps> = ({ children, ...props }) => {
  return <LinkR {...props}>{children}</LinkR>
}