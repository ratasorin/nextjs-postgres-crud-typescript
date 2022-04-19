import { FC } from 'react';
import description__style from './description.module.css';

const Description: FC<{ content: string }> = ({ content }) => {
  return (
    <div className={description__style.subtitle}>
      {content.slice(0, 150) + '...'}
    </div>
  );
};

export default Description;