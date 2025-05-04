import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { NutritionInfo, NutrientDetails } from '../types/nutrition'; // Assuming types are in this path

interface Props {
  isVisible: boolean;
  data: NutritionInfo | null;
  onClose: () => void;
}

// Helper to render a detail row
const DetailRow: React.FC<{ label: string; value: string | number | string[] | undefined | null }> = ({ label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  let displayValue = value;
  if (Array.isArray(value)) {
    displayValue = value.join(', ');
  }

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{displayValue}</Text>
    </View>
  );
};

// Helper to render nutrient row
const NutrientRow: React.FC<{ label: string; value?: number; unit?: string }> = ({ label, value, unit }) => {
  if (value === undefined || value === null) {
    return null;
  }
  return (
    <View style={styles.nutrientRow}>
      <Text style={styles.nutrientLabel}>{label}:</Text>
      <Text style={styles.nutrientValue}>{value}{unit}</Text>
    </View>
  );
};


const DetailedNutritionModal: React.FC<Props> = ({ isVisible, data, onClose }) => {
  if (!data) {
    return null; 
  }

  // Helper to safely access nutrients
  const getNutrient = (key: keyof NutrientDetails) => data.nutrients?.[key];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} 
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalTitle}>{data.food_name}</Text>
            
            {/* General Details Section */}
            <Text style={styles.sectionTitle}>General Details</Text>
            <DetailRow label="Serving Size" value={data.serving_size} />
            <DetailRow label="Brand" value={data.brand} />
            <DetailRow label="Categories" value={data.categories} />
            <DetailRow label="Ingredients" value={data.ingredients_text} />
            <DetailRow label="Allergens" value={data.allergens} />
            <DetailRow label="Origins" value={data.origins} />
            <DetailRow label="Product Code" value={data.product_code} />

            {/* Nutrition Details Section */}
            {data.nutrients && (
              <>
                <Text style={styles.sectionTitle}>Nutrition Facts</Text>
                <NutrientRow label="Calories" value={getNutrient('calories')} unit=" kcal" />
                <NutrientRow label="Energy" value={getNutrient('energy')} unit=" kJ" />
                <NutrientRow label="Proteins" value={getNutrient('proteins')} unit="g" />
                <NutrientRow label="Carbohydrates" value={getNutrient('carbohydrates')} unit="g" />
                <NutrientRow label="Salt" value={getNutrient('salt')} unit="g" />
                <NutrientRow label="Sodium" value={getNutrient('sodium')} unit="mg" />
                {}
              </>
            )}

          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20, 
    paddingBottom: 60,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', 
    maxHeight: '85%', 
  },
  scrollViewContent: {
    paddingBottom: 20, 
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
    color: '#007AFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    flexShrink: 1, 
    textAlign: 'right',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingLeft: 10,
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#666',
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DetailedNutritionModal; 