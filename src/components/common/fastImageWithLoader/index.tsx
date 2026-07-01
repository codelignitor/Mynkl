import React, { useState } from 'react';
import {
    StyleProp,
    ImageStyle,
    ActivityIndicator,
    View,
    Image,
    ImageResizeMode,
    ImageSourcePropType,
} from 'react-native';

type ImageWithLoaderProps = {
    source: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    resizeMode?: ImageResizeMode;
    fallbackSource?: number;
};

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
    source,
    style,
    imageStyle,
    resizeMode = 'cover',
    fallbackSource = require('../../../assets/images/party_pic.jpg'),
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const showFallback =
        error ||
        !source ||
        (typeof source === 'object' &&
            'uri' in source &&
            (!source.uri || source.uri.trim() === ''));

    return (
        <View style={style}>
            {loading && (
                <ActivityIndicator
                    style={{ position: 'absolute', alignSelf: 'center', top: '45%' }}
                    size="small"
                    color="#888"
                />
            )}
            <Image
                source={showFallback ? fallbackSource : source}
                style={[{ width: '100%', height: '100%' }, imageStyle]}
                resizeMode={resizeMode}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                    setError(true);
                }}
            />
        </View>
    );
};

export default ImageWithLoader;
