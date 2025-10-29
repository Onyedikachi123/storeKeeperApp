import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  fetchProducts,
  deleteProduct,
  Product as DBProduct,
} from "../db/database";
import ProductCard from "../components/ProductCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, RootTabParamList } from "../App";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

// ------------------- TYPE SAFE NAVIGATION -------------------
type HomeScreenNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavProp;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const isFocused = useIsFocused();

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      const cleaned = fetchedProducts.map((p) => ({
        ...p,
        imageUri: p.imageUri ?? undefined,
      }));
      setProducts(cleaned);

      const quantitySum = cleaned.reduce((sum, p) => sum + p.quantity, 0);
      const valueSum = cleaned.reduce((sum, p) => sum + p.quantity * p.price, 0);
      setTotalQuantity(quantitySum);
      setTotalValue(valueSum);
    };
    loadProducts();
  }, [isFocused]);

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    const refreshed = await fetchProducts();
    const cleaned = refreshed.map((p) => ({ ...p, imageUri: p.imageUri ?? undefined }));
    setProducts(cleaned);

    const quantitySum = cleaned.reduce((sum, p) => sum + p.quantity, 0);
    const valueSum = cleaned.reduce((sum, p) => sum + p.quantity * p.price, 0);
    setTotalQuantity(quantitySum);
    setTotalValue(valueSum);
  };

  // ✅ Dashboard cards data
  const dashboardData = [
    {
      key: "products",
      label: "Total Products",
      value: products.length,
      color: "#4f46e5", // blue
      icon: <Ionicons name="cube-outline" size={24} color="white" />,
    },
    {
      key: "quantity",
      label: "Total Quantity",
      value: totalQuantity,
      color: "#10b981", // green
      icon: <MaterialCommunityIcons name="package-variant-closed" size={24} color="white" />,
    },
    {
      key: "value",
      label: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      color: "#f59e0b", // yellow/orange
      icon: <FontAwesome5 name="dollar-sign" size={24} color="white" />,
    },
  ];

  return (
    <View style={styles.container}>
      {/* ✅ Dashboard cards horizontal scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dashboard}>
        {dashboardData.map((item) => (
          <View key={item.key} style={[styles.card, { backgroundColor: item.color }]}>
            <View style={styles.cardIcon}>{item.icon}</View>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate("ProductDetails", { productId: item.id })
            }
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  dashboard: {
    marginBottom: 20,
  },
  card: {
    width: 150,
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: {
    marginBottom: 2,
  },
  cardValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  cardLabel: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "600",
  },
});

export default HomeScreen;
