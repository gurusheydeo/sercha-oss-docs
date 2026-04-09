import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Self-Hosted',
    image: require('@site/static/img/icon-purple.png').default,
    description: (
      <>
        Your data stays on your infrastructure. Deploy with Docker Compose
        and keep full control over your search index.
      </>
    ),
  },
  {
    title: 'Unified Search',
    image: require('@site/static/img/icon-black.png').default,
    description: (
      <>
        Connect GitHub, Google Drive, Notion, and more. Search across all
        your team's data sources from a single API.
      </>
    ),
  },
  {
    title: 'Built for Developers',
    image: require('@site/static/img/icon-grey.png').default,
    description: (
      <>
        REST API with OpenAPI spec, OAuth2 connectors, and a plugin
        architecture for adding new data sources.
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={image} className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
