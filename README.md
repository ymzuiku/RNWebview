# Webview 和 ReactNative 通讯

## 原理
在web页面加载前，插入了js代码，此后，在web端可以通过预先定义的方法进行通讯
```js
// webview插入的代码
function postReactNative(obj) {
  window.postMessage(JSON.stringify({ ...obj, from: 'web' }), '*');
}
var onReactNativeMsgFns = [];
function onReactNativeMsg(fn) {
  onReactNativeMsgFns.push(fn);
}
document.addEventListener('message', e => {
  var msg = {};
  try {
    msg = JSON.parse(e.data);
  } catch (err) {}
  if (msg.from === 'native') {
    for (let i = 0; i < onReactNativeMsgFns.length; i++) {
      onReactNativeMsgFns[i](msg);
    }
  }
});
window['rn-on'] = onReactNativeMsg;
window['rn-post'] = postReactNative;
```


## 通讯

在 react-native 端

```js
this.state = {
  url: 'http://127.0.0.1:3100/index.dev.html',
};
```

在 web 端：

```js
window.onload = () => {
  setTimeout(()=>{
    window['rn-post']({
    this: {
      getHelp: [],
    },
    state: { isDev: true },
  });
  window['rn-on'](msg => {
    console.log(msg);
  });
  })
};
```

## 交互
```js
window['rn-post'](
  {
    // 执行react-native端this的函数
    this: {
      getHelp: [],
    },
    // 修改this.state
    state: { isDev: true },
    // 执行react-native的硬件相关方法, 例如获取当前应用状态
    eval:`var current = AppState.currentState; this.postMessage({current: current})`,
  }
);
// 接收回调
window['rn-on'](msg => {
  console.log(msg);
});
```
