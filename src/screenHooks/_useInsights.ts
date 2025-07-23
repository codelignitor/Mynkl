import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const useInsights = () => {
  const moodChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2, 2.2, 1, 2.5, 3.2, 2, 4],
        color: () => 'white',
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: () => '#b3b3b3',
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
      fill: '#4CAF50',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(255,255,255,0.1)',
      strokeWidth: 1,
    },
  };

  const suggestions = [
    'Try video chats in the afternoon for better energy.',
    'You enjoy philosophical topics—want more of those?',
  ];

  return { moodChartData, chartConfig, suggestions };
};

export default useInsights;
