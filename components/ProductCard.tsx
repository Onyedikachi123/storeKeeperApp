// ✅ ProductCard.tsx (fixed and explained)
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../db/database';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // ✅ CHANGED from BottomTabNavigationProp
import { RootStackParamList } from '../App'; // ✅ CHANGED type import to Stack routes

// ✅ Component
const ProductCard = ({
  product,
  onPress,
  onDelete,
}: {
  product: Product;
  onPress?: () => void;
  onDelete: () => void;
}) => {
  // ✅ FIXED: Correct navigation type for stack routes like "EditProduct"
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {product.imageUri ? (
        <Image source={{ uri: product.imageUri }} style={styles.image} />
      ) : null}

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.details}>Quantity: {product.quantity}</Text>
      <Text style={styles.details}>Price: ${product.price.toFixed(2)}</Text>

      <View style={styles.actions}>
        {/* ✅ Navigates to EditProduct (from Stack) */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('EditProduct', { productId: product.id })
          }
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ✅ Styles unchanged except for consistency
const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#1E90FF', 
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10,
  },
  editButtonText: {
    color: 'white', // ✅ white text
    fontWeight: 'bold',
    marginLeft: 5,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'red',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ProductCard;
