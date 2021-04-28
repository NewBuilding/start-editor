import { StartEditor, Plugin } from 'start-editor';
import './index.less';
import { getPlugins } from 'start-editor-vue';

const content = `
  <div>
  1213
  <p ><em>hello</em>word</p>
  <h2>二级标题</h3>
  <h3>好强</h3>
  <img />
  <p>区我和看起来文件秦岭为秦岭为几千万立刻就去看文件驱蚊扣起晚了asdasdasdasdsa可请叫我了空气讲课群文件情况文件情况为</p>
  <p><a href="https://gaoding.com">链接——<em>强调链接</em></a> <a href="https://gaoding.com"><em>链接来了</em></a></p>
  <p>ppp<p>横眉冷对千夫指</p><em>em<del>del</del></em></p>
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
  </p>

  <table>
  <tr><th>name</th><th>age</th><th>sex</th></tr>  
  <tr><td>Perry</td><td>25</td><td>man</td></tr>  
  <tr><td>Perry</td><td>25</td><td>man</td></tr>  
  <tr><td>Perry</td><td>25</td><td>man</td></tr>  
  <tr><td>Perry</td><td>25</td><td>man</td></tr>  
  </table>

  <div class="start-editor-horizantal_scroll_box" style="height:200px;">
    <div class="start-editor-scroll_item" style="width: 300px;background-color: red;">
      300px
    </div>
    <div class="start-editor-scroll_item" style="width: 300px;background-color: blue;">
      300px
    </div>
    <div class="start-editor-scroll_item" style="width: 300px;background-color: red;">
    300px
    </div>
    <div class="start-editor-scroll_item" style="width: 300px;background-color: blue;">
      300px
    </div>
  </div>

  <div class="start-editor-vertical_scroll_box" style="height:200px;">
    <div class="start-editor-scroll_item" style="background-color: red;height: 300px;">
      300px
    </div>
    <div class="start-editor-scroll_item" style="width: 300px;height: 300px;background-color: blue;">
      300px
    </div>
    <div class="start-editor-scroll_item" style="width: 300px;height: 300px;background-color: red;">
    300px
    </div>
    <div class="start-editor-scroll_item" style="width: 300px;height: 300px;background-color: blue;">
      300px
    </div>
  </div>
  
</div>
`;

const editor = new StartEditor({
  content,
  plugins: [
    new Plugin({
      view() {
        return {
          update() {
            console.log('update');
          },
        };
      },
    }),
  ],
});

window.editor = editor;

const div = document.createElement('div');
div.classList.add('start-editor-text');
document.body.appendChild(div);

editor.mount(div);

editor.addPlugins([
  new Plugin({
    view() {
      return {
        update: () => {
          console.log('new Plugin');
        },
      };
    },
  }),
]);
