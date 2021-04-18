/* eslint-disable  */
const path = require('path');
const fs = require('fs');
const SVGSpriter = require('svg-sprite');

const iconDirPath = path.resolve(__dirname, '../packages/start-editor/src/components/icon/icons');
const imageDirPath = path.resolve(__dirname, '../packages/start-editor/src/components/icon/images');
const outputPath = path.resolve(__dirname, '../packages/start-editor/src/components/icon');

async function run() {
  const [iconRes, imageRes] = await Promise.all([
    compile(getConfig(true), iconDirPath),
    compile(getConfig(false, 'image-'), imageDirPath),
  ]);
  const content = iconRes.content + imageRes.content;
  const nameType = [
    ...iconRes.names.map((name) => `'${name}'`),
    ...imageRes.names.map((name) => `'image-${name}'`),
  ].join('|');
  fs.writeFileSync(
    path.resolve(outputPath, 'iconSprite.ts'),
    `export default '${content}'\nexport type Name = ${nameType}`,
  );
}

run();

function getConfig(removeFill, idPrefix = '') {
  return {
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false,
    },
    shape: {
      id: {
        generator(name) {
          return 'start-editor-icon--' + idPrefix + name.split('.').slice(0, -1).join('.');
        },
      },
      dimension: {
        // Dimension related options
        maxWidth: 2000, // Max. shape width
        maxHeight: 2000, // Max. shape height
        precision: 2, // Floating point precision
        attributes: false, // Width and height attributes on embedded shapes
      },
      spacing: {
        // Spacing related options
        padding: 0, // Padding around all shapes
        box: 'content', // Padding strategy (similar to CSS `box-sizing`)
      },
      transform: [
        !removeFill ?
        'svgo' : {
          svgo: {
            plugins: [{
              removeAttrs: {
                attrs: 'fill',
              },
            }, ],
          },
        },
      ],
    },
    mode: {
      inline: true,
      symbol: {
        dimensions: true,
        common: 'start-editor-icon',
        prefix: 'start-editor-icon',
        sprite: 'icon-sprite',
        id: 'start-editor',
      },
    },
  };
}

function compile(config, dirpath) {
  const spriter = new SVGSpriter(config);
  const filePaths = fs.readdirSync(dirpath);
  const names = [];
  filePaths.forEach((filename) => {
    const filePath = path.resolve(dirpath, filename);
    const svg = fs.readFileSync(filePath, 'utf-8');
    spriter.add(filePath, filename, svg);
    names.push(filename.split('.')[0]);
  });
  return new Promise((resolve, reject) => {
    spriter.compile(function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve({
          names,
          content: result.symbol.sprite.contents,
        });
      }
    });
  });
}
