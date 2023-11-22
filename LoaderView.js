import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

const LoaderView = ({ isActive }) => {
  return isActive ? (
    <View style={{ width: 150, height: 150 }}>
      <LottieView
        source={require('./loader1.json')}
        autoPlay
        loop
      />
    </View>
  ) : null;
};
export default LoaderView;
