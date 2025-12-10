import AchievementScreen from '@/src/components/AchievementScreen/AchievementScreen'
import React from 'react';
import { View } from 'react-native';

const EmotionalAI_TrendsScreen = () => {
  return (
    <View style={{ flex: 1 }}> 
      {/*  Screen 1: Rising Light (Yellow theme) */}
            {/* <AchievementScreen
            bannerText="Your Mood is Rising!"
            bannerEmoji="😊"
            badgeTitle="RISING LIGHT"
            mainHeading="You've been shining brighter!"
            mainEmoji="☀️"
            subHeading="More happy days lately."
            subEmoji=""
            achievementTitle="'RISING LIGHT'"
            achievementSubtitle="HAPPINESS BOOST"
            achievementIcon="☀️"
            buttonText="Continue Uplifting Activity"
            gradientColors={['#fef4d4', '#fef0c7', '#fee8b0']}
            bannerColor="#ffcc66"
            buttonColor="#ffdb4d"
            ribbonColor="#ffb84d"
            ribbonTextColor="#8b5a00"
            decorativeColor="#ffd966"
            statusBarStyle="dark-content"
            emojiImage={require('../../assets/images/Copy_of_Happiness_Trend_Rising__Rising_Light_Badge_-removebg-preview.png')}
            onContinuePress={() => console.log('Continue pressed')}
            onAddToJournalPress={() => console.log('Add to journal pressed')}
            /> */}

            {/* // Screen 2: Heart Full (Orange/Coral theme) */}
            {/* <AchievementScreen
            bannerText="Your Gratitude is Soaring!"
            bannerEmoji="😊"
            badgeTitle="HEART FULL"
            mainHeading="Your heart's expanding"
            mainEmoji="✨💫"
            subHeading="More grateful days lately."
            subEmoji="📈"
            achievementTitle="'HEART FULL'"
            achievementSubtitle="GRATITUDE TREND"
            achievementIcon="❤️"
            buttonText="Continue Appreciative Activity"
            gradientColors={['#ff9b7f', '#ff8d6b', '#ffb380']}
            bannerColor="#ff7f5f"
            buttonColor="#ff8563"
            ribbonColor="#ffb84d"
            ribbonTextColor="#8b3000"
            decorativeColor="#ffb84d"
            statusBarStyle="light-content"
            emojiImage={require('../../assets/images/Copy_of_Happiness_Trend_Rising__Rising_Light_Badge_-removebg-preview.png')}
            onContinuePress={() => console.log('Continue pressed')}
            onAddToJournalPress={() => console.log('Add to journal pressed')}
            /> */}

            {/* Screen 3: Resilience Rising (Blue/Purple theme) */}
            <AchievementScreen
            bannerText="Better Days Ahead!"
            bannerEmoji="😊"
            badgeTitle="RESILIENCE RISING"
            mainHeading="You're bouncing back!"
            mainEmoji="🌈"
            subHeading="Fewer sad days lately."
            subEmoji="📈"
            achievementTitle="'RESILIENCE RISING'"
            achievementSubtitle="SADNESS RECOVERY"
            achievementIcon="⬆️"
            buttonText="Continue Healing Activity"
            gradientColors={['#b8c5e8', '#a8b9e5', '#98aee2']}
            bannerColor="#8fa5d9"
            buttonColor="#6b8fd9"
            ribbonColor="#c5d8f5"
            ribbonTextColor="#2d4a8b"
            decorativeColor="#a8b9e5"
            statusBarStyle="dark-content"
            emojiImage={require('../../assets/images/Copy_of_Happiness_Trend_Rising__Rising_Light_Badge_-removebg-preview.png')}
            onContinuePress={() => console.log('Continue pressed')}
            onAddToJournalPress={() => console.log('Add to journal pressed')}
            />
        </View>
    )
}

export default EmotionalAI_TrendsScreen
