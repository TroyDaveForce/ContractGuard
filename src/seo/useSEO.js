import { useEffect } from 'react';
import { OG_IMAGE, SITE_NAME } from './seoConfig.js';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector('link[rel="' + rel + '"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Sets title, description, canonical, Open Graph, Twitter and JSON-LD for a page.
 * Usage: useSEO({ title, description, canonical, schema })
 */
export function useSEO({ title, description, canonical, schema, image = OG_IMAGE }) {
  const schemaKey = schema ? JSON.stringify(schema) : '';

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setLink('canonical', canonical);

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', canonical);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    const added = [];
    if (schemaKey) {
      const list = Array.isArray(schema) ? schema : [schema];
      list.forEach((item) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute('data-seo', 'jsonld');
        s.text = JSON.stringify(item);
        document.head.appendChild(s);
        added.push(s);
      });
    }
    return () => added.forEach((s) => s.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonical, image, schemaKey]);
}

export default useSEO;