import React from 'jsx-dom';
import  {Icon, IconName } from '../Icon';
import './index.less';

export type PlaceholderType = 'image' | 'blockImage' | 'video' | 'audio';

interface PlaceholderViewProps {
  type: PlaceholderType;
}

const typeMap: Record<PlaceholderType, { icon: IconName; title: string }> = {
  image: {
    icon: 'imagePlaceholder',
    title: '',
  },
  blockImage: {
    icon: 'imagePlaceholder',
    title: '增加图片',
  },
  video: {
    icon: 'video',
    title: '增加视频',
  },
  audio: {
    icon: 'audio',
    title: '增加音频',
  },
};

export function Placeholder(props: PlaceholderViewProps) {
  const { type } = props;
  const typeInfo = typeMap[props.type];
  return (
    <div class={type !== 'image' ? 'start-ui-resource-placeholder' : 'start-ui-inline-placeholder'}>
      <Icon name={typeInfo.icon} class="icon" />
      {type !== 'image' && <span class="text">{typeInfo.title}</span>}
    </div>
  );
}
