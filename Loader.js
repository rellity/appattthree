import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

const Loader = ({ isActive }) => {
  return isActive ? (
    <View style={{ width: 200, height: 200 }}>
      <LottieView
        source={require('./loader1.json')}
        autoPlay
      />
    </View>
  ) : null;
};
export default Loader;
