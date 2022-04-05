class API{
  
  constructor(apiUrl){
    this.apiUrl = apiUrl;
  }

  list(){
    return fetch(this.apiUrl)
      .then(response=> response.json())
  }

  detail(id){
    return fetch(`${this.apiUrl}/${id}`)
      .then(response=> response.json())
  }

  create(elem){
    return fetch(`${this.apiUrl}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(elem)
    }).then(response=> response.json())
  }
  
}