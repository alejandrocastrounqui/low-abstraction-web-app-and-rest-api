


class Loading{

  current = 'INITIALIZING';
  next = 'HIDDEN';
  
  constructor(descriptor){
    var element = document.querySelector(descriptor)
    if(element){
      var jqElem = $(element);
      if(typeof jqElem.modal === 'function'){
        this.modal = jqElem.modal({
          backdrop: 'static'
        })
        this.current = 'HIDDEN'
        return
      }
    }
    $(document).ready(()=>{
      this.modal = $(document.querySelector(descriptor)).modal({
        backdrop: 'static'
      });
      this.current = 'HIDDEN'
      if(this.next == 'SHOW'){
        this._show()
      }
    });
    
  }

  _show(){
    this.current = 'SHOWING'
    this.next = 'SHOWN'
    var f = () => {
      this.modal.off('shown.bs.modal', f);
      this.current = 'SHOWN'
      if(this.next == 'HIDE'){
        this._hide()
      }
    }
    this.modal.on('shown.bs.modal', f); 
    this.modal.modal('show')
  }

  _hide(){
    this.current = 'HIDDING'
    this.next = 'HIDDEN'
    var f = () => {
      this.modal.off('hidden.bs.modal', f);
      this.current = 'HIDDEN'
      if(this.next == 'SHOW'){
        this._show()
      }
    }
    this.modal.on('hidden.bs.modal', f); 
    this.modal.modal('hide')
  }

  show(){
    if(['SHOWING', 'SHOWN'].includes(this.current) || this.next == 'SHOW'){
      return
    }
    if(['INITIALIZING', 'HIDDING'].includes(this.current)){
      this.next = 'SHOW'
      return
    }
    if(this.current !== 'HIDDEN'){
      console.warn('unexpected current != HIDDEN')
    }
    this._show()
  }

  hide(){
    if(['HIDDING', 'HIDDEN'].includes(this.current) || this.next == 'HIDE'){
      return
    }
    if(['INITIALIZING', 'SHOWING'].includes(this.current)){
      this.next = 'HIDE'
      return
    }
    if(this.current !== 'SHOWN'){
      console.warn('unexpected current != SHOWN')
    }
    this._hide()
  }

}