export interface WikiManifest {
  meta: { baseUrl: string; generatedAt: string };
  topics: WikiTopic[];
  pages: WikiPage[];
  mottos: WikiMotto[];
}

export interface WikiTopic {
  id: string;
  label: string;
  dotColor: string;
}

export interface WikiPage {
  id: string;
  title: string;
  kind: 'reference' | 'reflection';
  topic: string;
  status: string;
  excerpt: string;
  date: string;
  words: number;
  links: string[];
}

export interface WikiMotto {
  id: string;
  text: string;
  topic: string;
  pageId: string;
}
