import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { RootStackParamList, RootTabParamList } from "../App";
import { fetchProduct } from "../db/database";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

// ✅ Composite navigation type
type ProductDetailsScreenNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "ProductDetails">,
  BottomTabNavigationProp<RootTabParamList>
>;

type Props = {
  route: { params: { productId: number } };
  navigation: ProductDetailsScreenNavProp;
};

const ProductDetailsScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scale] = useState(new Animated.Value(1)); // ✅ animation

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  // ✅ Navigate back to Home tab
  const handleBackToHome = () => {
    navigation.navigate("Tabs"); // ✅ Tabs is typed in RootStackParamList
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProduct(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );

  if (!product)
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToHome}
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>
      {product.imageUri && <Image source={{ uri: product.imageUri }} style={styles.image} />}
      <Text style={styles.details}>Quantity: {product.quantity}</Text>
      <Text style={styles.details}>Price: ${product.price.toFixed(2)}</Text>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToHome}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  name: { fontSize: 24, fontWeight: "bold" },
  image: { width: "100%", height: 200, marginVertical: 10 },
  details: { fontSize: 16, marginVertical: 5 },
  backButton: {
    marginTop: 20,
    backgroundColor: "black", // ✅ black background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "white", // ✅ white text
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetailsScreen;
