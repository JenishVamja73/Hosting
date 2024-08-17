import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [statusCode, setStatusCode] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = [
    { label: '15 Minutes', value: 15 },
    { label: '30 Minutes', value: 30 },
    { label: '1 hour', value: 60 }
  ];

  useFocusEffect(
    useCallback(() => {
      if (route.params?.website) {
        const { website, selectedInterval } = route.params;
        if (website) {
          setWebsiteUrl(website.url || '');
          setWebsiteName(website.name || '');
          setStatusCode(website.statusCode || null);
          setIsUpdate(true);
        }
        if (selectedInterval != null) {
          setSelectedInterval(selectedInterval);
        }
      } else {
        resetForm();
      }
    }, [route.params])
  );

  useEffect(() => {
    const createNotificationChannel = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };
    createNotificationChannel();
  }, []);

  const resetForm = () => {
    setWebsiteUrl('');
    setWebsiteName('');
    setStatusCode(null);
    setSelectedInterval(null);
    setIsUpdate(false);
  };

  const checkStatusCode = async () => {
    if (websiteUrl) {
      try {
        const response = await axios.get(websiteUrl);
        setStatusCode(response.status);
      } catch (error) {
        if (error.response) {
          setStatusCode(error.response.status);
        } else {
          setStatusCode('Error');
          console.error('Error checking status code:', error);
        }
      }
    }
  };

  const handleSave = async () => {
    if (!websiteUrl || !websiteName || selectedInterval === null) {
      console.error('All fields are required.');
      return;
    }

    try {
      const websiteData = { url: websiteUrl, name: websiteName, statusCode, selectedInterval };
      let existingWebsites = [];
      const existingSerializedData = await AsyncStorage.getItem('savedWebsites');
      if (existingSerializedData) {
        existingWebsites = JSON.parse(existingSerializedData);
      }

      if (isUpdate) {
        const { index } = route.params;
        existingWebsites[index] = websiteData;
      } else {
        existingWebsites.push(websiteData);
      }

      await AsyncStorage.setItem('savedWebsites', JSON.stringify(existingWebsites));
      await scheduleNotification();
      navigation.navigate('DataShow', { selectedInterval, statusCode });
    } catch (error) {
      console.error('Error saving website:', error);
    }
  };

  const handleDropdownChange = (item) => {
    setSelectedInterval(item.value);
  };

  const scheduleNotification = async () => {
    try {
      if (selectedInterval && selectedInterval >= 15) {
        // Create a unique ID for each notification
        const notificationId = `notification_${Date.now()}`;

        const trigger = {
          type: TriggerType.INTERVAL,
          interval: selectedInterval * 60, // Convert minutes to seconds
        };

        const notificationTitle = `Monitoring ${websiteName} (${selectedInterval} mins)`;

        await notifee.createTriggerNotification(
          {
            id: notificationId,
            title: notificationTitle,
            body: `Monitoring ${websiteUrl} every ${selectedInterval} minutes.`,
            android: { channelId: 'default' },
          },
          trigger
        );

        console.log('Notification scheduled with ID:', notificationId);
      } else {
        console.error('Invalid interval: Minimum interval is 15 minutes.');
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };


  return (
    <View style={styles.mainUrlView}>
      <View style={styles.urlView}>
        {/* <Text style={styles.urlWEbText}>Web URL:</Text> */}
        <FontAwesome
          name="flag" size={20} color={'black'} style={{ textAlign: "center", }} />
        <View style={{ marginLeft: "10%" }}>
          <TextInput placeholder='Enter website Name' value={websiteUrl}
            onChangeText={setWebsiteUrl}
            onBlur={checkStatusCode}
            style={styles.urlTextInput} />
          <View style={{ height: 1, backgroundColor: "black", width: 330 }} />
        </View>

        {/* <TextInput
          placeholder="Enter website URL"
          
          
        /> */}
      </View>
      <View style={styles.NameView}>
        {/* <Text style={styles.urlWEbText}>Name:</Text> */}
        <Feather name="link-2" size={20} color={"black"} style={{ textAlign: "center", }} />
        <View style={{ marginLeft: "10%" }}>
          <TextInput
            placeholder="Enter website name"
            style={styles.urlTextInput}
            value={websiteName}
            onChangeText={setWebsiteName}
            onBlur={checkStatusCode}
          />
          <View style={{ height: 1, backgroundColor: "black", width: 330 }} />
        </View>
      </View>


      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: "5%" }}>
        {/* <Text style={{ color: 'black', fontSize: 20 }}>
          Interval Schedule
        </Text> */}
        <Ionicons name="notifications" size={30} color={"black"} style={{ textAlign: "center" }} />
        <View style={{ marginLeft: "8%" }}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            maxHeight={370}
            labelField="label"
            valueField="value"
            placeholder={isFocus ? 'Select interval' : 'interval Time'}
            value={selectedInterval}
            onChange={handleDropdownChange}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </View>
      </View>
      {statusCode !== null && (
        <View style={styles.statusCodeView}>
          <Text style={{ fontSize: 20, color: 'black' }}>
            Status Code: {statusCode}
          </Text>
        </View>
      )}
      <View style={styles.AddView}>
        <Button style={styles.AddButton} onPress={handleSave} title={isUpdate ? 'Update' : 'Save'}>

        </Button>
      </View>
    </View>
  );
};

export default Home;
