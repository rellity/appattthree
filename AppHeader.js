import React, { useState } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import IoniconsHeaderButton from './IoniconsHeaderButton';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DropdownMenu = ({ menuItems, onSelect, isOpen, onClose }) => {

  if (!isOpen) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                }}
                onPress={() => onSelect(item.id)}
              >
                <Text>{item.title}</Text>
              </TouchableOpacity>
              {index < menuItems.length - 1 && (
                <View
                  style={{
                    borderBottomColor: 'lightgray',
                    borderBottomWidth: 1,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </View>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const AppHeader = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const menuItems = [
    { id: 'account', title: 'Account' },
    { id: 'about', title: 'About Us' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation(); // Use the useNavigation hook here

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleMenuItemPress = (item) => {
    setSelectedOption(item);
    setMenuVisible(false);

    // Navigate to the corresponding screen based on the selected option
    if (item === 'account') {
      navigation.navigate('AccountsScreen');
    } else if (item === 'about') {
      Alert.alert(
        'About Us: ICTS Logger',
        'Welcome to ICTS logger. Our barcode scanner application is the creation of a passionate team\nof students dedicated to offer alternatives to your attendance checking predicament. Free and easily accessible.\n\nICTS logger, it emerged from a university project led by visionary students and has grown into a user-friendly barcode scanning app. Our journey is defined by constant learning, collaboration, and a dedication to excellence.\n\nKey Features:\n- User registration\n- Barcode generation and student registration\n- Swift student identification through scanning\n- Attendance tracking\n- Streamlined student management\n- Organized officer management',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
      <Item title="Menu" iconName="ios-menu" onPress={toggleMenu} />
      <DropdownMenu
        menuItems={menuItems}
        isOpen={isMenuVisible}
        onSelect={handleMenuItemPress}
        onClose={() => setMenuVisible(false)}
      />
    </HeaderButtons>
  );
};

export default AppHeader;
