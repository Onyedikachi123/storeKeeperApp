import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ProductFormProps {
  name: string;
  setName: (name: string) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  price: string;
  setPrice: (price: string) => void;
  imageUri?: string;
  setImageUri: (uri?: string) => void;
  onSubmit: () => void;
}

const ProductForm = ({
  name,
  setName,
  quantity,
  setQuantity,
  price,
  setPrice,
  imageUri,
  setImageUri,
  onSubmit,
}: ProductFormProps) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Pick an image from camera roll" onPress={handleImagePicker} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Submit" onPress={onSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
});

export default ProductForm;