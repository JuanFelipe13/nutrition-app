import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Searchbar, IconButton } from 'react-native-paper';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCamera: (imageUri: string) => void;
  onBarcodeScan: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCamera, onBarcodeScan }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleCamera = () => {
    onCamera("dummy-image-uri");
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar alimento..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
      />
      <View style={styles.buttonsContainer}>
        <IconButton
          icon="camera"
          size={24}
          onPress={handleCamera}
          style={styles.iconButton}
        />
        <IconButton
          icon="barcode-scan"
          size={24}
          onPress={onBarcodeScan}
          style={styles.iconButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    borderRadius: 20,
    elevation: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    margin: 0,
    backgroundColor: '#f5f5f5',
  },
});

export default SearchBar; 