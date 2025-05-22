import { logout } from '@/src/store/slices/authSlice';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const handleLogout = () => {

        dispatch(logout())
        router.push('/(auth)');
       
    };

    return (
        <View style={styles.container}>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;