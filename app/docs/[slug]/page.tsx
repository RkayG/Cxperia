import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// This will be replaced with MDX rendering later
async function getDocContent(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'docs', `${slug}.md`);
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch {
    return null;
  }
}

interface DocPageProps {
  params: {
    slug: string;
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = params;
  const content = await getDocContent(slug);

  if (!content) {
    notFound();
  }

  // Simple markdown to HTML conversion (will be replaced with MDX)
  const htmlContent = content
    .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-semibold mt-8 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-6">$1</li>')
    .split('\n')
    .join('<br />');

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <Link href="/docs" className="text-xl font-bold text-gray-900">
            Cxperia Docs
          </Link>
        </div>
        
        {/* Navigation will be added here */}
        <nav className="px-4 pb-6">
          <div className="space-y-1">
            <Link
              href="/docs"
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Documentation Home
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 mr-64">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Breadcrumbs */}
          <nav className="flex mb-8 text-sm">
            <Link href="/docs" className="text-blue-600 hover:text-blue-700">
              Documentation
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{slug}</span>
          </nav>

          {/* Content */}
          <article 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
            <div>
              {/* Previous page link */}
            </div>
            <div>
              {/* Next page link */}
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="fixed right-0 top-0 h-screen w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">On This Page</h3>
        {/* TOC will be generated from headings */}
      </div>
    </div>
  );
}

