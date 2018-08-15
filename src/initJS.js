import { Platform } from 'react-native';

const initJS = `
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
window['plan'] = 'native';
window['planOS'] = ${Platform.OS};
`;

export default initJS;
