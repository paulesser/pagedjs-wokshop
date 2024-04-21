const api = 'http://api.are.na/v2/channels/';
const container = document.querySelector('#grid');
const template = document.querySelector('template');

const getChannelFromId = async (_api, _id) => {
  const response = await fetch(`${_api}${_id}?per=500`, {
    method: 'GET'
  });
  const contents = await response.json();
  return contents.contents;
};

const parseElements = (_array) => {
  _array.forEach((element) => {
    let templateEl = template.content.cloneNode(true);
    templateEl.querySelector('h2').innerHTML = element.title;
    const image = templateEl.querySelector('img');
    if (!element.image) {
      templateEl.querySelector('div').removeChild(image);
    } else {
      image.src = element.image.display.url;
    }
    templateEl.querySelector('p').innerHTML = element.content;
    container.appendChild(templateEl);
  });
};

async function runFetch() {
  const channel = await getChannelFromId(api, 2502756);
  parseElements(await channel);
}
runFetch();
