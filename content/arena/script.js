const api = 'http://api.are.na/v2/channels/';
const container = document.querySelector('main');
const template = document.querySelector('template');
const channelName = document.querySelector('#channel-name');
const getChannel = async (_api, _identifier) => {
  const response = await fetch(`${_api}${_identifier}?per=100&page=1#`, {
    method: 'GET'
  });
  const contents = await response.json();
  console.log(contents);
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
  const identifier = channelName.innerText;
  const channel = await getChannel(api, identifier);

  parseElements(await channel);
}
runFetch();
