# Webview 和 ReactNative 通讯

在 react-native 端

```js
this.state = {
  url: 'http://127.0.0.1:3100/index.dev.html',
};
```

在 web 端：

```js
window.onload = () => {
  window['rn-post']({
    this: {
      getHelp: [],
    },
    state: { isDev: true },
  });
  window['rn-on'](msg => {
    console.log(msg);
    t.text = JSON.stringify(msg);
  });
};
```
