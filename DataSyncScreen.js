import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';

const DataSyncScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const { apiUrl } = useApiUrl();
  const [api, setApiUrl] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiUrl = await SecureStore.getItemAsync('apiUrl');
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
      }
    };

    fetchApiUrl();
  }, []);

  const check = [api || apiUrl];

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

      const compurl = `${check}/attappthree/import_data.php`;
      const response = await axios.post(compurl, formData, {
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
            const exportUrl = `${check}/attappthree/export_data.php`;
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

  useEffect(() => {
    if (api) {
      console.log('api:', api);
      fetchOptions();
    }
  }, [api]);

  useEffect(() => {
    if (apiUrl) {
      console.log('api:', apiUrl);
      fetchOptions();
    }
  }, [apiUrl]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleCSVExport = async () => {
    if (!selectedOption) {
      Alert.alert("error", "select a valid option");
      return;
    }
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
          onPress: async () => {
            

            const exportUrl = `${check}/attappthree/csvex.php?table=${selectedOption}`;

            try {
              const result = await WebBrowser.openBrowserAsync(exportUrl);
              if (result.type === 'cancel') {
                Alert.alert('Export Canceled', 'The export operation was canceled.');
              }
            } catch (error) {
              console.error('Error opening browser:', error);
              Alert.alert('Export Failed', 'Error opening the export URL');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${check}/attappthree/getOptions.php`);
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching options:', error);
      Alert.alert('Error', 'Error fetching options');
    }
  };

  const handleViewLogs = async () => {
    try {
      const response = await axios.get(`${check}/attappthree/view_logs.php`);

      if (response.data.success) {
        // Display logs in a scrollable alert
        Alert.alert(
          'View Logs',
          response.data.logs,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', 'Failed to fetch logs.');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      Alert.alert('Error', 'Failed to fetch logs.');
    }
  };

  const handleDropdata = async () => {
    Alert.alert(
        'Confirm Export',
        'This will open the browser and download the file.', 
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              try {
                const response = await axios.get(`${check}/attappthree/dropall.php`);
                console.log(response.data)
                if (response.data) {
                  Alert.alert('Event Data Wiped',`Data Wiped Successfuly!`);
                } else {
                  Alert.alert('Error', 'Something Went Wrong, Please Try Again.');
                }
              } catch (error) {
                console.error('Error fetching logs:', error);
                Alert.alert('Error', 'Failed to fetch logs.');
              }
            }
          }
        ]
      );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
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
          <Button onPress={handleImport}>Import SQL File </Button>
        </Card.Actions>
      </Card>

      {/* Export SQL File */}
      <Card style={{ marginTop: 16 }}>
        <Card.Content>
          <Title>Export SQL File</Title>
          <Paragraph>Export SQL data to a file</Paragraph>
        </Card.Content>

        <Card.Actions>
          <Button onPress={handleExport}> Export SQL File</Button>
        </Card.Actions>
      </Card>
      {/* Export SQL File */}
      <Card style={{ marginTop: 16 }}>
        <Card.Content>
          <Title>Delete All Events</Title>
          <Paragraph>Wipe Event Data, reasons may include: new school year, server migration</Paragraph>
        </Card.Content>

        <Card.Actions>
          <Button onPress={handleDropdata}>     Wipe Data      </Button>
        </Card.Actions>
      </Card>

      {/* Export CSV File */}
      <Card style={{ marginTop: 16 }}>
        <Card.Content>
          <Title>Export CSV File</Title>
          <Picker
            selectedValue={selectedOption}
            onValueChange={handleOptionChange}
            style={{ backgroundColor: '#f5f5f5', marginVertical: 8 }}
          >
            <Picker.Item label="Select an Event Option..." value={null} />
            {options && Array.isArray(options) && options.length > 0 && options.map((option, index) => (
                option !== '' && (
                  <Picker.Item
                    key={index}
                    label={option}
                    value={option}
                  />
                )
            ))}
          </Picker>
        </Card.Content>

        <Card.Actions>
          <Button onPress={handleCSVExport}> Export CSV File </Button>
        </Card.Actions>
      </Card>

      {/* View Logs Card */}
      <Card style={{ marginTop: 16 }}>
        <Card.Content>
          <Title>View Logs</Title>
          <Paragraph>connection logs</Paragraph>
        </Card.Content>

        <Card.Actions>
          <Button onPress={handleViewLogs}>      View Logs     </Button>
        </Card.Actions>
      </Card>
      {/* View Logs Card */}
    </ScrollView>
  );
};

export default DataSyncScreen;
