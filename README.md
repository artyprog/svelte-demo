# Svelte Demo

http://scott.maclure.info/svelte-demo/

## Running

Install globals and locals

```
npm install -g http-server svelte-cli rollup
npm install
```

(Re)Generate test data:

```
node scripts/generate-data.js
```

Build bundle.js, run server and open browser:

```
npm start
```

## TODO

- [x] Initial setup with 1k rows, delete row functionality
- [x] Deploy to github
- [x] Split HelloWorld into a couple of subcomponents
- [ ] Add a search/filter component above table (update data.json to be more diverse)
- [ ] Add a build system (rollup)
- [ ] Testing components individually (Mocha)