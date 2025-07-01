import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HugListScreen from '../hugs_List';

const { width } = Dimensions.get('window');
const STORAGE_KEY = 'hugProgress';
const totalHugs = 5;

const HugMissionScreen = () => {
    const [sentHugs, setSentHugs] = useState(0);
    const [showHugList, setShowHugList] = useState(false);

    const progress = sentHugs / totalHugs;

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const { count, timestamp } = JSON.parse(saved);
                    const now = Date.now();
                    const diff = now - timestamp;
                    if (diff > 24 * 60 * 60 * 1000) {
                        await AsyncStorage.removeItem(STORAGE_KEY);
                        setSentHugs(0);
                    } else {
                        setSentHugs(count);
                    }
                }
            } catch (err) {
                console.error('Error loading hug progress:', err);
            }
        };
        loadProgress();
    }, []);

    const saveProgress = async (count) => {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ count, timestamp: Date.now() })
            );
        } catch (err) {
            console.error('Error saving hug progress:', err);
        }
    };

    const handleSendHug = () => {
        if (sentHugs < totalHugs) {
            Alert.alert('Hug Sent', 'Your hug has been sent 💖', [
                {
                    text: 'OK',
                    onPress: () => {
                        const newCount = sentHugs + 1;
                        setSentHugs(newCount);
                        saveProgress(newCount);
                    },
                },
            ]);
        } else {
            Alert.alert('Limit Reached', 'You can only send 5 hugs per day.');
        }
    };

    if (showHugList) {
        return (
            <HugListScreen
                sentHugs={sentHugs}
                handleSendHug={handleSendHug}
                setShowHugList={setShowHugList}
                totalHugs={totalHugs}
            />
        );
    }

    return (
        <LinearGradient
            colors={['#E59AB2', '#EFB894', '#B887CE']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.communityText}>COMMUNITY HUG</Text>
            <Text style={styles.title}>Daily Hug Mission:</Text>
            <Text style={styles.subtitle}>Send 5 Affirmations</Text>
            <Text style={styles.emoji}>💙</Text>
            <Text style={styles.progressText}>
                {sentHugs} of {totalHugs} hugs sent
            </Text>

            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>

            <View style={styles.rewardContainer}>
                <Text style={styles.rewardTitle}>Reward</Text>
                <Image
                    source={require('../../../assets/images/Kindness_champion.png')}
                    style={styles.rewardImage}
                />
                <Text style={styles.rewardLabel}>Kindness Champion</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => setShowHugList(true)}
                disabled={sentHugs >= totalHugs}
            >
                <Text style={styles.buttonText}>
                    {sentHugs >= totalHugs ? 'Daily Limit Reached' : 'Find People to Hug'}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
    },
    communityText: {
        marginTop: 20,
        fontSize: 14,
        letterSpacing: 1,
        color: '#fff',
        marginBottom: 10,
        fontWeight: '600',
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#fff',
    },
    subtitle: {
        fontSize: 32,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
    },
    emoji: {
        fontSize: 32,
        marginVertical: 5,
    },
    progressText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    progressBarBackground: {
        width: width * 0.6,
        height: 10,
        backgroundColor: '#D4BEE0',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 30,
    },
    progressBarFill: {
        height: 10,
        backgroundColor: '#F0B38B',
    },
    rewardContainer: {
        backgroundColor: '#F5DFCA',
        width: width * 0.75,
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 40,
    },
    rewardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    rewardImage: {
        width: 80,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    rewardLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    button: {
        backgroundColor: '#F5DFCA',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: '#2D2D2D',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HugMissionScreen;
