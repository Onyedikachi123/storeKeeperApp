import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { insertProduct, init } from "../db/database";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../App";

type AddProductNavProp = BottomTabNavigationProp<
  RootTabParamList,
  "AddProduct"
>;

const AddProductScreen = () => {
  const nav = useNavigation<AddProductNavProp>();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

 const handleImagePicker = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Access to media library is required."
      );
      return;
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  // ✅ Updated to check result.assets
  if (!result.canceled && result.assets && result.assets.length > 0) {
    setImageUri(result.assets[0].uri);
  }
};


  const resetForm = () => {
    setName("");
    setQuantity("");
    setPrice("");
    setImageUri(undefined);
  };

  // ✅ handle camera capture correctly
  const handleCameraCapture = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Access to camera is required.");
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // ✅ use the URI
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert("Validation", "Please fill in all fields.");
      return;
    }

    const q = parseInt(quantity, 10);
    const p = parseFloat(price);
    if (isNaN(q) || isNaN(p)) {
      Alert.alert("Validation", "Quantity and Price must be numbers.");
      return;
    }

    setSaving(true);
    try {
      await init();
      await insertProduct(name.trim(), q, p, imageUri ?? null);
      Alert.alert("Success", "Product added successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm(); // ✅ reset form
            nav.navigate("Home");
          },
        },
      ]);
    } catch (err) {
      console.error("Add product error:", err);
      Alert.alert("Error", "Failed to add product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Apple"
      />
      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="e.g. 10"
      />
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="e.g. 9.99"
      />

      <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
        <Text style={styles.imageButtonText}>Pick from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.imageButton}
        onPress={handleCameraCapture}
      >
        <Text style={styles.imageButtonText}>Take a Photo</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TouchableOpacity
        style={[styles.addButton, saving && styles.addButtonDisabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.addButtonText}>{saving ? "Adding..." : "Add"}</Text>
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
  image: { width: "100%", height: 200, marginVertical: 10, borderRadius: 6 },
  addButton: {
    marginTop: 16,
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonDisabled: { opacity: 0.7 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default AddProductScreen;
