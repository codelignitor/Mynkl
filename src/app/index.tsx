import { RootState } from '@/src/store';
import { Redirect } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const App = () => {
    const isUserLoggedIn = useSelector((state: RootState) => state.auth.isUserLoggedIn);

    if (isUserLoggedIn === undefined) {
        // Optionally show a loading indicator while auth state is being determined
        return <View style={styles.container} />;
    }

    if (isUserLoggedIn) {
        return <Redirect href="/(tabs)/home" />;
    } else {
        return <Redirect href="/(auth)" />;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default App;
