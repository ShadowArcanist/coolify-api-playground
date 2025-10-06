import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { openapi } from '@/lib/openapi';
import { APIPage } from 'fumadocs-openapi/ui';

import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,

    // Override <img> tags to use ImageZoom
    img: (props) => <ImageZoom {...(props as any)} />,

    // Custom APIPage component logic
    APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,

    ...components,
  };
}
