

// load html from file
import fm from 'front-matter';
import { readFileSync } from 'fs';

const html = readFileSync('example/mywebsite.html', 'utf8');
const fmdata = fm(html);

// for (let i = 0; i < root.activeElement.children.length; i++) {
//     const child = root.activeElement.children[i];
//     console.log(child.nodeName);
// }
// $('s-md').each((i, elem) => {
//     // console.log($(elem).text());
//     const file = $(elem).attr('file');
//     // replace html
//     $(elem).replaceWith(`<div>${file}</div>`);
// });


// console.log($.html());