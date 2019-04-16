# OTA
🚀 Over The Air distribution for Android and iOS (Android not yet supported).

# Installation
```bash
npm install https://github.com/ffrm/ota --save-dev
```

# Usage

### Create your script
```javascript
// index.js
const ota = require('ota');

ota({
  name: 'MyAppName',
  version: '1.0.0',
  package: 'com.myapp.package.name',
  ipa: '/path/to/file.ipa',
  apk: '/path/to/file.apk'
});
```

### Run the script
```bash
node index.js
```

### Scan the QR Code
![Captura de Tela 2019-04-16 às 17 31 46](https://user-images.githubusercontent.com/33915907/56242033-ba037000-606d-11e9-837d-5d88bfd918d7.png)
