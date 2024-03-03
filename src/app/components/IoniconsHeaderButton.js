// IoniconsHeaderButton.js
import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

const IoniconsHeaderButton = (props) => (
  <HeaderButton
    {...props}
    IconComponent={Ionicons}
    iconSize={23}
    color="black"
    style={{ marginRight: 10, position: "absolute", right: 0 }}
  />
);

export default IoniconsHeaderButton;
