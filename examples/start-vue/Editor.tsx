
import { defineComponent } from 'vue';
import { StartEditor } from 'start-editor';
import {EditorCanvas} from 'start-editor-vue';

const content = `
  <div>
  1213
  <p ><em>hello</em>word</p>
  <h2>二级标题</h3>
  <h3>好强</h3>
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

</div>
  <u style="font-style:italic;">u标签</u>
  <img src="/favion.ico" title="triceratops" style="display:block;">
</div>
`;
export default defineComponent({
  name: 'editor',
  setup() {
    const editor = new StartEditor({ content });
    return () =>(
      <div class="start-vue-main-editor">
        <EditorCanvas editor={editor} />
      </div>
    ); 
  },
});
