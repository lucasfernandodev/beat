import type { FC, HTMLAttributes, ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

type RootProps = TableHTMLAttributes<HTMLTableElement> & {
  children: ReactNode;
};
type HeaderProps = HTMLAttributes<HTMLTableSectionElement> & {
  children: ReactNode;
};

type BodyProps = HTMLAttributes<HTMLTableSectionElement> & {
  children: ReactNode;
};

type RowProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
};

type HeaderCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
};

type CellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
};



const Root: FC<RootProps> = ({ children, ...props }: { children: ReactNode }) => {
  return <table {...props}>{children}</table>
}

const Header: FC<HeaderProps> = ({ children, ...props }: { children: ReactNode }) => {
  return <thead {...props}>{children}</thead>
}

const Body: FC<BodyProps> = ({ children, ...props }: { children: ReactNode }) => {
  return <tbody {...props}>{children}</tbody>
}

const Row: FC<RowProps> = ({ children, ...props }: { children: ReactNode }) => {
  return <tr {...props}>{children}</tr>
}

const HeaderCell: FC<HeaderCellProps> = ({ children, ...props }: { children: ReactNode }) => {
  return <th {...props}>{children}</th>
}

const Cell: FC<CellProps> = ({ children, ...props }: { children: ReactNode }) => {
  return <td {...props}>{children}</td>
}

export const Table = Object.freeze({
  Root,
  Header,
  Body,
  Row,
  HeaderCell,
  Cell
})