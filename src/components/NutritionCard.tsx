import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { NutritionInfo } from '../types/nutrition';

interface NutritionCardProps {
  data: NutritionInfo;
  onPress?: () => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ data, onPress }) => {
  const theme = useTheme();
  
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>{data.food_name}</Title>
          {data.image_url && (
            <Image 
              source={{ uri: data.image_url }} 
              style={styles.image} 
              resizeMode="cover"
            />
          )}
        </View>
        
        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{data.calories}</Text>
            <Text style={styles.nutritionLabel}>Calorías</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{data.protein_g}g</Text>
            <Text style={styles.nutritionLabel}>Proteínas</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{data.fat_g}g</Text>
            <Text style={styles.nutritionLabel}>Grasas</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{data.carbs_g}g</Text>
            <Text style={styles.nutritionLabel}>Carbohidratos</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fibra:</Text>
            <Text style={styles.detailValue}>{data.fiber_g}g</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Azúcares:</Text>
            <Text style={styles.detailValue}>{data.sugar_g}g</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tamaño de porción:</Text>
            <Text style={styles.detailValue}>{data.serving_size_g}g</Text>
          </View>
        </View>
        
        <Paragraph style={styles.source}>Fuente: {data.source}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
  },
  detailValue: {
    fontWeight: '600',
    fontSize: 14,
  },
  source: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default NutritionCard; 