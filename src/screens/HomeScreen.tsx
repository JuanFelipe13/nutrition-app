import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation, useRoute, useIsFocused, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { searchFoodByName, recognizeAndSaveImage, recognizeImage } from '../services/api';
import { NutritionInfo, NutritionResponse, NutrientDetails } from '../types/nutrition';
import { RecognitionResponse } from '../types/predictions';
import DetailedNutritionModal from '../components/DetailedNutritionModal';

// Define stack param list including Home receiving imageUri
type RootStackParamList = {
  Home: { imageUri?: string };
  Camera: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const MinimalNutritionCard: React.FC<{data: NutritionInfo}> = ({ data }) => {
  // Helper function to safely access nutrient data
  const getNutrient = (key: keyof NutrientDetails) => data.nutrients?.[key] ?? 'N/A';

  return (
    <View style={minimalStyles.card}>
      <Text style={minimalStyles.title}>{data.food_name}</Text>
      {/* Display serving size prominently */}
      {data.serving_size && (
        <Text style={minimalStyles.servingSize}>Serving Size: {data.serving_size}</Text>
      )}
      
      <View style={minimalStyles.nutritionContainer}>
        {/* Calories (Large) */}
        <View style={minimalStyles.nutritionItemLarge}>
          <Text style={minimalStyles.largeNutritionValue}>{getNutrient('calories')}</Text>
          <Text style={minimalStyles.largeNutritionLabel}>Calorías</Text>
        </View>
        
        {/* Proteins (Large) */}
        <View style={minimalStyles.nutritionItemLarge}>
          <Text style={minimalStyles.largeNutritionValue}>{getNutrient('proteins')}g</Text>
          <Text style={minimalStyles.largeNutritionLabel}>Proteínas</Text>
        </View>
        
        {/* Carbohydrates (Large) */}
        <View style={minimalStyles.nutritionItemLarge}>
          <Text style={minimalStyles.largeNutritionValue}>{getNutrient('carbohydrates')}g</Text>
          <Text style={minimalStyles.largeNutritionLabel}>Carbohidratos</Text>
        </View>
      </View>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [nutritionData, setNutritionData] = useState<NutritionInfo | null>(null);
  const [alternatives, setAlternatives] = useState<NutritionInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<NutritionInfo | null>(null);

  // Assume a user ID is available (TEMPORARY)
  const userId = 'temp-user-123'; 

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const isFocused = useIsFocused(); 

  // Effect to handle image URI passed back from CameraScreen
  useEffect(() => {
    if (isFocused && route.params?.imageUri) {
      const { imageUri } = route.params;
      navigation.setParams({ imageUri: undefined }); 
      
      handleImageRecognition(imageUri);
    }
  }, [isFocused, route.params?.imageUri]);

  // Function to handle image recognition API call
  const handleImageRecognition = async (uri: string) => {
    setLoading(true);
    setError(null);
    setNutritionData(null); 
    setAlternatives([]);

    try {
      const response: RecognitionResponse = await recognizeAndSaveImage(uri, userId);
      
      if (response.status === 'success' && response.main_prediction) {
        await handleSearch(response.main_prediction.class);
        Alert.alert('Image Recognized', `Detected: ${response.main_prediction.class}`);
      } else {
        setError(response.message || 'Could not recognize food in the image.');
      }
    } catch (err) {
      setError('Error processing image or fetching nutrition data.');
      console.error("Error in image recognition flow:", err);
    } finally {
      setLoading(false);
    }
  };

  // Modified handleSearch to be callable with a query
  const handleSearch = async (query?: string) => {
    const currentQuery = query || searchQuery;
    if (!currentQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setNutritionData(null); 
    setAlternatives([]);
    
    try {
      const response = await searchFoodByName(currentQuery);
      
      if (response.status === 'error') {
        setError(response.message || 'Error searching for food');
      } else {
        setNutritionData(response.data || null);
        setAlternatives(response.alternatives || []);
      }
    } catch (err: any) {
      setError(err.message || 'Connection error during search');
    } finally {
      setLoading(false);
    }
  };

  // Function to open the modal
  const handleOpenModal = (food: NutritionInfo) => {
    setSelectedFood(food);
    setIsModalVisible(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedFood(null); 
  };

  return (
    <View style={minimalStyles.container}>
      <View style={minimalStyles.header}>
        <Text style={minimalStyles.headerTitle}>NutriSearch</Text>
        {/* Add Camera Button to Header */}
        <TouchableOpacity 
          style={minimalStyles.cameraButton} 
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={minimalStyles.searchContainer}>
        <TextInput
          style={minimalStyles.searchInput}
          placeholder="Search food or use camera..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch()} 
        />
        <TouchableOpacity 
          style={minimalStyles.searchButton} 
          onPress={() => handleSearch()} 
        >
          <Text style={minimalStyles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={minimalStyles.loadingContainer}>
          <Text style={minimalStyles.loadingText}>Buscando información...</Text>
        </View>
      ) : (
        <ScrollView style={minimalStyles.scrollContainer}>
          {error && (
            <View style={minimalStyles.errorContainer}>
              <Text style={minimalStyles.errorMessage}>{error}</Text>
            </View>
          )}
          
          {nutritionData && (
            <View style={minimalStyles.resultSection}>
              <Text style={minimalStyles.sectionTitle}>Resultado:</Text>
              <TouchableOpacity onPress={() => handleOpenModal(nutritionData)}>
                <MinimalNutritionCard data={nutritionData} />
              </TouchableOpacity>
            </View>
          )}
          
          {alternatives && alternatives.length > 0 && (
            <View style={minimalStyles.resultSection}>
              <Text style={minimalStyles.sectionTitle}>Alternativas:</Text>
              {alternatives.map((item) => (
                <TouchableOpacity key={item.product_code || item.food_name} onPress={() => handleOpenModal(item)}>
                  <MinimalNutritionCard data={item} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Render the Modal */}
      {selectedFood && (
        <DetailedNutritionModal 
          isVisible={isModalVisible}
          data={selectedFood}
          onClose={handleCloseModal}
        />
      )}
    </View>
  );
};

const minimalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 40,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginLeft: 40,
  },
  cameraButton: {
    position: 'absolute',
    right: 16,
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff5252',
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: 14,
  },
  resultSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  servingSize: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  // Styles for large nutrient items
  nutritionItemLarge: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    minWidth: 80,
  },
  largeNutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  largeNutritionLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  // Styles for smaller nutrient items (example)
  nutritionItemSmall: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
    minWidth: 60,
  },
  smallNutritionValue: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#444',
  },
  smallNutritionLabel: {
    fontSize: 11,
    color: '#777',
    marginTop: 3,
  },
  source: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8, 
  },
});

export default HomeScreen; 