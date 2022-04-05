class Form{

  bind(form, onValidSubmit = ()=>{}, constraints = {}){
    var onsubmit = function (event) {
      event.preventDefault()
      event.stopPropagation()
      var errors = validate(form, constraints);
      if(!errors){
        form.classList.add("has-success");
        form.classList.remove("has-error");
        var formData = new FormData(form)
        var data = {}
        for (var key of formData.keys()) {
          data[key] = formData.get(key)
        }
        // form.classList.add('was-validated')
        onValidSubmit(data)
      }
      else{
        form.classList.add("has-error");
        form.classList.remove("has-success");
      }
      form.querySelectorAll('.form-control').forEach((x)=>{
        x.classList.remove('is-invalid')
        x.classList.add('is-valid')
      })
      for(var errorName in errors){
        var control = form.querySelector(`input[name="${errorName}"]`);
        if(!control){
          continue;
        }
        control.classList.add('is-invalid')
        var feedback = form.querySelector(`div[data-feedback-for="${errorName}"]`);
        feedback.innerHTML = errors[errorName][0]
      }
    }
    form.addEventListener('submit', onsubmit, false)
    return ()=> form.removeEventListener('submit', onsubmit, false)
  }

}