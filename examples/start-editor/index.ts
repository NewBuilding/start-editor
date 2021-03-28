import { StartEditor } from 'start-editor';

const content = `
  <div>
   <p>
    <a href="https://baidu.com">百度</a>
    </p>  
  </div> 
`;

const editor = new StartEditor({ content });

const $el = editor.$el;
$el.style.width = '500px';
$el.style.height = '300px';
$el.style.border = '1px solid black';

document.body.appendChild($el);
