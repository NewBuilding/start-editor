import { defineComponent } from 'vue';
import { StartEditor } from 'start-editor';
import { EditorCanvas } from 'start-editor-vue';
import applyDevTools from 'prosemirror-dev-tools';

const content = `
  <div>
  <h2>二级标题</h3>
  <h3>好强</h3>
  <dl>
  <dt>风急天高猿啸哀</dt>
  <dt>渚清沙白鸟飞回</dt>
  <dt>无边落木萧萧下</dt>
  <dt>不尽长江滚滚来</dt>
  </dl>
  <hr />
  <p>区我和看起来文件秦岭为秦岭为几千万立刻就去看文件驱蚊扣起晚了asdasdasdasdsa可请叫我了空气讲课群文件情况文件情况为</p>
  <a href="https://gaoding.com">链接——<em>强调链接</em></a> <a href="https://gaoding.com"><em>链接来了</em></a>
  <p >ppp<p>横眉冷对千夫指</p><em>em<del>del</del></em></p>
  <ul>
    <li>第1行</li>
    <li>
      第2行
      <ol>
        <li>第11行</li>
        <li>第12行</li>
        <li>第13行</li>
      </ol>
    </li>
    <li>第3行</li>
  </ul>  
  <ol>
    <li>
      第1章
      <ol>
        <li>
          1.1
          <ol>
            <li>1.1.1</li>
            <li>1.1.2</li>
            <li>1.1.3</li>
          </ol>
        </li>
        <li>1.2</li>
        <li>1.3</li>
        <li>1.4</li>
      </ol>  
    </li>
    <li>第2章</li>
    <li>第3章</li>
    <li>第4章</li>
  </ol>

 


  

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
    applyDevTools(editor.view);
    return () => (
      <div class="start-vue-main-editor">
        <EditorCanvas editor={editor} />
      </div>
    );
  },
});
