import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  WebView,
  StatusBar,
  PanResponder,
  Platform,
  Share,
  Vibration,
  VibrationIOS,
  Geolocation,
  InteractionManager,
  CameraRoll,
  AppState,
  Settings,
  NetInfo,
  Dimensions,
  Clipboard,
  BackHandler,
} from 'react-native';
import DevPlan from './DevPlan';
import initJS from './initJS';

const status = {
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  windowScale: Dimensions.get('window').scale,
  windowFontScale: Dimensions.get('window').fontScale,
};

const strOf = Object.prototype.toString;

function helpProps(obj) {
  const help = { func: [], parms: [] };
  Object.keys(obj).forEach(k => {
    if (strOf.call(obj[k]) === '[object Function]') {
      help.func.push(k);
    } else {
      help.parms.push(k);
    }
  });
  return help;
}

export default class FullWeb extends Component {
  devPlan;
  web;
  constructor(props) {
    super(props);
    this.state = {
      isDev: false,
      url: 'http://127.0.0.1:3100/index.dev.html',
      mixedContentMode: 'always',
      geolocationEnabled: true,
      domStorageEnabled: true,
      mediaPlaybackRequiresUserAction: true,
      scalesPageToFit: true,
      barHidden: false,
      barStyle: 'default',
      barBackgroundColor: undefined,
      barTranslucent: true,
      webStyle: {},
    };
  }
  componentDidMount() {
    let backHandler = 0;
    BackHandler.addEventListener('hardwareBackPress', function() {
      backHandler++;
      this.web.postMessage({
        backHandler: backHandler,
        from: 'native',
      });
      return false;
    });
  }
  onLoad = () => {
    status.settings = Settings.get();
    NetInfo.getConnectionInfo().then(connectionInfo => {
      status.connectionInfo = connectionInfo;
      status.appState = AppState.currentState;
      setTimeout(() => {
        this.web.postMessage(
          JSON.stringify({ state: this.state, status: status, from: 'native' }),
        );
      }, 300);
    });
  };
  onChangeURL = url => {
    this.setState({
      url,
    });
  };
  getHelp = () => {
    this.web.postMessage(
      JSON.stringify({
        msg: 'getHellp-func',
        state: this.state,
        status: status,
        this: helpProps(this),
        web: helpProps(this.web),
        devPlan: helpProps(this.devPlan),
        from: 'native',
      }),
    );
  };
  getAppState = () => {
    status.appState = AppState.currentState;
    this.web.postMessage(JSON.stringify({ status: status, from: 'native' }));
  };
  getConnectionInfo = () => {
    status.connectionInfo = connectionInfo;
    this.web.postMessage(JSON.stringify({ status: status, from: 'native' }));
  };
  onNavigationStateChange = () => {};
  onMessage = event => {
    let msg = {};
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch (err) {}
    if (msg && msg.from === 'web') {
      if (msg.state && Object.keys(msg.state).length > 0) {
        try {
          this.setState({ ...msg.state }, () => {
            this.msgRuner(msg);
          });
        } catch (err) {}
      } else {
        this.msgRuner(msg);
      }
    }
  };
  msgRuner = msg => {
    if (msg.eval) {
      try {
        console.log(msg.eval);
        window.eval(msg.eval);
      } catch (err) {}
    }
    if (msg.this) {
      Object.keys(msg.this).forEach(k => {
        this[k](...msg.this[k]);
      });
    }
    if (msg.web) {
      Object.keys(msg.web).forEach(k => {
        this.web[k](...msg.web[k]);
      });
    }
    if (msg.devPlan) {
      Object.keys(msg.web).forEach(k => {
        this.devPlan[k](...msg.devPlan[k]);
      });
    }
  };
  render() {
    let barStyle = this.state.barStyle;
    if (this.state.barStyle === 'light') {
      barStyle = 'light-content';
    } else if (this.state.barStyle === 'dark') {
      barStyle = 'dark-content';
    }
    let barProps = {};
    if (this.state.barBackgroundColor) {
      barProps = {
        ...barProps,
        backgroundColor: this.state.barBackgroundColor,
      };
    }
    if (this.state.barTranslucent) {
      barProps = {
        ...barProps,
        translucent: this.state.barTranslucent,
      };
    }
    onStartShouldSetResponder = evt => {
      return true;
    };
    onResponderMove = evt => {
      console.log(evt);
    };
    onResponderEnd = evt => {
      console.log(evt);
    };
    return (
      <View style={ss.full}>
        <StatusBar
          ref={r => (this.statusBar = r)}
          hidden={this.state.barHidden}
          animated={true}
          barStyle={barStyle}
          {...barProps}
        />
        <WebView
          ref={r => (this.web = r)}
          style={[ss.full, this.state.webStyle]}
          injectedJavaScript={initJS}
          mediaPlaybackRequiresUserAction={
            this.state.mediaPlaybackRequiresUserAction
          }
          onNavigationStateChange={this.onNavigationStateChange}
          onLoad={this.onLoad}
          onMessage={this.onMessage}
          startInLoadingState={true}
          scalesPageToFit={this.state.scalesPageToFit}
          mixedContentMode={this.state.mixedContentMode}
          geolocationEnabled={this.state.geolocationEnabled}
          domStorageEnabled={this.state.domStorageEnabled}
          source={{
            uri: this.state.url,
          }}
          allowsInlineMediaPlayback={false}
        />
        {this.state.isDev && (
          <DevPlan
            ref={r => (this.devPlan = r)}
            defURL={this.state.url}
            onChange={this.onChangeURL}
          />
        )}
      </View>
    );
  }
}

const ss = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%',
  },
});
