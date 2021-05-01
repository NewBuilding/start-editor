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
  <h2>1213</h2>
  <video src="https://st0.dancf.com/csc/1681/configs/system/20210021-110338-ea07.mp4" controls></video>
  <audio src="https://st0.dancf.com/csc/1681/configs/system/20210308-174808-4b46.mp3" controls></audio>
  <p>
    123123123<img />12312312
    <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F035%2F063%2F726%2F3ea4031f045945e1843ae5156749d64c.jpg&refer=http%3A%2F%2Fyouimg1.c-ctrip.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620971326&t=3507ef9ac593d1b9956dea8c0c42daee" />
    我寄愁心与明月
  </p>
  <img width="100%" />
  <video></video>
  <audio></audio>

</div>
`;

const editor = new StartEditor({
  content,
});

window.editor = editor;

const div = document.createElement('div');
div.classList.add('start-editor-text');
document.body.appendChild(div);

editor.mount(div);
