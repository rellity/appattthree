import React, { useState } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import IoniconsHeaderButton from './IoniconsHeaderButton';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

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

const AppHeader = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const menuItems = [
    { id: 'account', title: 'Account' },
    { id: 'about', title: 'About Us' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleMenuItemPress = (item) => {
    setSelectedOption(item);
    setMenuVisible(false);
  };

  const showAccountDialog = () => {
    setSelectedOption('account');
    setMenuVisible(false);
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
