import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation - Cxperia',
  description: 'Comprehensive documentation for the Cxperia platform',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

