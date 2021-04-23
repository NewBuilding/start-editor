import { defineComponent, watch } from 'vue';
import { EditorCanvas } from 'start-editor-vue';
// import applyDevTools from 'prosemirror-dev-tools';
import { StartEditor } from 'start-editor';
import { Plugin } from 'prosemirror-state';
import { useRoute } from 'vue-router';

const contentMap = {
  poem: `
  <div>
    <h2>梦游天姥吟留别</h2>
    <p>海客谈瀛洲，烟涛微茫信难求；</p>
    <p>越人语天姥，云霞明灭或可睹。</p>
    <p>天姥连天向天横，势拔五岳掩赤城。</p>
    <p>天台四万八千丈，对此欲倒东南倾。</p>
    <p>我欲因之梦吴越，一夜飞度镜湖月。</p>
    <p>湖月照我影，送我至剡溪。</p>
    <p>谢公宿处今尚在，渌水荡漾清猿啼。</p>
    <p>脚著谢公屐，身登青云梯。</p>
    <p>半壁见海日，空中闻天鸡。</p>
    <p>千岩万转路不定，迷花倚石忽已暝。</p>
    <p>熊咆龙吟殷岩泉，栗深林兮惊层巅。</p>
    <p>云青青兮欲雨，水澹澹兮生烟。</p>
    <p>列缺霹雳，丘峦崩摧。</p>
    <p>洞天石扉，訇然中开。</p>
    <p>青冥浩荡不见底，日月照耀金银台。</p>
    <p>霓为衣兮风为马，云之君兮纷纷而来下。</p>
    <p>虎鼓瑟兮鸾回车，仙之人兮列如麻。</p>
    <p>忽魂悸以魄动，恍惊起而长嗟。</p>
    <p>惟觉时之枕席，失向来之烟霞。</p>
    <p>世间行乐亦如此，古来万事东流水。</p>
    <p>别君去兮何时还？且放白鹿青崖间。须行即骑访名山。</p>
    <p>安能摧眉折腰事权贵，使我不得开心颜！</p>
  </div>
  `,
  table: `
   <table>
    <tr><th>name</th><th>age</th><th>sex</th></tr>  
    <tr><td>Perry</td><td>25</td><td>man</td></tr>  
    <tr><td>Perry</td><td>25</td><td>man</td></tr>  
    <tr><td>Perry</td><td>25</td><td>man</td></tr>  
    <tr><td>Perry</td><td>25</td><td>man</td></tr>  
  </table>
  <hr />`,
  list: `
  <dl>
    <dt>风急天高猿啸哀</dt>
    <dt>渚清沙白鸟飞回</dt>
    <dt>无边落木萧萧下</dt>
    <dt>不尽长江滚滚来</dt>
  </dl>
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
  `,
  beforeMenu: `
  <div>
    1213
    <p ><em>hello</em>word</p>
    <h2>二级标题</h3>
    <h3>好强 <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F035%2F063%2F726%2F3ea4031f045945e1843ae5156749d64c.jpg&refer=http%3A%2F%2Fyouimg1.c-ctrip.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620971326&t=3507ef9ac593d1b9956dea8c0c42daee"  / ></h3>
    <p>区我和看起来文件秦岭为秦岭为几千万立刻就去看文件驱蚊扣起晚了asdasdasdasdsa可请叫我了空气讲课群文件情况文件情况为</p>
    <a href="https://gaoding.com">链接——<em>强调链接</em></a> <a href="https://gaoding.com"><em>链接来了</em></a>
    <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F035%2F063%2F726%2F3ea4031f045945e1843ae5156749d64c.jpg&refer=http%3A%2F%2Fyouimg1.c-ctrip.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620971326&t=3507ef9ac593d1b9956dea8c0c42daee"  style="display:block;" >
  </div>
`,
  media: `
  <div>
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
  `,
};

export const editor = new StartEditor({
  content: '',
  plugins: [
    new Plugin({
      view() {
        return {
          update() {
            // console.log('update');
          },
        };
      },
    }),
  ],
});

export default defineComponent({
  name: 'editor',
  setup() {
    const route = useRoute();

    watch(
      () => route.query,
      () => {
        const key = route.query.content as string;
        editor.setContent(contentMap[key as keyof typeof contentMap] || contentMap.poem);
      },
      { immediate: true },
    );
    // applyDevTools(editor.view);

    return () => (
      <div class="start-vue-main-editor">
        <EditorCanvas editor={editor} />
      </div>
    );
  },
});
