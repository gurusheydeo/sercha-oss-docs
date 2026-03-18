module.exports = {
  coreSidebar: [
    'intro',
    'quickstart',
    {
      type: 'category',
      label: 'Architecture',
      link: { type: 'doc', id: 'architecture/overview' },
      items: [
        'architecture/layers',
        'architecture/data-flow',
        'architecture/deployment-modes',
      ],
    },
    {
      type: 'category',
      label: 'AI Models',
      link: { type: 'doc', id: 'models/overview' },
      items: [
        {
          type: 'category',
          label: 'Embedding Models',
          link: { type: 'doc', id: 'models/embedding-models/overview' },
          items: [],
        },
        {
          type: 'category',
          label: 'Large Language Models',
          link: { type: 'doc', id: 'models/large-language-models/overview' },
          items: [],
        },
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      link: { type: 'doc', id: 'api_reference/sercha-core-api' },
      items: require('./docs/core/api_reference/sidebar.ts').default,
    },
    {
      type: 'category',
      label: 'Examples',
      link: { type: 'doc', id: 'examples/overview' },
      items: [],
    },
  ],
};
