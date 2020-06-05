# iseeya
A WebRTC application that uses simple peer for video conferencing

# How I built it...
1. Initialize a node express project
```
npm install express-generator -g
express --view=ejs iseeya
```
2.  Go to project dir and install important packages with the following commands
```
npm install simple-peer socket.io --save
npm install watchify --save-dev
```
3. Update *package.json* by updating *scripts* and adding *main* 
```
  "main": "main.js",
  "scripts": {
    "start": "nodemon app.js",
    "watch": "npx watchify main.js -o ./public/bundle.js"
  }
```

4. Do the following commands on separate terminals
```
npm start
```

```
npm run watch
```