// ✅ screens/EditProductScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateProduct, fetchProduct } from "../db/database";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

export interface Product {
  name: string;
  quantity: number;
  price: number;
  imageUri?: string | null; // ✅ changed to match db type
}

type Props = NativeStackScreenProps<RootStackParamList, 'EditProduct'>;

const EditProductScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params as { productId: number };
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProduct(productId);
        setName(product.name);
        setQuantity(product.quantity.toString());
        setPrice(product.price.toString());
        setImageUri(product.imageUri || undefined);
      } catch (err) {
        Alert.alert("Error", "Failed to load product.");
        console.error(err);
      }
    };
    loadProduct();
  }, [productId]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (name && quantity && price) {
      await updateProduct(
        productId,
        name,
        parseInt(quantity),
        parseFloat(price),
        imageUri
      );
      Alert.alert("Success", "Product updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
        <Text style={styles.imageButtonText}>Pick an image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TouchableOpacity style={styles.imageButton} onPress={handleSubmit}>
        <Text style={styles.imageButtonText}>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginVertical: 10, fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  imageButton: {
    marginVertical: 12,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  imageButtonText: { color: "#fff", fontWeight: "600" },
  image: { width: "100%", height: 200, marginVertical: 10 },
});

export default EditProductScreen;
