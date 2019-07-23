# OTA
🚀 Distribute yours ```apk``` and ```ipa``` files over the air. Uses [ngrok](https://github.com/inconshreveable/ngrok) for public distribution urls. Just scan the qrcode from the terminal to install the app.

# Installation
```bash
npm install over-the-air --save-dev
# or install it globally
npm install over-the-air --global
```

# Args
| Name | Description |
| ---- | ----------- |
| app_name | App Name
| app_version | App version. Use the semantic version (```major.minor.patch```).
| package_name | App package name
| apk | Location of the .apk file to distribute
| ipa | Location of the .ipa file to distribute

<i>When distributing ```.ipa``` files it will copy the default ```manifest.plist``` file from the ```static``` folder so iPhone/iPad could show the installation dialog after qrcode scan.</i>

# Using the cli
```bash
over-the-air --app_name "MyAppName" \
  --app_version 1.0.0 \
  --package_name "com.myapp.package.name" \
  --apk path/to/file.apk \
  --ipa path/to/file.ipa
```

# Using node script
```javascript
// index.js
const ota = require('over-the-air');

ota({
  name: 'MyAppName',
  version: '1.0.0',
  package: 'com.myapp.package.name',
  ipa: '/path/to/file.ipa',
  apk: '/path/to/file.apk'
});
```

then

```bash
node index.js
```

### Scan the QR Code
![Captura de Tela 2019-04-16 às 17 31 46](https://user-images.githubusercontent.com/33915907/56242033-ba037000-606d-11e9-837d-5d88bfd918d7.png)
