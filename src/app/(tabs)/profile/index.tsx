import { RootState } from '@/src/store';
import { logout } from '@/src/store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Button, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ProfileScreen = () => {
    const dispatch = useDispatch();
     const username  = useSelector((state: RootState) => state.auth.username);
    // Example: get user info from redux store
    const user = useSelector((state: any) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/(auth)');
    };

    return (
        <View style={styles.container}>
           <Ionicons name="person-circle-outline" size={100} color="#000" />
            <Text style={styles.name}>{username || 'User Name'}</Text>
            
            <View style={styles.buttonContainer}>
            </View>

            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center', borderBottomColor:'gray', borderBottomWidth:1, width:'100%', paddingVertical: 12}} onPress={() => router.push("/chat")}>
                <Text>Chats</Text>
                <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
             <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center', borderBottomColor:'gray', borderBottomWidth:1, width:'100%', paddingVertical: 12}} onPress={() => router.push("/chat/room")}>
                <Text>Chat Rooms</Text>
                <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button title="Logout" onPress={handleLogout} color="#d9534f" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#888',
        marginBottom: 24,
    },
    buttonContainer: {
        width: '100%',
        marginVertical: 8,
    },
});

export default ProfileScreen;