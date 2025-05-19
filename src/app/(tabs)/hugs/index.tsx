import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {styles} from './index.style';
import { useHugs } from './useHugs';

const HugsScreen: React.FC = () => {

    const {hugs} = useHugs();
    return (
        <View style={styles.container}>
            <Text>Hugs Screen</Text>
        </View>
    );
};



export default HugsScreen;