import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState,useRef } from 'react';
import { ActivityIndicator, Appearance, Pressable, Text, TouchableOpacity, View } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { SwipeListView } from 'react-native-swipe-list-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './style';
import { BannerAd, BannerAdSize, TestIds,useForeground  } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-8455070538083358/3439377784';



const DataShow = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { selectedInterval, statusCode } = route.params || {};
    const [savedWebsites, setSavedWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentInterval, setCurrentInterval] = useState(null);
    const [theme, setTheme] = useState('LIGHT');

    useEffect(() => {
        console.log('Route params:', route.params);
    }, [route.params]);
    const bannerRef = useRef<BannerAd>(null);
    useForeground(() => {
        Platform.OS === 'android' && bannerRef.current?.load();
      })

    useEffect(() => {
        const initialize = async () => {
            await fetchSavedWebsites();
            await createNotificationChannel();
            await requestNotificationPermission();
        };
        initialize();
    }, []);

    useEffect(() => {
        const colorScheme = Appearance.getColorScheme();
        console.log(colorScheme, "colorScheme");
        if (theme === "light") {
            setTheme('LIGHT');
        } else {
            setTheme("DARK");
        }
    }, [theme]);

    useEffect(() => {
        if (selectedInterval !== null) {
            updateSelectedInterval();
        }
    }, [selectedInterval]);

    useEffect(() => {
        if (currentInterval !== null) {
            startBackgroundService();
        }
    }, [currentInterval]);

    useFocusEffect(
        useCallback(() => {
            const refreshData = async () => {
                setLoading(true);
                await fetchSavedWebsites();
                setLoading(false);
            };

            refreshData();
        }, [])
    );

    useEffect(() => {
        // Log an event when the component is mounted
        logCustomEvent();
    }, []);

    const logCustomEvent = async () => {
        try {
            await analytics().logEvent('hosting_react_native', {
                screen: 'DataShow',
                purpose: 'displaying saved websites'
            });
            console.log('Custom event logged successfully');
        } catch (error) {
            console.error('Error logging custom event:', error.message);
        }
    };

    const fetchSavedWebsites = async () => {
        try {
            const serializedData = await AsyncStorage.getItem('savedWebsites');
            if (serializedData) {
                const websiteData = JSON.parse(serializedData);
                setSavedWebsites(websiteData);
            } else {
                console.log('No saved websites found');
            }
        } catch (error) {
            console.error('Error retrieving saved websites:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteWebsite = async (index) => {
        try {
            const updatedWebsites = savedWebsites.filter((_, i) => i !== index);
            await AsyncStorage.setItem('savedWebsites', JSON.stringify(updatedWebsites));
            setSavedWebsites(updatedWebsites);
        } catch (error) {
            console.error('Error deleting website:', error.message);
        }
    };

    const editWebsite = (index) => {
        const websiteToEdit = savedWebsites[index];
        navigation.navigate('Home', { website: websiteToEdit, selectedInterval: currentInterval, index });
    };

    const updateSelectedInterval = async () => {
        if (selectedInterval !== null) {
            await AsyncStorage.setItem('selectedInterval', JSON.stringify(selectedInterval));
            setCurrentInterval(selectedInterval);
            await updateStatusCodes();
        }
    };

    const startBackgroundService = async () => {
        const storedInterval = await AsyncStorage.getItem('selectedInterval');
        const interval = storedInterval ? parseInt(storedInterval, 10) : 15;

        if (BackgroundService.isRunning()) {
            await BackgroundService.stop();
        }

        const veryIntensiveTask = async (taskData) => {
            const { delay } = taskData;
            while (BackgroundService.isRunning()) {
                await updateStatusCodes();
                await new Promise(resolve => setTimeout(resolve, delay * 1000));
            }
        };

        const options = {
            taskName: 'BackgroundTask',
            taskTitle: 'Background Service',
            taskDesc: 'Updating website status codes.',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            parameters: {
                delay: interval * 60,
            },
        };

        await BackgroundService.start(veryIntensiveTask, options);
    };

    const updateStatusCodes = async () => {
        try {
            const storedWebsites = await AsyncStorage.getItem('savedWebsites');
            if (storedWebsites) {
                const websites = JSON.parse(storedWebsites);
                const updatedWebsites = await Promise.all(
                    websites.map(async (website) => {
                        try {
                            const response = await axios.get(website.url);
                            return { ...website, statusCode: response.status };
                        } catch (error) {
                            let errorMessage = 'Network Error';
                            let statusCode = 'Error';
                            if (error.response) {
                                statusCode = error.response.status;
                                switch (statusCode) {
                                    case 404:
                                        errorMessage = 'Not Found';
                                        break;
                                    case 500:
                                        errorMessage = 'Server Error';
                                        break;
                                    default:
                                        errorMessage = 'Error Occurred';
                                }
                            }
                            return { ...website, statusCode, errorMessage };
                        }
                    })
                );
                await AsyncStorage.setItem('savedWebsites', JSON.stringify(updatedWebsites));
                setSavedWebsites(updatedWebsites);
            }
        } catch (error) {
            console.error('Error updating status codes:', error.message);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.conter}>
            
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    networkExtras: {
                        collapsible: 'bottom',
                    },
                }}
            />

            <SwipeListView
                data={savedWebsites}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    const isSuccess = item.statusCode === 200;
                    const iconColor = isSuccess ? 'green' : 'red';

                    return (
                        <View style={styles.SwipeListView}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ alignSelf: "center" }}>
                                    <AntDesign name="checkcircle" size={20} color={iconColor} />
                                </View>
                                <View>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={{ color: "blue" }}>{item.url}</Text>
                                </View>
                                <View>
                                    <Text style={styles.itemName}>
                                        Status Code: {item.statusCode || 'Unavailable'}
                                    </Text>
                                    <Text style={styles.itemName}>Interval: {item.selectedInterval}</Text>
                                </View>
                            </View>
                        </View>
                    );
                }}
                renderHiddenItem={({ item, index }) => (
                    <View style={styles.editView}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => editWebsite(index)}>
                            <Text style={{ color: 'white' }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.DeletButTON}
                            onPress={() => deleteWebsite(index)}>
                            <Text style={{ color: 'white' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                leftOpenValue={75}
                rightOpenValue={-75}
            />
            <View style={styles.AddView}>
                <Pressable style={styles.AddButton} onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="plus" size={30} color="white" />
                </Pressable>
            </View>
           
        </View>
    );
};

export default DataShow;
