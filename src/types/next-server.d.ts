// 修复 next/server 类型声明问题
declare module 'next/server' {
  export class NextRequest extends Request {
    constructor(input: string | URL, init?: RequestInit);
    cookies: any;
    nextUrl: any;
    geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
    ip?: string;
  }

  export class NextResponse extends Response {
    static json<Body>(body: Body, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, init?: ResponseInit | number): NextResponse;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
    cookies: any;
  }
}

// 修复 next/server.js 声明问题
declare module 'next/server.js' {
  export * from 'next/server';
}

// 修复其他 next 模块声明问题
declare module 'next/navigation' {
  export function useRouter(): any;
  export function useParams<T = Record<string, string>>(): T;
  export function useSearchParams(): any;
  export function usePathname(): string;
}

declare module 'next/link' {
  import type { LinkHTMLAttributes, ReactNode } from 'react';
  interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children?: ReactNode;
  }
  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'next/dynamic' {
  import type { ComponentType } from 'react';
  interface DynamicOptions {
    ssr?: boolean;
    loading?: () => JSX.Element;
  }
  export default function dynamic<P>(
    loader: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>,
    options?: DynamicOptions
  ): ComponentType<P>;
}

declare module 'next' {
  export default function next(options?: any): any;
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

declare module 'next/dist/lib/metadata/types/metadata-interface.js' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
  export type ResolvingMetadata = Promise<Metadata>;
  export type ResolvingViewport = Promise<any>;
  export type Viewport = any;
}
