import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import AddProductScreen from "./screens/AddProductScreen";
import EditProductScreen from "./screens/EditProductScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";

// ------------------- STACK PARAMS -------------------
export type RootStackParamList = {
  Tabs: undefined; // bottom tabs
  EditProduct: { productId: number };
  ProductDetails: { productId: number };
  AddProduct: undefined;
};

// ------------------- TAB PARAMS -------------------
export type RootTabParamList = {
  Home: undefined;
  AddProduct: undefined;
};

// ------------------- STACK -------------------
const Stack = createNativeStackNavigator<RootStackParamList>();

// ------------------- TABS -------------------
const Tab = createBottomTabNavigator<RootTabParamList>();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: true,
      tabBarActiveTintColor: "#007bff",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: { paddingBottom: 5, height: 60 },
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
        if (route.name === "Home") iconName = "home-outline";
        else if (route.name === "AddProduct") iconName = "add-circle-outline";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="AddProduct" component={AddProductScreen} />
  </Tab.Navigator>
);

// ------------------- APP -------------------
const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
