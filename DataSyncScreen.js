import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, Share } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome } from '@expo/vector-icons';

const DataSyncScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const { apiUrl } = useApiUrl();

  const handleImport = async () => {
    try {
      if (!selectedFile) {
        Alert.alert('No File Selected', 'Please select an SQL file');
        return;
      }
  
      const formData = new FormData();
      const file = {
        uri: selectedFile,
        type: 'application/sql',
        name: 'sqlFile.sql', // do not change
      };
  
      formData.append('sqlFile', file);
  
      const compurl = `${apiUrl}/attappthree/import_data.php`
      const response = await axios.post( compurl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle success
      console.log(response.data);
  
      Alert.alert('Import Successful', 'SQL file imported successfully');
    } catch (error) {
      // Handle error
      console.error('Error importing file:', error);
  
      Alert.alert('Import Failed', 'Error importing SQL file');
    }
  };
  

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/*' });
      console.log('DocumentPicker result:', result);
      setSelectedFileName(result);
  
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const handleExport = () => {
    // Display a confirmation alert
    Alert.alert(
      'Confirm Export',
      'This will open the browser and download the file.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Export',
          onPress: () => {
            // User pressed Export, proceed with opening the browser
            const exportUrl = `${apiUrl}/attappthree/export_data.php`;
            WebBrowser.openBrowserAsync(exportUrl)
              .then(result => {
                if (result.type === 'cancel') {
                  Alert.alert('Export Canceled', 'The export operation was canceled.');
                }
              })
              .catch(error => {
                console.error('Error opening browser:', error);
                Alert.alert('Export Failed', 'Error opening the export URL');
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card>
        <Card.Content>
            <Title>Import Data</Title>

            <TouchableOpacity onPress={pickDocument}>
                <Paragraph>
                {selectedFile ? (
                    <>
                    <FontAwesome name="file" size={16} color="#333" style={{ marginRight: 8 }} />
                    Selected File: {selectedFileName.assets[0].name}
                    </>
                ) : (
                    <>
                    <FontAwesome name="file" size={16} color="#aaa" style={{ marginRight: 8 }} />
                    Select SQL File
                    </>
                )}
                </Paragraph>
            </TouchableOpacity>
        </Card.Content> 

        <Card.Actions>
          <Button onPress={handleImport}>Import SQL File</Button>
        </Card.Actions>
      </Card>

      {/* Export Card */}
      <Card style={{ marginTop: 16 }}>
        <Card.Content>
          <Title>Export Data</Title>
          <Paragraph>Export SQL data to a file</Paragraph>
        </Card.Content>

        <Card.Actions>
          <Button onPress={handleExport}>Export SQL File</Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default DataSyncScreen;
