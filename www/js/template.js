class Template{
  
  constructor(base){
    this.base = base;
  }

  load(path){
    return fetch(this.base + '/' + path + '.html')
      .then(response => response.text())
      .then(html => {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
      })
  }
}