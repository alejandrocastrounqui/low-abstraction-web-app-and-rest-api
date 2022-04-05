isntalar dependencias

``` bash
npm install
```

ejecutar app (hay que apagarla y volver a prenderla si se realizan cambios, no tiene hot-reload)

``` bash
npm start
```

de manera predeterminada escucha en el puerto 3000 pero se puede cambiar por variable de entorno

``` bash
export PORT=3005
```

registrar un elemento    
``` bash
curl -H "Content-type:application/json" -d '{"name":"mi primer item"}' http://localhost:3000
```

listar todos los elementos    
``` bash
curl http://localhost:3000
```

ver un solo elemento completo  
``` bash
curl http://localhost:3000/1 # cambiar 1 por el id correspondiente
```