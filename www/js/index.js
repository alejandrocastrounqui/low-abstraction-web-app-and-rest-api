

var api = new API('http://localhost:3000');
var router = new Router();
var form = new Form();
var template = new Template('templates');
var loadingModal = new Loading('#loading');

var wait = document.getElementById('wait')
var routerFrame = document.getElementById('router')



router
  .on('/', () => {
    template.load('dashboard').then((element)=>{
      routerFrame.innerHTML='';
      routerFrame.appendChild(element)
    })
  })
  .on('/list', () => {
    routerFrame.innerHTML='';
    loadingModal.show();
    Promise.all([
      template.load('list'),
      api.list()
    ])
    .then(([root, items])=>{
      loadingModal.hide();
      const itemDiv = root.querySelector('#item')
      const parent = itemDiv.parentNode;
      parent.innerHTML='';
      for(var item of items){
        var itemElement = itemDiv.cloneNode(true)
        itemElement.setAttribute('href', `#/detail/${item.id}`)
        for(var attrName in item){
          var elem = itemElement.querySelector(`#${attrName}`)
          elem && (elem.innerHTML = item[attrName])
        }
        parent.appendChild(itemElement);
      }
      routerFrame.appendChild(root)
    })
  })
  .on('/create', () => {
    routerFrame.innerHTML='';
    loadingModal.show();
    template.load('form')
    .then((root)=>{
      loadingModal.hide();
      routerFrame.appendChild(root)
      root.querySelector('#detail').classList.add('d-none')
      var unbind = form.bind(
        root.querySelector('form'),
        (data)=>{
          loadingModal.show();
          api.create(data).then(()=>{
            loadingModal.hide();
            var modal = root.querySelector('#success-modal');
            $(modal).modal('show');
            $(modal).on('hidden.bs.modal', ()=>{
              router.pushState('/list')
              unbind()
            })
          })
        },{
          firstName:{
            presence: true
          }
        }
      )
    })
  })
  .on('/detail/:id', ({ params }) => {
    routerFrame.innerHTML='';
    loadingModal.show();
    Promise.all([
      template.load('form'),
      api.detail(params.id)
    ])
    .then(([root, item])=>{
      loadingModal.hide();
      routerFrame.appendChild(root)
      root.querySelector('#create').classList.add('d-none')
      root.querySelector('fieldset').setAttribute('disabled', 'disabled')
      for(var attrName in item){
        var elem = root.querySelector(`[name=${attrName}]`)
        elem && (elem.value = item[attrName])
      }
      
    })
  })
  .always((path)=> {
    var links = document.querySelectorAll('.nav-link')
    for(var link of links){
      if(link.hash && /^#/.test(link.hash)){
        var hash = link.hash.slice(1)
        if(hash === path){
          link.classList.add('active')
          continue;
        }
      }
      link.classList.remove('active')
    }
  })

  