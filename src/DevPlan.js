import React, { Component } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';

class InputURL extends Component {
  state = {
    url: this.props.defURL,
    isShow: true,
  };
  onBlur = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.url);
      this.setState({
        isShow: false,
      });
    }
  };
  onChangeText = txt => {
    this.setState({
      url: txt,
    });
  };
  hidden = () => {
    this.props.onChange(this.state.url);
    this.setState({ isShow: false });
  };
  show = () => {
    this.setState({ isShow: true });
  };
  render() {
    return (
      <View
        style={{
          top: this.state.isShow ? 0 : 2000,
          height: '100%',
          width: '100%',
          position: 'absolute',
          zIndex: 9999,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, width: '100%' }}
          onPress={this.hidden}
        />
        <View style={{ height: 500, backgroundColor: '#fff' }}>
          <TextInput
            onChangeText={this.onChangeText}
            placeholder={this.props.defURL}
            style={{
              backgroundColor: '#f2f2f2',
              margin: 16,
              padding: 8,
              height: 45,
            }}
            onBlur={this.onBlur}
          />
        </View>
      </View>
    );
  }
}

export default InputURL;
