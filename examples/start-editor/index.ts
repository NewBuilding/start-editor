import { StartEditor } from 'start-editor';

const content = `
  <div>
  1213
  <p ><em>hello</em>word</p>
  <h2>二级标题</h3>
  <h3>好强</h3>
  <img />
  <p>区我和看起来文件秦岭为秦岭为几千万立刻就去看文件驱蚊扣起晚了asdasdasdasdsa可请叫我了空气讲课群文件情况文件情况为</p>
  <a href="https://gaoding.com">链接——<em>强调链接</em></a> <a href="https://gaoding.com"><em>链接来了</em></a>
  <p >ppp<p>横眉冷对千夫指</p><em>em<del>del</del></em></p>
  <p>
  <s>s标签</s>
  <strike>strike标签</strike>
  <del>del标签</del>
  <strong>strong标签</strong>
  <b>b标签</b>
  <em>em标签</em>
  <i>i标签</i>
  <s>s标签</s>
  <strike>strike标签</strike>
  <del>del标签</del>
  <strong>strong标签</strong>
  <b>b标签</b>
  <em>em标签</em>
  <i>i标签</i>
</div>
`;

const editor = new StartEditor({ content });

const $el = editor.$el.firstChild as HTMLElement;
$el.style.width = '500px';
$el.style.height = '300px';
$el.style.border = '1px solid black';
$el.style.padding = '10px';

document.body.appendChild($el);
