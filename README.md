# Next.js Teslo Shop App
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```

* El -d, significa __detached__ , es para que podamos seguir escribiendo comandos luego de que cargue en la terminal

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
* MongoDB URL Local: 
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir los módulos de node
```
npm install || yarn install
npm run dev || yarn dev
```

## Llenar la base de datos con información de pruebas

Llamar a:
```
    http://localhost:3000/api/seed
```